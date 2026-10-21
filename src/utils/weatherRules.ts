import type { WeatherData, WeatherAlertSettings, CalculatedAlert } from '../types/index.ts';

/**
 * Checks if current time is within user quiet hours.
 * quietHoursStart/End are formatted as "HH:MM" (e.g. "22:00" and "07:00")
 */
export function isWithinQuietHours(currentTimeStr: string, start?: string, end?: string): boolean {
  if (!start || !end) return false;

  const [currH, currM] = currentTimeStr.split(':').map(Number);
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const currentMinutes = currH * 60 + currM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    // Normal window e.g. 13:00 to 15:00
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Overnight window e.g. 22:00 to 07:00
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}

/**
 * Evaluates weather conditions against user thresholds to generate botanical care alerts.
 */
export function evaluateWeatherAlerts(
  weather: WeatherData,
  settings: WeatherAlertSettings,
  currentTimeStr?: string
): CalculatedAlert[] {
  const alerts: CalculatedAlert[] = [];
  const now = currentTimeStr || new Date().toTimeString().slice(0, 5);

  const inQuietHours = isWithinQuietHours(now, settings.quiet_hours_start, settings.quiet_hours_end);

  // Threshold modifiers by sensitivity
  const rainThreshold = settings.sensitivity === 'alta' ? 45 : settings.sensitivity === 'media' ? 65 : 80;
  const tempSwingThreshold = settings.sensitivity === 'alta' ? 6 : settings.sensitivity === 'media' ? 8 : 10;
  const windThreshold = settings.sensitivity === 'alta' ? 25 : settings.sensitivity === 'media' ? 35 : 45;

  // 1. Rain Alert
  if (settings.rain_alert) {
    const todayRainProb = weather.current.precipitation_probability || 
      (weather.daily[0]?.precipitation_probability_max ?? 0);

    if (todayRainProb >= rainThreshold) {
      alerts.push({
        id: `rain-${Date.now()}`,
        type: 'rain',
        severity: todayRainProb >= 80 ? 'critical' : 'warning',
        title: 'Alerta de Chuva Intensa',
        description: `Precipitação prevista de ${todayRainProb}%.`,
        plantCareTip: 'Recolha plantas que não toleram excesso d\'água (suculentas, cactos e vasos sem pratinho de drenagem) para local protegido.',
        metrics: `${todayRainProb}% prob.`,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 2. Temperature Swing Alert (Variação térmica brusca)
  if (settings.temp_swing_alert && weather.daily[0]) {
    const today = weather.daily[0];
    const swing = Math.round(today.temp_max - today.temp_min);

    if (swing >= tempSwingThreshold) {
      alerts.push({
        id: `temp-swing-${Date.now()}`,
        type: 'temp_swing',
        severity: swing >= 12 ? 'critical' : 'warning',
        title: 'Oscilação Térmica Elevada',
        description: `Variação de ${swing}°C prevista no mesmo dia (Mín: ${Math.round(today.temp_min)}°C / Máx: ${Math.round(today.temp_max)}°C).`,
        plantCareTip: 'Plantas tropicais (marantas, samambaias e begônias) sofrem choque com variações bruscas. Evite correntes de ar e mantenha a umidade do ar alta.',
        metrics: `Δ ${swing}°C`,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 3. High Wind Alert
  if (settings.wind_alert) {
    const maxWind = Math.max(weather.current.wind_speed, weather.daily[0]?.wind_speed_max ?? 0);
    if (maxWind >= windThreshold) {
      alerts.push({
        id: `wind-${Date.now()}`,
        type: 'wind',
        severity: maxWind >= 45 ? 'critical' : 'warning',
        title: 'Alerta de Ventos Fortes',
        description: `Rajadas de vento de até ${Math.round(maxWind)} km/h.`,
        plantCareTip: 'Remova vasos suspensos de varandas e beirais. Proteja folhagens largas (Monstera, Ficus lyrata) de rasgos ou tombamento.',
        metrics: `${Math.round(maxWind)} km/h`,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 4. Severe / Extreme Temperature Alert (Frost or Extreme Heat)
  if (settings.severe_alert) {
    const currTemp = weather.current.temperature;
    const minTemp = weather.daily[0]?.temp_min ?? currTemp;
    const maxTemp = weather.daily[0]?.temp_max ?? currTemp;

    if (minTemp <= 6) {
      alerts.push({
        id: `cold-${Date.now()}`,
        type: 'severe',
        severity: 'critical',
        title: 'Risco de Frio Intenso / Geada',
        description: `Temperatura mínima prevista de ${Math.round(minTemp)}°C.`,
        plantCareTip: 'Recolha todas as plantas de clima tropical e suculentas para dentro de casa. Reduza drasticamente a rega.',
        metrics: `${Math.round(minTemp)}°C mín.`,
        timestamp: new Date().toISOString()
      });
    } else if (maxTemp >= 35) {
      alerts.push({
        id: `heat-${Date.now()}`,
        type: 'severe',
        severity: 'critical',
        title: 'Onda de Calor Intenso',
        description: `Temperatura máxima de ${Math.round(maxTemp)}°C prevista.`,
        plantCareTip: 'Atenção redobrada à hidratação. Borrife água nas folhas pela manhã cedo e retire plantas do sol direto do meio-dia para evitar queimaduras.',
        metrics: `${Math.round(maxTemp)}°C máx.`,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Filter out if quiet hours apply, but keep critical alerts marked with quiet badge if desired
  if (inQuietHours) {
    return alerts.map(a => ({
      ...a,
      title: `${a.title} (Horário de Silêncio)`
    }));
  }

  return alerts;
}

/**
 * Returns weather description and Lucide icon name for WMO weather codes.
 */
export function getWeatherCodeInfo(code: number): {
  description: string;
  iconName: string;
} {
  switch (code) {
    case 0:
      return { description: 'Céu limpo', iconName: 'Sun' };
    case 1:
      return { description: 'Predomínio de sol', iconName: 'SunMedium' };
    case 2:
      return { description: 'Parcialmente nublado', iconName: 'CloudSun' };
    case 3:
      return { description: 'Encoberto', iconName: 'Cloud' };
    case 45:
    case 48:
      return { description: 'Nevoeiro úmido', iconName: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { description: 'Garoa leve', iconName: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65:
      return { description: 'Chuva moderada', iconName: 'CloudRain' };
    case 80:
    case 81:
    case 82:
      return { description: 'Pancadas de chuva', iconName: 'CloudRainWind' };
    case 95:
    case 96:
    case 99:
      return { description: 'Tempestade com raios', iconName: 'CloudLightning' };
    default:
      return { description: 'Clima estável', iconName: 'CloudSun' };
  }
}
