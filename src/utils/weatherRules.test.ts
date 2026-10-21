import test from 'node:test';
import assert from 'node:assert/strict';
import { isWithinQuietHours, evaluateWeatherAlerts } from './weatherRules.ts';
import type { WeatherData, WeatherAlertSettings } from '../types/index.ts';

test('isWithinQuietHours handles standard and overnight windows correctly', () => {
  // Overnight: 22:00 to 07:00
  assert.equal(isWithinQuietHours('23:30', '22:00', '07:00'), true);
  assert.equal(isWithinQuietHours('02:15', '22:00', '07:00'), true);
  assert.equal(isWithinQuietHours('06:59', '22:00', '07:00'), true);
  assert.equal(isWithinQuietHours('07:01', '22:00', '07:00'), false);
  assert.equal(isWithinQuietHours('14:00', '22:00', '07:00'), false);

  // Daytime: 12:00 to 14:00
  assert.equal(isWithinQuietHours('13:00', '12:00', '14:00'), true);
  assert.equal(isWithinQuietHours('15:00', '12:00', '14:00'), false);
});

test('evaluateWeatherAlerts identifies high rain probability and high wind', () => {
  const dummyWeather: WeatherData = {
    city: 'São Paulo',
    current: {
      temperature: 24,
      apparent_temperature: 25,
      relative_humidity: 85,
      wind_speed: 38,
      weather_code: 81,
      precipitation_probability: 80,
      time: '2026-10-17T14:00:00Z'
    },
    daily: [
      {
        date: '2026-10-17',
        temp_max: 29,
        temp_min: 19,
        precipitation_probability_max: 85,
        weather_code: 81,
        wind_speed_max: 42
      }
    ],
    hourly: []
  };

  const settings: WeatherAlertSettings = {
    id: 's1',
    user_id: 'u1',
    rain_alert: true,
    temp_swing_alert: true,
    wind_alert: true,
    severe_alert: true,
    sensitivity: 'media',
    quiet_hours_start: '23:00',
    quiet_hours_end: '06:00',
    updated_at: ''
  };

  const alerts = evaluateWeatherAlerts(dummyWeather, settings, '14:00');
  
  // Should trigger:
  // 1. Rain (80% >= 65%)
  // 2. Temp swing (29 - 19 = 10°C >= 8°C)
  // 3. Wind (max 42 >= 35 km/h)
  assert.equal(alerts.length, 3);
  const types = alerts.map(a => a.type);
  assert.ok(types.includes('rain'));
  assert.ok(types.includes('temp_swing'));
  assert.ok(types.includes('wind'));
});
