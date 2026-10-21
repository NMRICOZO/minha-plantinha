import React, { useState, useMemo, memo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight, 
  Sparkles,
  Info
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/weatherRules.ts';
import { CalculatedAlert, WeatherHourlyForecast, WeatherDailyForecast } from '../types/index.ts';

// 1. Memoized Alert Card Item
const AlertCardItem = memo(({ 
  alert, 
  onConfigure 
}: { 
  alert: CalculatedAlert; 
  onConfigure: () => void;
}) => (
  <div 
    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all ${
      alert.severity === 'critical'
        ? 'bg-rose-950/40 border-rose-800/60 text-rose-200 shadow-sm shadow-rose-950/30'
        : 'bg-amber-950/40 border-amber-800/60 text-amber-200 shadow-sm shadow-amber-950/30'
    }`}
  >
    <div className="flex items-start gap-2.5">
      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
        alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'
      }`} />
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-white">
            {alert.title}
          </span>
          <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-black/40 border border-white/10">
            {alert.metrics}
          </span>
        </div>
        <p className="text-[11px] mt-0.5 opacity-90">
          {alert.description}
        </p>
        <p className="text-[11px] font-medium mt-1 text-emerald-300/90 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/40">
          💡 Dica de Cuidado: {alert.plantCareTip}
        </p>
      </div>
    </div>

    <button
      onClick={onConfigure}
      className="self-end sm:self-center shrink-0 text-[11px] text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
    >
      Ajustar Limiares
    </button>
  </div>
));
AlertCardItem.displayName = 'AlertCardItem';

// 2. Memoized Hourly Forecast Item
const HourlyForecastItem = memo(({ 
  forecast 
}: { 
  forecast: WeatherHourlyForecast 
}) => (
  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-center text-xs flex flex-col items-center justify-center gap-1">
    <span className="text-[10px] text-emerald-400/70 font-mono">{forecast.time}</span>
    <span className="font-bold text-white text-xs">{forecast.temperature}°</span>
    <span className="text-[10px] text-cyan-400 flex items-center gap-0.5">
      <Droplets className="w-2.5 h-2.5" />
      {forecast.precipitation_probability}%
    </span>
  </div>
));
HourlyForecastItem.displayName = 'HourlyForecastItem';

