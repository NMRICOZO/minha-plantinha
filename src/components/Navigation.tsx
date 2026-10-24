import React, { useState } from 'react';
import { useApp, ActiveTab } from '../context/AppContext.tsx';
import { 
  Home, 
  Sprout, 
  Cannabis,
  ImageIcon, 
  HeartHandshake, 
  Settings, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavigationProps {
  onOpenFeedback?: () => void;
  onOpenLegal?: (doc: 'termos' | 'privacidade' | 'cannabis_aviso') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenFeedback, onOpenLegal }) => {
  const { 
    activeTab, 
    setActiveTab, 
    cultivationMode,
    setCultivationMode,
    plants, 
    diaryEntries, 
    calculatedAlerts, 
    cannabisPlants,
    setIsWelcomeOpen 
  } = useApp();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Exactly 5 Main Navigation Items
  const navItems: NavItem[] = [
    { 
      id: 'dashboard', 
      label: 'Início', 
      icon: Home, 
      badge: calculatedAlerts.length > 0 ? calculatedAlerts.length : undefined 
    },
    { 
      id: 'plantas', 
      label: cultivationMode === 'cannabis' ? 'Espécimes' : 'Plantas', 
      icon: cultivationMode === 'cannabis' ? Cannabis : Sprout, 
      badge: cultivationMode === 'cannabis' ? cannabisPlants.length : plants.length 
    },
    { 
      id: 'diario', 
      label: 'Diário', 
      icon: ImageIcon, 
      badge: diaryEntries.length 
    },
    { 
      id: 'cuidados', 
      label: 'Cuidados', 
      icon: HeartHandshake 
    },
    { 
      id: 'configuracoes', 
      label: 'Ajustes', 
      icon: Settings 
    },
  ];

  return (
    <>
      {/* 1. Desktop / Tablet Sidebar (5 Main Items + Mode Selector + IA Entry Point) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 min-h-[calc(100vh-61px)] justify-between select-none shrink-0 transition-colors">
        <div className="space-y-6">
          
          {/* Header Mode Badge & Tutorial */}
          <div className="px-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] font-mono">
              {cultivationMode === 'cannabis' ? 'Modo Medicinal' : 'Modo Horta'}
            </span>
            <button
              onClick={() => setIsWelcomeOpen(true)}
              className="text-[11px] text-[var(--accent-hover)] hover:underline flex items-center gap-1 cursor-pointer font-medium p-1 min-h-[44px]"
              title="Abrir passo a passo de introdução"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tutorial</span>
            </button>
          </div>

          {/* Mode Switcher Block inside Sidebar */}
          <div className="p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center">
            <button
              onClick={() => setCultivationMode('horta')}
              className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                cultivationMode === 'horta'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Horta</span>
            </button>
            <button
              onClick={() => setCultivationMode('cannabis')}
              className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                cultivationMode === 'cannabis'
                  ? 'bg-emerald-800 text-emerald-100 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Cannabis className="w-3.5 h-3.5" />
              <span>Cannabis</span>
            </button>
          </div>

          {/* 5 Core Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Check if tab is active (also handling backward-compatible tabs)
              const isActive = 
                activeTab === item.id ||
                (item.id === 'plantas' && activeTab === 'cannabis') ||
                (item.id === 'cuidados' && (activeTab === 'calendario' || activeTab === 'insights' || activeTab === 'biblioteca'));

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${
                      isActive ? 'text-[var(--accent-hover)]' : 'text-[var(--text-muted)]'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      item.id === 'dashboard' && calculatedAlerts.length > 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isActive
                        ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-hover)] border border-[var(--border-strong)]'
                        : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Entry Point Card (Real Gemini Assistant) */}
          <div className="pt-2">
            <button
              onClick={() => setActiveTab(cultivationMode === 'cannabis' ? 'ia_cannabis' : 'ia_horta')}
              className={`w-full min-h-[44px] p-3 rounded-2xl border text-left transition-all cursor-pointer group space-y-1 shadow-sm ${
                (activeTab === 'ia_horta' || activeTab === 'ia_cannabis')
                  ? 'bg-[var(--bg-surface)] border-[var(--border-strong)] ring-1 ring-[var(--accent-primary)]/40'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span>{cultivationMode === 'cannabis' ? 'IA Cannabis' : 'IA Horta'}</span>
                </span>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Real • Gemini
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                {cultivationMode === 'cannabis' 
                  ? 'Consultoria agronômica técnica e conformidade legal.'
                  : 'Diagnóstico botânico, sintomas e cuidados orgânicos.'}
              </p>
            </button>
          </div>
        </div>

        {/* Sidebar Footer with Beta & Legal Links */}
        <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] font-mono flex-wrap">
            <span>v1.2 Beta Fechada</span>
            {onOpenFeedback && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenFeedback}
                  className="hover:text-[var(--accent-primary)] hover:underline cursor-pointer min-h-[30px] flex items-center"
                >
                  Feedback
                </button>
              </>
            )}
            {onOpenLegal && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onOpenLegal('termos')}
                  className="hover:text-[var(--accent-primary)] hover:underline cursor-pointer min-h-[30px] flex items-center"
                >
                  Termos & Legal
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* 2. Mobile Bottom Navigation Bar (5 Items, 44px min touch targets, iOS Safari Style) */}
      <nav 
        aria-label="Navegação Principal"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)] px-1 py-1 pb-safe select-none shadow-lg transition-colors"
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              activeTab === item.id ||
              (item.id === 'plantas' && activeTab === 'cannabis') ||
              (item.id === 'cuidados' && (activeTab === 'calendario' || activeTab === 'insights' || activeTab === 'biblioteca'));

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-label={`Ir para ${item.label}`}
                className={`min-h-[48px] min-w-[56px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative active:scale-95 ${
                  isActive 
                    ? 'text-[var(--accent-hover)] font-bold' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center ring-2 ring-[var(--bg-secondary)]">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modal: IA Entry Point Explanation (Simulado / Em breve) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)] font-serif">
                  {cultivationMode === 'cannabis' ? 'IA Cannabis Medicinal' : 'IA Horta Tradicional'}
                </h3>
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                  RECURSO SIMULADO • RESERVADO
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {cultivationMode === 'cannabis' ? (
                'O módulo IA Cannabis oferecerá análise agronômica de tricomas (proporção transparente/leitoso/âmbar) por macrofotografia, alerta preditivo de mofo cinzento (Botrytis) com base na umidade da estufa e cálculo automático de tabela de fertilização orgânica.'
              ) : (
                'O módulo IA Horta permitirá apontar a câmera para qualquer planta da sua horta ou folhagem para receber diagnóstico botânico imediato, identificação de pragas e orientações passo a passo para correção de carências minerais.'
              )}
            </p>

            <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs space-y-1.5">
              <span className="font-bold text-[var(--text-primary)] block">Previsão de Lançamento:</span>
              <p className="text-[11px] text-[var(--text-muted)]">
                Em fase de validação com dados botânicos. Integração por modelos multimodais de visão computacional na versão Beta.
              </p>
            </div>

            <button
              onClick={() => setIsAiModalOpen(false)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
