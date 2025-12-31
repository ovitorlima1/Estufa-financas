
import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { CategoriesManager } from './components/CategoriesManager';
import { TransactionsList } from './components/TransactionsList';
import { TransactionForm } from './components/TransactionForm';
import { Auth } from './components/Auth';
import { ViewState, Transaction, Category } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingData, setRefreshingData] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userWhatsAppJid, setUserWhatsAppJid] = useState<string | null>(null);

  const mapDbToTransaction = (item: any, source: 'gastos' | 'receitas'): Transaction => {
    // Tratamento robusto para garantir que o valor seja numérico
    let rawValue = item.valor;
    if (typeof rawValue === 'string') {
      rawValue = rawValue.replace(',', '.');
    }
    const numericValue = parseFloat(rawValue) || 0;
    
    return {
      id: item.id,
      user_number: item.user_number || '',
      nome: item.nome || item.descricao || 'Sem descrição',
      // REGRA: Receitas são positivas, despesas são negativas
      valor: source === 'receitas' ? Math.abs(numericValue) : -Math.abs(numericValue),
      tipo: item.tipo || 'Outros',
      data_gasto: item.data_gasto || item.data_receita || item.created_at || new Date().toISOString(),
      created_at: item.created_at,
      source: source
    };
  };

  const fetchUserData = async (user: any) => {
    try {
      setRefreshingData(true);
      const phoneInMetadata = user.user_metadata?.phone_number || '';
      
      if (!phoneInMetadata) {
        setRefreshingData(false);
        return;
      }
      
      // REGRA FLEXÍVEL: Cria múltiplos formatos de busca para o mesmo número
      const digits = phoneInMetadata.replace(/\D/g, '');
      const searchTerms = [
        phoneInMetadata,
        digits,
        `55${digits.replace(/^55/, '')}`,
        `${digits}@s.whatsapp.net`
      ].filter(Boolean);
      const uniqueTerms = Array.from(new Set(searchTerms));

      const primaryJid = phoneInMetadata.includes('@') ? phoneInMetadata : `${digits}@s.whatsapp.net`;
      setUserWhatsAppJid(primaryJid);

      // BUSCA EM AMBAS AS TABELAS USANDO A REGRA FLEXÍVEL
      const [gastosRes, receitasRes] = await Promise.all([
        supabase.from('gastos').select('*').in('user_number', uniqueTerms),
        supabase.from('receitas').select('*').in('user_number', uniqueTerms)
      ]);

      if (gastosRes.error) console.error("Erro ao buscar gastos:", gastosRes.error.message);
      if (receitasRes.error) console.error("Erro ao buscar receitas:", receitasRes.error.message);

      const merged = [
        ...(gastosRes.data || []).map(t => mapDbToTransaction(t, 'gastos')),
        ...(receitasRes.data || []).map(t => mapDbToTransaction(t, 'receitas'))
      ];

      merged.sort((a, b) => new Date(b.data_gasto).getTime() - new Date(a.data_gasto).getTime());
      setTransactions(merged);
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
    } finally {
      setRefreshingData(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user);
      else {
        setTransactions([]);
        setUserWhatsAppJid(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleUpdateProfile = async (updates: { full_name?: string; phone_number?: string }) => {
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (!error && data.user) {
      setSession({ ...session, user: data.user });
      fetchUserData(data.user);
      alert("Perfil atualizado!");
    }
  };

  const handleAddTransaction = async (formData: any) => {
    if (!userWhatsAppJid) return alert("Configure seu WhatsApp.");

    try {
      const isIncome = formData.type === 'income';
      const targetTable = isIncome ? 'receitas' : 'gastos';
      
      const payload: any = {
        user_number: userWhatsAppJid,
        nome: formData.description,
        valor: isIncome ? Math.abs(formData.amount) : -Math.abs(formData.amount),
        tipo: formData.category_id,
      };

      if (isIncome) {
        payload.data_receita = formData.date;
      } else {
        payload.data_gasto = formData.date;
      }

      const { data, error } = await supabase.from(targetTable).insert([payload]).select();
      
      if (error) throw error;

      if (data) {
        const newTx = mapDbToTransaction(data[0], targetTable);
        setTransactions(prev => [newTx, ...prev].sort((a,b) => new Date(b.data_gasto).getTime() - new Date(a.data_gasto).getTime()));
        setShowTransactionModal(false);
      }
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    const { error } = await supabase.from(transaction.source).delete().eq('id', transaction.id);
    if (!error) setTransactions(transactions.filter(t => t.id !== transaction.id));
    else alert("Erro ao excluir");
  };

  if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-emerald-400">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-[10px] tracking-widest uppercase">Lendo Base de Dados...</p>
      </div>
  );
  if (!session) return <Auth onLogin={() => {}} />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={view} onViewChange={setView} onLogout={() => supabase.auth.signOut()} />
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {refreshingData && (
            <div className="fixed top-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded-full text-[10px] font-bold animate-pulse z-50 shadow-lg">
                Sincronizando...
            </div>
        )}
        {view === 'dashboard' && <Dashboard transactions={transactions} categories={categories} />}
        {view === 'transactions' && <TransactionsList transactions={transactions} categories={categories} onDelete={handleDeleteTransaction} onAddClick={() => setShowTransactionModal(true)} />}
        {view === 'categories' && <CategoriesManager categories={categories} onAddCategory={() => {}} onDeleteCategory={() => {}} />}
        {view === 'settings' && <Settings user={{...session.user, ...session.user.user_metadata, phone_number: userWhatsAppJid}} onUpdate={handleUpdateProfile} />}
      </main>
      {showTransactionModal && <TransactionForm categories={categories} onSubmit={handleAddTransaction} onCancel={() => setShowTransactionModal(false)} />}
    </div>
  );
};

export default App;
