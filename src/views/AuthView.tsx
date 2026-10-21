import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Sprout, ShieldCheck, Lock, Mail, User, Sparkles } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { loginUser, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser(email, password);
        if (!res.success) setError(res.error || 'Erro ao efetuar login.');
      } else {
        const res = await registerUser(name, email, password);
        if (!res.success) setError(res.error || 'Erro ao efetuar cadastro.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await loginUser('camila@plantinha.app', 'senhaSegura123');
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0b1712] border border-emerald-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 p-0.5 shadow-lg flex items-center justify-center">
            <Sprout className="w-6 h-6 text-emerald-950 stroke-[2.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
            Minha Plantinha
          </h1>
          <p className="text-xs text-emerald-300/70">
            {mode === 'login' ? 'Acesse seu diário botânico privado' : 'Crie sua conta para acompanhar seu jardim'}
          </p>
        </div>

        {/* Mode Toggle Pills */}
        <div className="grid grid-cols-2 gap-1 bg-[#07130e] p-1 rounded-xl border border-emerald-900/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login' ? 'bg-emerald-600 text-emerald-950 font-bold shadow-sm' : 'text-emerald-400/70 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode('cadastro'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'cadastro' ? 'bg-emerald-600 text-emerald-950 font-bold shadow-sm' : 'text-emerald-400/70 hover:text-white'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'cadastro' && (
            <Input
              label="Nome Completo *"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Camila Duarte"
            />
          )}

          <Input
            label="Email *"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
          />

          <Input
            label="Senha (mínimo de 8 caracteres) *"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            helperText="Nunca compartilhe sua senha com ninguém."
          />

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
            {mode === 'login' ? 'Entrar no Diário' : 'Criar Minha Conta'}
          </Button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-2 border-t border-emerald-900/50 space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/60 border border-emerald-800/50 text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Acesso Rápido com Perfil Demo (Camila Duarte)</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autenticação isolada por usuário com RLS</span>
          </div>
        </div>

      </div>
    </div>
  );
};
