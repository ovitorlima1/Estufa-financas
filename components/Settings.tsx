
import React, { useState } from 'react';
import { Card } from './Card';
import { UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile & { phone_number?: string };
  onUpdate: (updates: { full_name?: string; phone_number?: string }) => Promise<void>;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user.full_name);
  const [whatsapp, setWhatsapp] = useState(user.phone_number || '');

  const handleSave = async () => {
    setLoading(true);
    let cleanJid = whatsapp.trim();
    
    // Remove tudo que não é dígito para normalizar antes de adicionar o sufixo
    const digitsOnly = cleanJid.replace(/\D/g, '');
    
    if (digitsOnly) {
      // Garante que o número comece com 55 e termine com o sufixo
      const baseNumber = digitsOnly.startsWith('55') ? digitsOnly : '55' + digitsOnly;
      cleanJid = `${baseNumber}@s.whatsapp.net`;
    }

    await onUpdate({
      full_name: fullName,
      phone_number: cleanJid
    });
    
    setIsEditing(false);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        <p className="text-slate-500">Gerencie suas informações de perfil.</p>
      </header>

      <div className="max-w-xl">
        <Card title="Perfil do Usuário">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">E-mail (Login)</label>
              <input 
                disabled 
                value={user.email} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome Completo</label>
              <input 
                disabled={!isEditing}
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg transition-all ${
                  isEditing ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200 bg-slate-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">WhatsApp (JID)</label>
              <input 
                disabled={!isEditing}
                value={whatsapp} 
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ex: 81 99999-9999"
                className={`w-full px-4 py-2 border rounded-lg font-mono text-sm transition-all ${
                  isEditing ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200 bg-slate-50'
                }`}
              />
              {isEditing && (
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Dica: O sistema converterá automaticamente para o formato 55DDDNumero@s.whatsapp.net
                </p>
              )}
            </div>

            <div className="pt-4 flex gap-3">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all"
                >
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    disabled={loading}
                    onClick={handleSave}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
