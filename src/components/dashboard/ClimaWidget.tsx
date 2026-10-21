import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { getWeatherCodeInfo } from '../../utils/weatherRules.ts';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  RefreshCw, 
  ChevronRight, 
  ShieldCheck, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

export const ClimaWidget: React.FC = () => {
  const { weatherData, isLoadingWeather, refreshWeather, userProfile, setActiveTab } = useApp();
  const [expandedForecast, setExpandedForecast] = useState(false);

  if (!userProfile.weather_city || !userProfile.weather_lat) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-emerald-800/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <MapPin className="w-4 h-4" />
          <span>Localização Não Definida</span>
        </div>
        <p className="text-xs text-emerald-200/80 leading-relaxed">
          Configure sua cidade para receber a previsão do tempo e alertas meteorológicos sob medida para suas plantas.
        </p>
        <button
          onClick={() => setActiveTab('configuracoes')}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-emerald-950 font-bold text-xs hover:bg-emerald-500 cursor-pointer transition-colors"
        >
          Configurar Localização
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-emerald-800/30 animate-pulse space-y-3">
        <div className="h-4 w-32 bg-emerald-900/40 rounded" />
        <div className="h-10 w-24 bg-emerald-900/60 rounded" />
      </div>
    );
  }

  const current = weatherData.current;
  const weatherInfo = getWeatherCodeInfo(current.weather_code);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-800/30 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm sm:text-base text-white">Previsão & Clima Botânico</h3>
          <span className="text-xs text-emerald-400/70 hidden sm:inline">• {weatherData.city}</span>
        </div>

        <button
          onClick={() => refreshWeather()}
          disabled={isLoadingWeather}
          title="Atualizar clima"
          className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/40 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-emerald-300' : ''}`} />
        </button>
      </div>

      {/* Main Climate Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-[#0c2219]/90 to-[#07150f]/80 p-4 rounded-xl border border-emerald-900/40">
        {/* Temperature */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-900/30 border border-emerald-700/40 flex items-center justify-center text-2xl shadow-inner">
            🌱
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{current.temperature}°C</span>
              <span className="text-xs text-emerald-300/70">Sensação {current.apparent_temperature}°C</span>
            </div>
            <p className="text-xs font-medium text-emerald-400">{weatherInfo.description}</p>
          </div>
        </div>

        {/* Environmental Indicators */}
        <div className="grid grid-cols-3 gap-2 py-1 border-t md:border-t-0 md:border-l border-emerald-900/50 md:pl-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-400/60 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              Umidade
            </span>
            <span className="text-sm font-semibold text-emerald-100">{current.relative_humidity}%</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-400/60 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              Chuva
            </span>
            <span className="text-sm font-semibold text-emerald-100">{current.precipitation_probability}%</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-400/60 flex items-center gap-1">
              <Wind className="w-3 h-3 text-teal-400" />
              Vento
            </span>
            <span className="text-sm font-semibold text-emerald-100">
              {current.wind_speed} <span className="text-[10px]">km/h</span>
            </span>
          </div>
        </div>

        {/* Condition Advice */}
        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-emerald-900/50 md:pl-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-300 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Condição para Plantas:</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-relaxed">
            {current.relative_humidity > 70
              ? 'Excelente umidade para tropicais. Cuidado com excesso de água no substrato.'
              : current.relative_humidity < 40
              ? 'Ar seco: borrife água nas folhas ou aproxime as plantas do umidificador.'
              : 'Clima propício para fotossíntese e desenvolvimento vegetal regular.'}
          </p>
        </div>
      </div>

      {/* Hourly Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-emerald-400/80 font-medium px-1">
          <span>Próximas Horas</span>
          <button
            onClick={() => setExpandedForecast(!expandedForecast)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
          >
            <span>{expandedForecast ? 'Ocultar 5 Dias' : 'Ver 5 Dias'}</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${expandedForecast ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-x-auto pb-1">
          {weatherData.hourly.slice(0, 6).map((h, i) => (
            <div
              key={i}
              className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-center text-xs flex flex-col items-center justify-center gap-1"
            >
              <span className="text-[10px] text-emerald-400/70 font-mono">{h.time}</span>
              <span className="font-bold text-white text-xs">{h.temperature}°</span>
              <span className="text-[10px] text-cyan-400 flex items-center gap-0.5">
                <Droplets className="w-2.5 h-2.5" />
                {h.precipitation_probability}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-day daily forecast expandable */}
      {expandedForecast && (
        <div className="pt-2 border-t border-emerald-900/40 space-y-2 animate-in fade-in duration-200">
          <span className="text-xs font-semibold text-emerald-300 px-1">
            Previsão para os Próximos 5 Dias
          </span>
          <div className="space-y-1.5">
            {weatherData.daily.slice(0, 5).map((day, idx) => {
              const dayDate = new Date(day.date + 'T12:00:00');
              const dayName = idx === 0 ? 'Hoje' : idx === 1 ? 'Amanhã' : dayDate.toLocaleDateString('pt-BR', { weekday: 'short' });
              const info = getWeatherCodeInfo(day.weather_code);

              return (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-2 px-3 rounded-lg bg-emerald-950/20 hover:bg-emerald-950/40 text-xs transition-colors"
                >
                  <span className="w-20 font-medium capitalize text-emerald-100">{dayName}</span>
                  <span className="text-emerald-400/70 text-[11px] truncate flex-1 text-center">
                    {info.description}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      {day.precipitation_probability_max}%
                    </span>
                    <span className="font-mono text-emerald-300">
                      {day.temp_min}° <span className="text-emerald-500/50">/</span> <strong className="text-white">{day.temp_max}°</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
