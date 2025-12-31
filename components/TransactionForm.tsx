
import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: Transaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onSubmit, onCancel, initialData }) => {
  const [type, setType] = useState<TransactionType>(initialData && Number(initialData.valor) >= 0 ? 'income' : 'expense');
  const [description, setDescription] = useState(initialData?.nome || '');
  const [amount, setAmount] = useState(initialData?.valor ? Math.abs(Number(initialData.valor)).toString() : '');
  const [categoryId, setCategoryId] = useState(initialData?.tipo || '');
  const [date, setDate] = useState(initialData?.data_gasto || new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtra categorias baseado no tipo selecionado (Receita ou Despesa)
  const filteredCategories = categories.filter(c => c.type === type);

  // Reseta a categoria selecionada ao trocar entre Receita/Despesa se a atual não for compatível
  useEffect(() => {
    if (categoryId && !filteredCategories.find(c => c.id === categoryId)) {
      setCategoryId('');
    }
  }, [type, filteredCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !categoryId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        description,
        amount: parseFloat(amount.replace(',', '.')),
        type,
        category_id: categoryId,
        date
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Lançamento de {type === 'income' ? 'Receita' : 'Despesa'}</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
            >
              📉 Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              📈 Receita
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição</label>
              <input
                placeholder={type === 'income' ? "Ex: Salário, Freela..." : "Ex: Mercado, Aluguel..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor (R$)</label>
                <input
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Categoria de {type === 'income' ? 'Receita' : 'Despesa'}</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione a fonte...</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'} disabled:opacity-50`}
          >
            {isSubmitting ? 'Processando...' : 'Confirmar Lançamento'}
          </button>
        </form>
      </div>
    </div>
  );
};
