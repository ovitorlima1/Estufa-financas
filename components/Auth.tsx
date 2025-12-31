
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onLogin: () => void;
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

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase não configurado");

      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        let digitsOnly = phoneNumber.replace(/\D/g, '');
        
        // Garante o prefixo do Brasil 55
        if (digitsOnly.length >= 10 && !digitsOnly.startsWith('55')) {
          digitsOnly = '55' + digitsOnly;
        }

        if (digitsOnly.length < 12) {
          throw new Error("Insira o número com DDD (ex: 81 99999-9999).");
        }
        
        // IMPORTANTE: Adiciona o sufixo necessário para bater com o banco de dados
        const userIdentifier = `${digitsOnly}@s.whatsapp.net`;

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone_number: userIdentifier,
            }
          }
        });
        if (signUpError) throw signUpError;
        alert('Cadastro realizado! Verifique seu e-mail.');
        setIsLogin(true);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.brandDark }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4" style={{ color: COLORS.brandLight }}>
            <LogoIcon />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Estufa <span style={{ color: COLORS.brandLight }}>Finanças</span>
          </h1>
          <p className="text-emerald-100/60 mt-2">Gestão financeira vinculada ao WhatsApp.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">WhatsApp (DDD + Número)</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="81 9XXXX-XXXX"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Senha</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 mt-4 disabled:opacity-50"
              >
                {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Começar')}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-emerald-600 hover:text-emerald-700 text-sm"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
