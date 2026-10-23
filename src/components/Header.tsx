import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Sprout, 
  CloudSun, 
  Bell, 
  Plus, 
  MapPin, 
  Droplets,
  Wind,
  Cannabis
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/weatherRules.ts';

interface HeaderProps {
  onOpenNewPlant: () => void;
  onOpenNewDiary: () => void;
  onOpenNewEvent: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenNewPlant, 
  onOpenNewDiary, 
  onOpenNewEvent 
}) => {
  const { 
    userProfile, 
    weatherData, 
    calculatedAlerts, 
    setActiveTab, 
    isLoadingWeather,
    setIsWelcomeOpen,
    cultivationMode,
    setCultivationMode
  } = useApp();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const currentWeather = weatherData?.current;
  const weatherInfo = currentWeather ? getWeatherCodeInfo(currentWeather.weather_code) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/95 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2 cursor-pointer group min-h-[44px] shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
            {cultivationMode === 'cannabis' ? (
              <Cannabis className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Sprout className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>
          <div className="hidden xs:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--text-primary)] font-serif">
                Minha Plantinha
              </span>
              <span className="text-[9px] tracking-wider uppercase font-semibold text-[var(--accent-hover)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded-md border border-[var(--border-subtle)]">
                {cultivationMode === 'cannabis' ? 'CANNA' : 'HORTA'}
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[var(--accent-hover)]" />
              <span>{userProfile.weather_city || 'São Paulo, SP'}</span>
            </p>
          </div>
        </div>

        {/* Cultivation Mode Switcher (Horta vs Cannabis) */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <button
            onClick={() => setCultivationMode('horta')}
            className={`min-h-[40px] min-w-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              cultivationMode === 'horta'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            title="Módulo Horta Tradicional & Plantas Domésticas"
            aria-label="Módulo Horta"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Horta</span>
          </button>
          
          <button
            onClick={() => setCultivationMode('cannabis')}
            className={`min-h-[40px] min-w-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              cultivationMode === 'cannabis'
                ? 'bg-emerald-800 text-emerald-100 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            title="Módulo Cannabis Medicinal & Fotoperíodo"
            aria-label="Módulo Cannabis"
          >
            <Cannabis className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cannabis</span>
          </button>
        </div>

        {/* Center / Right Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Weather status pill */}
          {currentWeather && (
            <div 
              onClick={() => setActiveTab('dashboard')}
              title={`Sensação: ${currentWeather.apparent_temperature}°C | ${weatherInfo?.description}`}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors text-xs min-h-[44px]"
            >
              <CloudSun className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="font-semibold text-[var(--text-primary)]">
                {currentWeather.temperature}°C
              </span>
              <span className="text-[var(--text-muted)] border-l border-[var(--border-subtle)] pl-2 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-500" />
                {currentWeather.precipitation_probability}%
              </span>
              <span className="text-[var(--text-muted)] border-l border-[var(--border-subtle)] pl-2 hidden md:flex items-center gap-1">
                <Wind className="w-3 h-3 text-[var(--text-secondary)]" />
                {currentWeather.wind_speed} km/h
              </span>
            </div>
          )}

          {/* Alert Bell indicator */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="relative p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title={calculatedAlerts.length > 0 ? `${calculatedAlerts.length} alerta(s) meteorológico(s)` : 'Sem alertas ativos'}
            aria-label="Alertas meteorológicos"
          >
            <Bell className="w-4 h-4" />
            {calculatedAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {calculatedAlerts.length}
              </span>
            )}
          </button>

          {/* Quick Create Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              aria-label="Menu de registro rápido"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] active:scale-95 text-[var(--accent-text)] font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">Registrar</span>
            </button>

            {showQuickMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowQuickMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenNewDiary(); }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs hover:bg-[var(--border-subtle)] text-[var(--text-primary)] flex items-center gap-2.5 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <span className="w-7 h-7 rounded-md bg-[var(--bg-primary)] flex items-center justify-center text-sm">📖</span>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Novo no Diário</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Foto, nota e tags</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenNewPlant(); }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs hover:bg-[var(--border-subtle)] text-[var(--text-primary)] flex items-center gap-2.5 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <span className="w-7 h-7 rounded-md bg-[var(--bg-primary)] flex items-center justify-center text-sm">🌱</span>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Cadastrar Planta</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Adicionar à coleção</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenNewEvent(); }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs hover:bg-[var(--border-subtle)] text-[var(--text-primary)] flex items-center gap-2.5 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <span className="w-7 h-7 rounded-md bg-[var(--bg-primary)] flex items-center justify-center text-sm">💧</span>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Registrar Evento</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Rega, adubo, poda</div>
                    </div>
                  </button>

                  <div className="border-t border-[var(--border-subtle)] my-1" />

                  <button
                    onClick={() => { setShowQuickMenu(false); setIsWelcomeOpen(true); }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs hover:bg-[var(--border-subtle)] text-[var(--text-primary)] flex items-center gap-2.5 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <span className="w-7 h-7 rounded-md bg-[var(--bg-primary)] flex items-center justify-center text-amber-500">✨</span>
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">Passo a Passo do App</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Tutorial e preferências</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User profile avatar */}
          <div 
            onClick={() => setActiveTab('configuracoes')}
            className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--accent-primary)] transition-colors min-w-[36px]"
            title={userProfile.full_name}
          >
            <img 
              src={userProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={userProfile.full_name} 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </header>
  );
};
