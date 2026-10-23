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
        ? 'bg-rose-950/20 border-rose-800/60 text-rose-300 shadow-sm'
        : 'bg-amber-950/20 border-amber-800/60 text-amber-300 shadow-sm'
    }`}
  >
    <div className="flex items-start gap-2.5">
      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
        alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-500'
      }`} />
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-[var(--text-primary)]">
            {alert.title}
          </span>
          <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            {alert.metrics}
          </span>
        </div>
        <p className="text-[11px] mt-0.5 text-[var(--text-secondary)]">
          {alert.description}
        </p>
        <p className="text-[11px] font-medium mt-1 text-[var(--text-primary)] bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border-subtle)]">
          💡 Dica de Cuidado: {alert.plantCareTip}
        </p>
      </div>
    </div>

    <button
      onClick={onConfigure}
      className="self-end sm:self-center shrink-0 text-[11px] text-[var(--accent-primary)] hover:text-[var(--accent-hover)] underline underline-offset-2 flex items-center gap-1 cursor-pointer min-h-[44px]"
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
  <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center text-xs flex flex-col items-center justify-center gap-1">
    <span className="text-[10px] text-[var(--text-muted)] font-mono">{forecast.time}</span>
    <span className="font-bold text-[var(--text-primary)] text-xs">{forecast.temperature}°</span>
    <span className="text-[10px] text-cyan-500 flex items-center gap-0.5">
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
    <div className="flex items-center justify-between p-2 px-3 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-xs transition-colors min-h-[40px]">
      <span className="w-20 font-medium capitalize text-[var(--text-primary)]">
        {dayName}
      </span>
      <span className="text-[var(--text-muted)] text-[11px] truncate flex-1 text-center">
        {info.description}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-cyan-500 flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          {day.precipitation_probability_max}%
        </span>
        <span className="font-mono text-[var(--text-secondary)]">
          {day.temp_min}° <span className="opacity-40">/</span> <strong className="text-[var(--text-primary)]">{day.temp_max}°</strong>
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
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] shadow-sm space-y-4">
      
      {/* Top row: City & refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-[var(--accent-primary)]" />
          <span className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">
            Previsão & Clima Botânico
          </span>
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
            • {weatherData.city}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerTestAlert()}
            title="Simular teste de alerta"
            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center gap-1 transition-colors cursor-pointer min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden xs:inline">Testar Alerta</span>
          </button>

          <button
            onClick={() => refreshWeather()}
            disabled={isLoadingWeather}
            title="Atualizar dados meteorológicos"
            className="p-2 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-all cursor-pointer disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-[var(--accent-primary)]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Climate Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-subtle)]">
        
        {/* Left: Temperature & Conditions */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-3xl shadow-inner">
            🌱
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] font-mono">
                {current.temperature}°C
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Sensação {current.apparent_temperature}°C
              </span>
            </div>
            <p className="text-xs font-medium text-[var(--accent-primary)]">
              {weatherInfo.description}
            </p>
          </div>
        </div>

        {/* Center: Key Environmental Indicators */}
        <div className="grid grid-cols-3 gap-2 py-1 border-t md:border-t-0 md:border-l border-[var(--border-subtle)] md:pl-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-500" />
              Umidade
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {current.relative_humidity}%
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-500" />
              Chuva
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {current.precipitation_probability}%
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <Wind className="w-3 h-3 text-[var(--text-secondary)]" />
              Vento
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {current.wind_speed} <span className="text-[10px]">km/h</span>
            </span>
          </div>
        </div>

        {/* Right: Quick botanical diagnosis */}
        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-[var(--border-subtle)] md:pl-4 text-xs">
          <div className="flex items-center gap-1.5 text-[var(--accent-primary)] font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Condição para Plantas:</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
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
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Nenhum alerta meteorológico crítico para suas plantas no momento.</span>
          </div>
          <button 
            onClick={() => setActiveTab('configuracoes')}
            className="text-[11px] text-[var(--accent-primary)] hover:underline cursor-pointer min-h-[44px] flex items-center"
          >
            Configurar
          </button>
        </div>
      )}

      {/* Hourly Forecast Strip with Memoized HourlyForecastItems */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium px-1">
          <span>Próximas Horas</span>
          <button
            onClick={() => setExpandedForecast(!expandedForecast)}
            className="text-[11px] text-[var(--accent-primary)] hover:text-[var(--accent-hover)] flex items-center gap-0.5 cursor-pointer min-h-[44px]"
          >
            <span>{expandedForecast ? 'Ocultar 5 Dias' : 'Ver 5 Dias'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedForecast ? 'rotate-90' : ''}`} />
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
        <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2 animate-in fade-in duration-200">
          <span className="text-xs font-semibold text-[var(--text-primary)] px-1">
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
