
import React from 'react';
import { ViewState } from '../types';
import { COLORS } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onLogout: () => void;
}

const LogoIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50 20C33.4315 20 20 33.4315 20 50H80C80 33.4315 66.5685 20 50 20Z" 
      stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
    />
    <path d="M15 50H85" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    <path d="M25 50V80M75 50V80" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    <path d="M40 50V80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M60 50V80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M46 80H54V76C54 73.7909 52.2091 72 50 72C47.7909 72 46 73.7909 46 76V80Z" fill="currentColor"/>
    <path d="M15 80H85" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transações', icon: '💸' },
    { id: 'categories', label: 'Categorias', icon: '🏷️' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <aside style={{ backgroundColor: COLORS.brandDark }} className="w-64 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div 
            style={{ color: COLORS.brandLight }}
            className="w-10 h-10 flex items-center justify-center p-1"
          >
            <LogoIcon />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Estufa <span style={{ color: COLORS.brandLight }}>Finanças</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewState)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === item.id 
                ? 'bg-white/10 text-white shadow-inner' 
                : 'text-emerald-100 hover:bg-white/5'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-red-900/40 hover:text-red-200 transition-all"
        >
          <span>🚪</span>
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};
