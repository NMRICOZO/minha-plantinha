import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Sprout, 
  CloudSun, 
  Bell, 
  Plus, 
  MapPin, 
  Droplets,
  Wind
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
    setIsWelcomeOpen 
  } = useApp();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const currentWeather = weatherData?.current;
  const weatherInfo = currentWeather ? getWeatherCodeInfo(currentWeather.weather_code) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-950/60 bg-[#08100d]/90 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 p-0.5 shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform flex items-center justify-center">
            <Sprout className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white font-serif">
                Minha Plantinha
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded-full border border-emerald-700/40">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/60 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400/80" />
              <span>{userProfile.weather_city || 'Localizando...'}</span>
            </p>
          </div>
        </div>

        {/* Center / Right Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Weather status pill */}
          {currentWeather && (
            <div 
              onClick={() => setActiveTab('dashboard')}
              title={`Sensação: ${currentWeather.apparent_temperature}°C | ${weatherInfo?.description}`}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/50 transition-colors text-xs"
            >
              <CloudSun className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-emerald-200">
                {currentWeather.temperature}°C
              </span>
              <span className="text-emerald-400/70 border-l border-emerald-800/50 pl-2 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-emerald-400" />
                {currentWeather.precipitation_probability}%
              </span>
              <span className="text-emerald-400/70 border-l border-emerald-800/50 pl-2 hidden md:flex items-center gap-1">
                <Wind className="w-3 h-3 text-emerald-400" />
                {currentWeather.wind_speed} km/h
              </span>
            </div>
          )}

          {/* Alert Bell indicator */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="relative p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 hover:text-white hover:border-emerald-600 transition-colors"
            title={calculatedAlerts.length > 0 ? `${calculatedAlerts.length} alerta(s) meteorológico(s)` : 'Sem alertas ativos'}
            aria-label="Alertas meteorológicos"
          >
            <Bell className="w-4 h-4" />
            {calculatedAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[#0b1712] text-[10px] font-bold flex items-center justify-center animate-pulse">
                {calculatedAlerts.length}
              </span>
            )}
          </button>

          {/* Quick Create Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-emerald-950 font-semibold text-xs sm:text-sm shadow-md shadow-emerald-900/40 transition-all cursor-pointer"
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
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0e2119] border border-emerald-800/50 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenNewDiary(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-emerald-800/40 text-emerald-100 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-md bg-emerald-900/80 flex items-center justify-center text-emerald-300">📖</span>
                    <div>
                      <div className="font-medium text-white">Novo no Diário</div>
                      <div className="text-[10px] text-emerald-400/70">Foto, nota e tags</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenNewPlant(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-emerald-800/40 text-emerald-100 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-md bg-emerald-900/80 flex items-center justify-center text-emerald-300">🌱</span>
                    <div>
                      <div className="font-medium text-white">Cadastrar Planta</div>
                      <div className="text-[10px] text-emerald-400/70">Adicionar à coleção</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenNewEvent(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-emerald-800/40 text-emerald-100 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-md bg-emerald-900/80 flex items-center justify-center text-emerald-300">💧</span>
                    <div>
                      <div className="font-medium text-white">Registrar Evento</div>
                      <div className="text-[10px] text-emerald-400/70">Rega, adubo, poda</div>
                    </div>
                  </button>

                  <div className="border-t border-emerald-900/60 my-1" />

                  <button
                    onClick={() => { setShowQuickMenu(false); setIsWelcomeOpen(true); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-emerald-800/40 text-emerald-100 flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-md bg-emerald-900/80 flex items-center justify-center text-amber-300">✨</span>
                    <div>
                      <div className="font-medium text-white">Passo a Passo do App</div>
                      <div className="text-[10px] text-emerald-400/70">Tutorial e preferências</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User profile avatar */}
          <div 
            onClick={() => setActiveTab('configuracoes')}
            className="w-8 h-8 rounded-full overflow-hidden border border-emerald-700/50 cursor-pointer hover:border-emerald-400 transition-colors"
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
