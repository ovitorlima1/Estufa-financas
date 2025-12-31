
import React, { useState } from 'react';
import { Card } from './Card';
import { Category, TransactionType } from '../types';
import { COLORS } from '../constants';

interface CategoriesManagerProps {
  categories: Category[];
  onAddCategory: (cat: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<TransactionType>('expense');
  const [newIcon, setNewIcon] = useState('📁');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    onAddCategory({
      name: newName,
      type: newType,
      icon: newIcon,
      color: newType === 'income' ? COLORS.income : COLORS.expense,
      user_id: 'user-1' // Simulado
    });
    setNewName('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Categorias</h2>
          <p className="text-slate-500">Organize seus lançamentos por grupos.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          {showAdd ? 'Cancelar' : 'Nova Categoria'}
        </button>
      </div>

      {showAdd && (
        <Card title="Adicionar Categoria">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
              <input 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ex: Assinaturas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select 
                value={newType} 
                onChange={e => setNewType(e.target.value as TransactionType)}
                className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ícone</label>
              <input 
                value={newIcon} 
                onChange={e => setNewIcon(e.target.value)}
                className="w-20 px-4 py-2 border border-slate-200 rounded-lg text-center"
              />
            </div>
            <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold">Salvar</button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <Card key={cat.id} className="relative group">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
              >
                {cat.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{cat.name}</h4>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  {cat.type === 'income' ? 'Receita' : 'Despesa'}
                </p>
              </div>
              {cat.user_id && (
                <button 
                  onClick={() => onDeleteCategory(cat.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-2"
                >
                  🗑️
                </button>
              )}
              {!cat.user_id && <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded uppercase font-bold">Sistema</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
