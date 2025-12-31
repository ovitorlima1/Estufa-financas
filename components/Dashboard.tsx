
import React, { useMemo } from 'react';
import { Card } from './Card';
import { Transaction, Category } from '../types';
import { Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { COLORS } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, categories }) => {
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
      const val = Number(t.valor);
      if (val > 0) income += val;
      else expenses += Math.abs(val);
    });

    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenseMap: Record<string, number> = {};
    transactions.forEach(t => {
      if (Number(t.valor) < 0) {
        const catName = t.tipo || 'Outros';
        expenseMap[catName] = (expenseMap[catName] || 0) + Math.abs(Number(t.valor));
      }
    });

    return Object.entries(expenseMap).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const PIE_COLORS = [COLORS.brandLight, '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Resumo Financeiro</h2>
        <p className="text-slate-500">Monitorando suas receitas e gastos.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Receitas</p>
          <p className="text-2xl font-bold text-emerald-600">
            R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="border-t-4 border-t-red-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Despesas</p>
          <p className="text-2xl font-bold text-red-600">
            R$ {stats.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="border-t-4 border-t-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Líquido</p>
          <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
            R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribuição de Despesas">
          <div className="h-[250px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Nenhuma despesa para exibir.</div>
            )}
          </div>
        </Card>

        <Card title="Últimas Atividades">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 font-semibold text-slate-400 text-xs">Item</th>
                  <th className="pb-3 font-semibold text-slate-400 text-xs text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id}>
                    <td className="py-3">
                      <div className="font-medium text-slate-800 text-sm">{t.nome}</div>
                      <div className="text-[10px] text-slate-400">{new Date(t.data_gasto).toLocaleDateString('pt-BR')}</div>
                    </td>
                    <td className={`py-3 text-right font-bold text-sm ${Number(t.valor) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {Number(t.valor) >= 0 ? '+' : '-'} R$ {Math.abs(Number(t.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
