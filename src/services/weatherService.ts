import type { WeatherData, WeatherDailyForecast, WeatherHourlyForecast } from '../types/index.ts';

const FALLBACK_WEATHER: WeatherData = {
  city: 'São Paulo, SP',
  current: {
    temperature: 23,
    apparent_temperature: 24,
    relative_humidity: 68,
    wind_speed: 16,
    weather_code: 2,
    precipitation_probability: 25,
    time: new Date().toISOString(),
  },
  daily: [
    {
      date: new Date().toISOString().split('T')[0],
      temp_max: 27,
      temp_min: 18,
      precipitation_probability_max: 30,
      weather_code: 2,
      wind_speed_max: 22,
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      temp_max: 26,
      temp_min: 17,
      precipitation_probability_max: 45,
      weather_code: 3,
      wind_speed_max: 18,
    },
    {
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      temp_max: 23,
      temp_min: 16,
      precipitation_probability_max: 80,
      weather_code: 80,
      wind_speed_max: 36,
    },
    {
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      temp_max: 21,
      temp_min: 15,
      precipitation_probability_max: 65,
      weather_code: 61,
      wind_speed_max: 20,
    },
    {
      date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
      temp_max: 25,
      temp_min: 16,
      precipitation_probability_max: 20,
      weather_code: 1,
      wind_speed_max: 14,
    }
  ],
  hourly: [
    { time: '08:00', temperature: 19, precipitation_probability: 10, weather_code: 1 },
    { time: '11:00', temperature: 23, precipitation_probability: 20, weather_code: 2 },
    { time: '14:00', temperature: 26, precipitation_probability: 25, weather_code: 2 },
    { time: '17:00', temperature: 24, precipitation_probability: 30, weather_code: 3 },
    { time: '20:00', temperature: 21, precipitation_probability: 20, weather_code: 2 },
    { time: '23:00', temperature: 19, precipitation_probability: 15, weather_code: 1 },
  ]
};

export async function fetchOpenMeteoWeather(lat: number, lng: number, cityName: string): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // Map daily data
    const daily: WeatherDailyForecast[] = [];
    if (data.daily && data.daily.time) {
      for (let i = 0; i < Math.min(data.daily.time.length, 7); i++) {
        daily.push({
          date: data.daily.time[i],
          temp_max: Math.round(data.daily.temperature_2m_max[i]),
          temp_min: Math.round(data.daily.temperature_2m_min[i]),
          precipitation_probability_max: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] : 0,
          weather_code: data.daily.weather_code[i],
          wind_speed_max: Math.round(data.daily.wind_speed_10m_max[i] || 0),
        });
      }
    }

    // Map hourly data (next 8 2-hour increments)
    const hourly: WeatherHourlyForecast[] = [];
    if (data.hourly && data.hourly.time) {
      const nowIdx = 0;
      for (let i = nowIdx; i < Math.min(data.hourly.time.length, 24); i += 2) {
        const timeIso = data.hourly.time[i];
        const timeFormatted = timeIso.includes('T') ? timeIso.split('T')[1].slice(0, 5) : timeIso.slice(0, 5);
        hourly.push({
          time: timeFormatted,
          temperature: Math.round(data.hourly.temperature_2m[i]),
          precipitation_probability: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[i] : 0,
          weather_code: data.hourly.weather_code[i]
        });
      }
    }

    return {
      city: cityName,
      current: {
        temperature: Math.round(data.current?.temperature_2m ?? 22),
        apparent_temperature: Math.round(data.current?.apparent_temperature ?? 22),
        relative_humidity: Math.round(data.current?.relative_humidity_2m ?? 65),
        wind_speed: Math.round(data.current?.wind_speed_10m ?? 12),
        weather_code: data.current?.weather_code ?? 1,
        precipitation_probability: data.current?.precipitation_probability ?? (daily[0]?.precipitation_probability_max || 0),
        time: data.current?.time || new Date().toISOString(),
      },
      daily: daily.length > 0 ? daily : FALLBACK_WEATHER.daily,
      hourly: hourly.length > 0 ? hourly : FALLBACK_WEATHER.hourly,
    };
  } catch (err) {
    console.warn('Could not fetch real Open-Meteo weather, using local botanical climate profile:', err);
    return {
      ...FALLBACK_WEATHER,
      city: cityName
    };
  }
}

export interface GeocodingResult {
  id: number;
  name: string;
  admin1?: string; // State / Region
  country?: string;
  latitude: number;
  longitude: number;
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}
