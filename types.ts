
export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  user_id: string | null;
}

export interface Transaction {
  id: number;
  user_number: string;
  nome: string;
  valor: number;
  tipo: string;
  data_gasto: string;
  created_at?: string;
  source: 'gastos' | 'receitas'; // Identificador da tabela de origem
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  webhook_secret?: string;
}

export type ViewState = 'dashboard' | 'transactions' | 'categories' | 'settings' | 'auth';
