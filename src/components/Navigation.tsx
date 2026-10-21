import React, { useState } from 'react';
import { useApp, ActiveTab } from '../context/AppContext.tsx';
import { 
  Home, 
  Sprout, 
  Cannabis,
  Calendar as CalendarIcon, 
  BarChart3, 
  Library, 
  Settings,
  Image as ImageIcon,
  Compass,
  Sparkles,
  ChevronUp,
  X
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Navigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    plants, 
    diaryEntries, 
    calculatedAlerts, 
    cannabisPlants,
    setIsWelcomeOpen 
  } = useApp();

  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Início', icon: Home, badge: calculatedAlerts.length > 0 ? calculatedAlerts.length : undefined },
    { id: 'plantas', label: 'Plantas', icon: Sprout, badge: plants.length },
    { id: 'cannabis', label: 'Cannabis', icon: Cannabis, badge: cannabisPlants.length },
    { id: 'diario', label: 'Diário & Fotos', icon: ImageIcon, badge: diaryEntries.length },
    { id: 'calendario', label: 'Calendário', icon: CalendarIcon },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'biblioteca', label: 'Biblioteca', icon: Library },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Desktop / Tablet Sidebar (hidden on mobile) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-emerald-950/60 bg-[#07130e]/70 backdrop-blur-xl p-4 min-h-[calc(100vh-61px)] justify-between select-none shrink-0">
        <div className="space-y-6">
          <div className="px-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-500/70 font-mono">
              Navegação
            </span>
            <button
              onClick={() => setIsWelcomeOpen(true)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
              title="Abrir passo a passo de introdução"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Tutorial</span>
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-600/35 via-emerald-800/25 to-emerald-950/20 text-emerald-100 border border-emerald-500/40 shadow-sm'
                      : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${
                      item.id === 'cannabis' 
                        ? (isActive ? 'text-emerald-300' : 'text-emerald-400')
                        : (isActive ? 'text-emerald-400' : 'text-emerald-500/60')
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.id === 'dashboard' && calculatedAlerts.length > 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.id === 'cannabis'
                        ? 'bg-emerald-800/50 text-emerald-200 border border-emerald-600/40'
                        : isActive
                        ? 'bg-emerald-700/40 text-emerald-200'
                        : 'bg-emerald-950 text-emerald-400/80'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Walkthrough card */}
        <div className="space-y-2">
          <button
            onClick={() => setIsWelcomeOpen(true)}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/60 border border-emerald-800/40 text-left hover:border-emerald-600/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Passo a Passo do App</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Abrir →</span>
            </div>
            <p className="text-[10px] text-emerald-300/70 leading-relaxed">
              Reveja o tutorial e adapte suas preferências de cultivo.
            </p>
          </button>

          <div className="px-3 py-2 text-[10px] text-emerald-500/60 text-center font-mono">
            Minha Plantinha v1.0 • Safari iOS
          </div>
        </div>
      </aside>

      {/* Mobile iOS "Mais" Bottom Sheet / Drawer */}
      {isMobileMoreOpen && (
        <div 
          onClick={() => setIsMobileMoreOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-16 left-3 right-3 bg-[#0a1812]/95 border border-emerald-600/30 rounded-3xl p-4 shadow-2xl backdrop-blur-xl space-y-3 animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
              <span className="text-xs font-bold text-white font-serif flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Mais Seções do App</span>
              </span>
              <button 
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1 text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => { setActiveTab('calendario'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  activeTab === 'calendario' ? 'bg-emerald-800/40 border-emerald-500 text-white' : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <span>Calendário</span>
              </button>

              <button
                onClick={() => { setActiveTab('insights'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  activeTab === 'insights' ? 'bg-emerald-800/40 border-emerald-500 text-white' : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Insights Reais</span>
              </button>

              <button
                onClick={() => { setActiveTab('biblioteca'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  activeTab === 'biblioteca' ? 'bg-emerald-800/40 border-emerald-500 text-white' : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
                }`}
              >
                <Library className="w-4 h-4 text-amber-400" />
                <span>Biblioteca</span>
              </button>

              <button
                onClick={() => { setActiveTab('configuracoes'); setIsMobileMoreOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  activeTab === 'configuracoes' ? 'bg-emerald-800/40 border-emerald-500 text-white' : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
                }`}
              >
                <Settings className="w-4 h-4 text-teal-400" />
                <span>Ajustes & Perfil</span>
              </button>
            </div>

            <button
              onClick={() => { setIsWelcomeOpen(true); setIsMobileMoreOpen(false); }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-600/40 text-xs font-semibold text-emerald-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Abrir Passo a Passo & Boas-Vindas</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (iOS Safari Native Style) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07130e]/92 backdrop-blur-2xl border-t border-emerald-900/60 px-2 py-1 pb-safe select-none shadow-2xl">
        <div className="flex items-center justify-around">
          
          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all cursor-pointer relative active:scale-95 ${
              activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-emerald-300/60 hover:text-emerald-200'
            }`}
          >
            <div className="relative">
              <Home className="w-5 h-5" />
              {calculatedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#07130e]" />
              )}
            </div>
            <span className="text-[10px] mt-0.5">Início</span>
          </button>

          {/* 2. Plantas */}
          <button
            onClick={() => setActiveTab('plantas')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${
              activeTab === 'plantas' ? 'text-emerald-400 font-bold' : 'text-emerald-300/60 hover:text-emerald-200'
            }`}
          >
            <Sprout className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Plantas</span>
          </button>

          {/* 3. Dedicated Cannabis Tab */}
          <button
            onClick={() => setActiveTab('cannabis')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer relative active:scale-95 ${
              activeTab === 'cannabis' 
                ? 'text-emerald-300 font-bold bg-emerald-900/30 px-3' 
                : 'text-emerald-400/70 hover:text-emerald-200'
            }`}
          >
            <div className="relative">
              <Cannabis className="w-5 h-5" />
              {cannabisPlants.length > 0 && (
                <span className="absolute -top-1 -right-1.5 text-[8px] font-mono px-1 rounded-full bg-emerald-600 text-emerald-950 font-bold">
                  {cannabisPlants.length}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Cannabis</span>
          </button>

          {/* 4. Diário / Galeria */}
          <button
            onClick={() => setActiveTab('diario')}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${
              activeTab === 'diario' ? 'text-emerald-400 font-bold' : 'text-emerald-300/60 hover:text-emerald-200'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Diário</span>
          </button>

          {/* 5. Mais (Menu drawer) */}
          <button
            onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
            className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${
              ['calendario', 'insights', 'biblioteca', 'configuracoes'].includes(activeTab) || isMobileMoreOpen
                ? 'text-emerald-400 font-bold' 
                : 'text-emerald-300/60 hover:text-emerald-200'
            }`}
          >
            <div className="relative">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Mais</span>
          </button>

        </div>
      </nav>
    </>
  );
};
