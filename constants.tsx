
import { Category } from './types';

export const COLORS = {
  brandDark: '#0d2111',
  brandLight: '#b6e391',
  primary: '#166534',
  secondary: '#15803d',
  accent: '#a3e635',
  income: '#22c55e',
  expense: '#ef4444',
  background: '#f8fafc',
};

export const DEFAULT_CATEGORIES: Category[] = [
  // Categorias de Despesas (Tabela gastos)
  { id: 'Alimentação', name: 'Alimentação', type: 'expense', color: '#ef4444', icon: '🍱', user_id: null },
  { id: 'Transporte', name: 'Transporte', type: 'expense', color: '#94a3b8', icon: '🚗', user_id: null },
  { id: 'Moradia', name: 'Moradia', type: 'expense', color: '#f59e0b', icon: '🏠', user_id: null },
  { id: 'Educação', name: 'Educação', type: 'expense', color: '#3b82f6', icon: '📚', user_id: null },
  { id: 'Assinaturas', name: 'Assinaturas', type: 'expense', color: '#6366f1', icon: '📺', user_id: null },
  { id: 'Lazer / Diversão', name: 'Lazer / Diversão', type: 'expense', color: '#ec4899', icon: '🎉', user_id: null },
  { id: 'Saúde / Cuidados', name: 'Saúde / Cuidados', type: 'expense', color: '#10b981', icon: '🏥', user_id: null },
  { id: 'Cartão de Crédito', name: 'Cartão de Crédito', type: 'expense', color: '#8b5cf6', icon: '💳', user_id: null },
  { id: 'Outros', name: 'Outros', type: 'expense', color: '#64748b', icon: '📦', user_id: null },
  
  // Categorias de Receitas (Tabela receitas)
  { id: 'Salário', name: 'Salário', type: 'income', color: '#22c55e', icon: '💰', user_id: null },
  { id: 'Vendas', name: 'Vendas', type: 'income', color: '#10b981', icon: '🏷️', user_id: null },
  { id: 'Dividendos', name: 'Dividendos', type: 'income', color: '#3b82f6', icon: '📈', user_id: null },
  { id: 'Freelance', name: 'Freelance', type: 'income', color: '#8b5cf6', icon: '💻', user_id: null },
  { id: 'Renda Extra', name: 'Renda Extra', type: 'income', color: '#f59e0b', icon: '🎁', user_id: null },
];
