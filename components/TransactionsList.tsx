
import React, { useState } from 'react';
import { Card } from './Card';
import { Transaction, Category } from '../types';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (transaction: Transaction) => void;
  onAddClick: () => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, categories, onDelete, onAddClick }) => {
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => 
    (t.nome || '').toLowerCase().includes(search.toLowerCase()) || 
    (t.tipo || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Histórico de Lançamentos</h2>
          <p className="text-slate-500">Gestão centralizada de Gastos e Receitas.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg"
        >
          ➕ Novo Lançamento
        </button>
      </div>

      <Card>
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input 
              placeholder="Buscar por nome ou categoria..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 font-semibold text-slate-400 text-xs uppercase">Data</th>
                <th className="pb-3 font-semibold text-slate-400 text-xs uppercase">Nome</th>
                <th className="pb-3 font-semibold text-slate-400 text-xs uppercase">Categoria</th>
                <th className="pb-3 font-semibold text-slate-400 text-xs uppercase text-right">Valor</th>
                <th className="pb-3 font-semibold text-slate-400 text-xs uppercase text-center">Origem</th>
                <th className="pb-3 font-semibold text-slate-400 text-xs uppercase text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t) => (
                <tr key={`${t.source}-${t.id}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-sm text-slate-500">
                    {new Date(t.data_gasto).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 font-medium text-slate-800">{t.nome}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${t.source === 'receitas' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className={`py-4 text-right font-bold ${Number(t.valor) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Number(t.valor) >= 0 ? '+' : '-'} R$ {Math.abs(Number(t.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-[10px] text-slate-300 font-mono uppercase">{t.source}</span>
                  </td>
                  <td className="py-4 text-center">
                    <button 
                      onClick={() => onDelete(t)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-all"
                      title="Excluir lançamento"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Nenhum lançamento encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