// 3. Memoized Daily Forecast Row
const DailyForecastRow = memo(({ 
  day, 
  isFirst, 
  isSecond 
}: { 
  day: WeatherDailyForecast; 
  isFirst: boolean; 
  isSecond: boolean;
}) => {
  const dayDate = new Date(day.date + 'T12:00:00');
  const dayName = isFirst ? 'Hoje' : isSecond ? 'Amanhã' : dayDate.toLocaleDateString('pt-BR', { weekday: 'short' });
  const info = getWeatherCodeInfo(day.weather_code);

  return (
    <div className="flex items-center justify-between p-2 px-3 rounded-lg bg-emerald-950/20 hover:bg-emerald-950/40 text-xs transition-colors">
      <span className="w-20 font-medium capitalize text-emerald-100">
        {dayName}
      </span>
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
});
DailyForecastRow.displayName = 'DailyForecastRow';

export const WeatherWidget: React.FC = () => {
  const { 
    weatherData, 
    calculatedAlerts, 
    isLoadingWeather, 
    refreshWeather, 
    setActiveTab,
    triggerTestAlert
  } = useApp();

  const [expandedForecast, setExpandedForecast] = useState(false);

  // Memoize forecast slices
  const nextHours = useMemo(() => {
    return weatherData?.hourly ? weatherData.hourly.slice(0, 6) : [];
  }, [weatherData?.hourly]);

  const nextDays = useMemo(() => {
    return weatherData?.daily ? weatherData.daily.slice(0, 5) : [];
  }, [weatherData?.daily]);

  // Zero-CLS exact dimension fallback skeleton
  if (!weatherData) {
    return (
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-800/30 shadow-xl space-y-4 min-h-[220px] animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-emerald-900/60 rounded-full" />
            <div className="h-4 w-40 bg-emerald-900/50 rounded" />
          </div>
          <div className="w-8 h-8 bg-emerald-900/40 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0c2219]/60 p-4 rounded-xl border border-emerald-900/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900/40" />
            <div className="space-y-2">
              <div className="h-8 w-24 bg-emerald-900/60 rounded" />
              <div className="h-3 w-32 bg-emerald-900/40 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-emerald-900/30 rounded-xl" />
            <div className="h-16 bg-emerald-900/30 rounded-xl" />
            <div className="h-16 bg-emerald-900/30 rounded-xl" />
          </div>
          <div className="h-16 bg-emerald-900/30 rounded-xl" />
        </div>
      </div>
    );
  }

  const current = weatherData.current;
  const weatherInfo = getWeatherCodeInfo(current.weather_code);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-800/30 shadow-xl space-y-4">
      
      {/* Top row: City & refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm sm:text-base text-white">
            Previsão & Clima Botânico
          </span>
          <span className="text-xs text-emerald-400/70 hidden sm:inline">
            • {weatherData.city}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerTestAlert()}
            title="Simular teste de alerta"
            className="text-[11px] px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/40 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden xs:inline">Testar Alerta</span>
          </button>

          <button
            onClick={() => refreshWeather()}
            disabled={isLoadingWeather}
            title="Atualizar dados meteorológicos"
            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-emerald-300' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Climate Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-[#0c2219]/90 to-[#07150f]/80 p-4 rounded-xl border border-emerald-900/40">
        
        {/* Left: Temperature & Conditions */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-900/30 border border-emerald-700/40 flex items-center justify-center text-3xl shadow-inner">
            🌱
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                {current.temperature}°C
              </span>
              <span className="text-xs text-emerald-300/70">
                Sensação {current.apparent_temperature}°C
              </span>
            </div>
            <p className="text-xs font-medium text-emerald-400">
              {weatherInfo.description}
            </p>
          </div>
        </div>

        {/* Center: Key Environmental Indicators */}
        <div className="grid grid-cols-3 gap-2 py-1 border-t md:border-t-0 md:border-l border-emerald-900/50 md:pl-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-400/60 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              Umidade
            </span>
            <span className="text-sm font-semibold text-emerald-100">
              {current.relative_humidity}%
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-400/60 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              Chuva
            </span>
            <span className="text-sm font-semibold text-emerald-100">
              {current.precipitation_probability}%
            </span>
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

        {/* Right: Quick botanical diagnosis */}
        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-emerald-900/50 md:pl-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-300 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Condição para Plantas:</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-relaxed">
            {current.relative_humidity > 70 
              ? 'Excelente umidade para tropicais. Atenção apenas com excesso de água no solo.' 
              : current.relative_humidity < 40 
              ? 'Ar seco: borrife água nas folhas ou ative umidificador próximo às plantas.'
              : 'Clima equilibrado para fotossíntese e desenvolvimento vegetal regular.'}
          </p>
        </div>
      </div>

      {/* Active Alerts Banner with Memoized AlertCardItems */}
      {calculatedAlerts.length > 0 ? (
        <div className="space-y-2">
          {calculatedAlerts.map((alert) => (
            <AlertCardItem
              key={alert.id}
              alert={alert}
              onConfigure={() => setActiveTab('configuracoes')}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Nenhum alerta meteorológico crítico para suas plantas no momento.</span>
          </div>
          <button 
            onClick={() => setActiveTab('configuracoes')}
            className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
          >
            Configurar
          </button>
        </div>
      )}

      {/* Hourly Forecast Strip with Memoized HourlyForecastItems */}
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
          {nextHours.map((h, i) => (
            <HourlyForecastItem key={i} forecast={h} />
          ))}
        </div>
      </div>

      {/* 5-day daily forecast expandable with Memoized DailyForecastRows */}
      {expandedForecast && (
        <div className="pt-2 border-t border-emerald-900/40 space-y-2 animate-in fade-in duration-200">
          <span className="text-xs font-semibold text-emerald-300 px-1">
            Previsão para os Próximos 5 Dias
          </span>
          <div className="space-y-1.5">
            {nextDays.map((day, idx) => (
              <DailyForecastRow
                key={day.date}
                day={day}
                isFirst={idx === 0}
                isSecond={idx === 1}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
