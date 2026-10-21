export type PlantStatus = 'active' | 'archived' | 'deceased' | 'gifted';

export type PlantLocation = 'indoor' | 'balcony' | 'outdoor' | 'window' | 'greenhouse';

export type EventType = 'rega' | 'adubacao' | 'replantio' | 'poda' | 'tratamento_pragas' | 'outro';

export interface Plant {
  id: string;
  user_id: string;
  name: string;
  species?: string;
  cover_photo_url?: string;
  acquired_date: string; // YYYY-MM-DD
  status: PlantStatus;
  location?: PlantLocation;
  light_level?: 'baixa' | 'media_indireta' | 'alta_indireta' | 'sol_pleno';
  watering_frequency_days?: number; // suggested watering interval
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EntryPhoto {
  id: string;
  entry_id: string;
  user_id: string;
  storage_path: string; // data url or image url
  display_order: number;
  caption?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color?: string;
}

export interface DiaryEntry {
  id: string;
  plant_id: string;
  user_id: string;
  entry_date: string; // YYYY-MM-DD
  entry_time?: string; // HH:MM
  content: string;
  photos: EntryPhoto[];
  tags: Tag[];
  created_at: string;
}

export interface PlantEvent {
  id: string;
  plant_id: string;
  user_id: string;
  event_type: EventType;
  event_date: string; // YYYY-MM-DD
  notes?: string;
  created_at: string;
}

export interface WeatherAlertSettings {
  id: string;
  user_id: string;
  rain_alert: boolean;
  temp_swing_alert: boolean;
  wind_alert: boolean;
  severe_alert: boolean;
  sensitivity: 'baixa' | 'media' | 'alta';
  quiet_hours_start?: string; // "22:00"
  quiet_hours_end?: string;   // "07:00"
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  weather_city: string;
  weather_lat: number;
  weather_lng: number;
  // User Onboarding & App Adaptation
  experience_level?: 'iniciante' | 'intermediario' | 'avancado';
  grow_type?: 'indoor' | 'outdoor' | 'greenhouse' | 'hydro';
  primary_focus?: 'todas' | 'ornamentais' | 'horta' | 'cannabis';
  onboarding_completed?: boolean;
  show_cannabis_tab?: boolean;
  created_at: string;
}

// Cannabis Cultivation Types
export type CannabisStrainType = 'indica' | 'sativa' | 'hibrida' | 'ruderalis_auto';

export type CannabisGrowthStage = 
  | 'germinacao' 
  | 'plantula' 
  | 'vegetativo' 
  | 'pre_floracao' 
  | 'floracao' 
  | 'flush' 
  | 'secagem' 
  | 'cura';

export type CannabisPhotoperiod = '18/6' | '12/12' | '24/0' | '20/4' | 'sol_natural';

export type CannabisMedium = 'solo_organico' | 'coco_perlita' | 'hidroponia' | 'mineral';

export interface CannabisNutrientDose {
  name: string;
  mlPerLiter: number;
}

export interface CannabisFeedLog {
  id: string;
  plant_id: string;
  date: string;
  water_liters: number;
  ph_in: number;
  ph_out?: number;
  ec_ppm?: number;
  runoff_ec?: number;
  nutrients: CannabisNutrientDose[];
  notes?: string;
}

export interface CannabisPlant {
  id: string;
  user_id: string;
  name: string;
  strain: string;
  strain_type: CannabisStrainType;
  is_autoflower: boolean;
  stage: CannabisGrowthStage;
  stage_start_date: string;
  germination_date: string;
  photoperiod: CannabisPhotoperiod;
  medium: CannabisMedium;
  pot_size_liters?: number;
  target_ph?: number;
  target_ec?: number;
  target_temp?: number;
  target_rh?: number;
  training_techniques?: string[];
  trichome_status?: 'transparentes' | 'leitosos_ponto' | 'ambares_sedativo';
  cover_photo_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WeatherCurrent {
  temperature: number;
  apparent_temperature: number;
  relative_humidity: number;
  wind_speed: number;
  weather_code: number;
  precipitation_probability: number;
  time: string;
}

export interface WeatherDailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation_probability_max: number;
  weather_code: number;
  wind_speed_max: number;
}

export interface WeatherHourlyForecast {
  time: string;
  temperature: number;
  precipitation_probability: number;
  weather_code: number;
}

export interface WeatherData {
  current: WeatherCurrent;
  daily: WeatherDailyForecast[];
  hourly: WeatherHourlyForecast[];
  city: string;
}

export interface CalculatedAlert {
  id: string;
  type: 'rain' | 'temp_swing' | 'wind' | 'severe';
  severity: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  plantCareTip: string;
  metrics: string;
  timestamp: string;
}

export type EducationalCategory = 
  | 'cuidados_gerais' 
  | 'observacao_vegetal' 
  | 'saude_vegetal' 
  | 'manutencao' 
  | 'glossario' 
  | 'perguntas_frequentes'
  | 'rega'
  | 'iluminacao'
  | 'substrato'
  | 'pragas'
  | 'propagacao';

export interface EducationalGuide {
  id: string;
  category: EducationalCategory;
  title: string;
  subtitle: string;
  reading_time_minutes: number;
  body: string[];
  tips: string[];
  tags: string[];
  display_order: number;
}
