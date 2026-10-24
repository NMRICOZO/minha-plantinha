import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Plant, 
  DiaryEntry, 
  PlantEvent, 
  Tag, 
  WeatherAlertSettings, 
  UserProfile, 
  WeatherData, 
  CalculatedAlert,
  EventType,
  CannabisPlant,
  CannabisFeedLog,
  CannabisGrowthStage
} from '../types/index.ts';
import { 
  initialPlants, 
  initialDiaryEntries, 
  initialPlantEvents, 
  initialTags, 
  initialAlertSettings, 
  initialProfile,
  initialCannabisPlants,
  initialCannabisFeedLogs
} from '../data/initialData.ts';
import { fetchOpenMeteoWeather } from '../services/weatherService.ts';
import { evaluateWeatherAlerts } from '../utils/weatherRules.ts';
import { storageService } from '../services/storageService.ts';

export type CultivationMode = 'horta' | 'cannabis';

export type ActiveTab = 
  | 'dashboard' 
  | 'plantas' 
  | 'diario' 
  | 'cuidados' 
  | 'configuracoes' 
  | 'cannabis' 
  | 'calendario' 
  | 'insights' 
  | 'biblioteca'
  | 'ia_horta'
  | 'ia_cannabis';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cultivationMode: CultivationMode;
  setCultivationMode: (mode: CultivationMode) => void;
  selectedPlantId: string | null;
  setSelectedPlantId: (id: string | null) => void;
  
  plants: Plant[];
  diaryEntries: DiaryEntry[];
  plantEvents: PlantEvent[];
  tags: Tag[];
  userProfile: UserProfile;
  alertSettings: WeatherAlertSettings;
  weatherData: WeatherData | null;
  calculatedAlerts: CalculatedAlert[];
  isLoadingWeather: boolean;

  // Onboarding & Customization (Boas-vindas e Adaptação)
  isWelcomeOpen: boolean;
  setIsWelcomeOpen: (open: boolean) => void;
  completeOnboarding: (profileUpdates: Partial<UserProfile>) => void;

  // Cannabis Cultivation Specialized State
  cannabisPlants: CannabisPlant[];
  cannabisFeedLogs: CannabisFeedLog[];
  addCannabisPlant: (plant: Partial<CannabisPlant> & { name: string; strain: string; stage: CannabisGrowthStage }) => CannabisPlant;
  updateCannabisPlant: (id: string, updates: Partial<CannabisPlant>) => void;
  deleteCannabisPlant: (id: string) => void;
  addCannabisFeedLog: (log: Omit<CannabisFeedLog, 'id'>) => CannabisFeedLog;
  deleteCannabisFeedLog: (id: string) => void;

  // Auth State (Etapa 04)
  isAuthenticated: boolean;
  currentUser: { id: string; email: string; full_name: string } | null;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;

  // Design Preview (Etapa 02)
  isDesignPreviewOpen: boolean;
  setIsDesignPreviewOpen: (open: boolean) => void;

  // Comparison drawer/modal state
  comparisonPlantId: string | null;
  setComparisonPlantId: (id: string | null) => void;
  openComparison: (plantId: string, photoAUrl?: string, photoBUrl?: string) => void;
  comparisonPhotoA: string | null;
  comparisonPhotoB: string | null;
  setComparisonPhotoA: (url: string | null) => void;
  setComparisonPhotoB: (url: string | null) => void;

  // Plant CRUD
  addPlant: (plant: Partial<Plant> & { name: string; acquired_date: string }) => Plant;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;

  // Diary CRUD
  addDiaryEntry: (entry: {
    plant_id: string;
    entry_date: string;
    entry_time?: string;
    content: string;
    photos: Array<{ storage_path: string; caption?: string }>;
    tag_names?: string[];
  }) => DiaryEntry;
  deleteDiaryEntry: (id: string) => void;

  // Event CRUD
  addPlantEvent: (event: {
    plant_id: string;
    event_type: EventType;
    event_date: string;
    notes?: string;
  }) => PlantEvent;
  deletePlantEvent: (id: string) => void;

  // Settings
  updateAlertSettings: (updates: Partial<WeatherAlertSettings>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  deleteAccount: () => void;
  refreshWeather: () => Promise<void>;
  triggerTestAlert: () => void;

  // Data management & Sample Data control
  resetToDemoData: () => void;
  exportBackup: () => void;
  importBackup: (jsonContent: string) => boolean;
  isUsingSampleData: boolean;
  enableSampleData: () => void;
  clearToEmptyData: () => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLANTS: 'minha_plantinha_plants_v1',
  DIARY: 'minha_plantinha_diary_v1',
  EVENTS: 'minha_plantinha_events_v1',
  TAGS: 'minha_plantinha_tags_v1',
  PROFILE: 'minha_plantinha_profile_v1',
  ALERT_SETTINGS: 'minha_plantinha_alert_settings_v1',
  CACHED_WEATHER: 'minha_plantinha_cached_weather_v1',
  CANNABIS_PLANTS: 'minha_plantinha_cannabis_plants_v5',
  CANNABIS_FEED: 'minha_plantinha_cannabis_feed_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  // Cultivation Mode: 'horta' (Traditional) vs 'cannabis' (Medicinal)
  const [cultivationMode, setCultivationModeState] = useState<CultivationMode>(() => {
    const saved = localStorage.getItem('minha_plantinha_mode_v1');
    return (saved === 'cannabis' || saved === 'horta') ? saved : 'horta';
  });

  const setCultivationMode = useCallback((mode: CultivationMode) => {
    setCultivationModeState(mode);
    localStorage.setItem('minha_plantinha_mode_v1', mode);
  }, []);

  // Comparison State
  const [comparisonPlantId, setComparisonPlantId] = useState<string | null>(null);
  const [comparisonPhotoA, setComparisonPhotoA] = useState<string | null>(null);
  const [comparisonPhotoB, setComparisonPhotoB] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(curr => (curr === msg ? null : curr));
    }, 4000);
  }, []);

  // Sample Data mode control:
  const [isUsingSampleData, setIsUsingSampleData] = useState<boolean>(() => {
    const saved = localStorage.getItem('minha_plantinha_is_sample_mode');
    return saved === 'true';
  });

  // Load state from localStorage or empty (unless sample mode enabled)
  const [plants, setPlants] = useState<Plant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const sampleMode = localStorage.getItem('minha_plantinha_is_sample_mode');
    return sampleMode === 'true' ? initialPlants : [];
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DIARY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const sampleMode = localStorage.getItem('minha_plantinha_is_sample_mode');
    return sampleMode === 'true' ? initialDiaryEntries : [];
  });

  const [plantEvents, setPlantEvents] = useState<PlantEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const sampleMode = localStorage.getItem('minha_plantinha_is_sample_mode');
    return sampleMode === 'true' ? initialPlantEvents : [];
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TAGS);
    return saved ? JSON.parse(saved) : initialTags;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [alertSettings, setAlertSettings] = useState<WeatherAlertSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERT_SETTINGS);
    return saved ? JSON.parse(saved) : initialAlertSettings;
  });

  // Cannabis Cultivation State
  const [cannabisPlants, setCannabisPlants] = useState<CannabisPlant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANNABIS_PLANTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const sampleMode = localStorage.getItem('minha_plantinha_is_sample_mode');
    return sampleMode === 'true' ? initialCannabisPlants : [];
  });

  const [cannabisFeedLogs, setCannabisFeedLogs] = useState<CannabisFeedLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANNABIS_FEED);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const sampleMode = localStorage.getItem('minha_plantinha_is_sample_mode');
    return sampleMode === 'true' ? initialCannabisFeedLogs : [];
  });

  // Synchronize collections to IndexedDB and LocalStorage in the background
  useEffect(() => {
    storageService.saveAll('plants', plants, STORAGE_KEYS.PLANTS).catch(() => {});
  }, [plants]);

  useEffect(() => {
    storageService.saveAll('diaryEntries', diaryEntries, STORAGE_KEYS.DIARY).catch(() => {});
  }, [diaryEntries]);

  useEffect(() => {
    storageService.saveAll('plantEvents', plantEvents, STORAGE_KEYS.EVENTS).catch(() => {});
  }, [plantEvents]);

  useEffect(() => {
    storageService.saveAll('tags', tags, STORAGE_KEYS.TAGS).catch(() => {});
  }, [tags]);

  useEffect(() => {
    storageService.saveAll('cannabisPlants', cannabisPlants, STORAGE_KEYS.CANNABIS_PLANTS).catch(() => {});
  }, [cannabisPlants]);

  useEffect(() => {
    storageService.saveAll('cannabisFeedLogs', cannabisFeedLogs, STORAGE_KEYS.CANNABIS_FEED).catch(() => {});
  }, [cannabisFeedLogs]);

  // Onboarding Walkthrough & Setup Modal State
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    return !userProfile.onboarding_completed;
  });

  // Design Preview (Etapa 02)
  const [isDesignPreviewOpen, setIsDesignPreviewOpen] = useState<boolean>(false);

  // Auth State (Etapa 04)
  const SESSION_KEY = 'minha_plantinha_session_v1';
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; full_name: string } | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : { id: 'usr-1', email: 'camila@plantinha.app', full_name: 'Camila Duarte' };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved !== null ? true : true;
  });

  const loginUser = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Informe um email válido.' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'A senha deve conter no mínimo 8 caracteres.' };
    }

    const user = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      full_name: email.split('@')[0].replace('.', ' ')
    };

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    showToast(`Bem-vindo de volta! Sessão iniciada.`);
    return { success: true };
  }, [showToast]);

  const registerUser = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Informe seu nome completo.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Informe um email válido.' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'A senha deve conter no mínimo 8 caracteres.' };
    }

    const user = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      full_name: name.trim()
    };

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    
    // Auto-update profile
    setUserProfile(prev => ({ ...prev, id: user.id, full_name: user.full_name }));
    showToast(`Conta criada com sucesso! Perfil configurado.`);
    return { success: true };
  }, [showToast]);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Você encerrou a sessão com segurança.');
  }, [showToast]);

  const changePassword = useCallback((currentPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!currentPassword) {
      return { success: false, error: 'Informe a sua senha atual.' };
    }
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'A nova senha deve ter no mínimo 8 caracteres.' };
    }
    showToast('Senha alterada com sucesso!');
    return { success: true };
  }, [showToast]);

  const deleteAccount = useCallback(() => {
    // Clear all storage keys
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem(SESSION_KEY);

    // Reset state
    setPlants([]);
    setDiaryEntries([]);
    setPlantEvents([]);
    setTags([]);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserProfile({
      id: '',
      full_name: '',
      avatar_url: '',
      weather_city: 'São Paulo, SP',
      weather_lat: -23.5505,
      weather_lng: -46.6333,
      created_at: new Date().toISOString()
    });
    showToast('Conta excluída com sucesso. Todos os dados foram removidos.');
  }, [showToast]);

  // Weather state (cached in localStorage to eliminate CLS and mobile layout shifts)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CACHED_WEATHER);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [calculatedAlerts, setCalculatedAlerts] = useState<CalculatedAlert[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CACHED_WEATHER);
      if (cached) {
        const parsed = JSON.parse(cached);
        const savedSettings = localStorage.getItem(STORAGE_KEYS.ALERT_SETTINGS);
        const settings = savedSettings ? JSON.parse(savedSettings) : initialAlertSettings;
        return evaluateWeatherAlerts(parsed, settings);
      }
      return [];
    } catch {
      return [];
    }
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(plantEvents));
  }, [plantEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERT_SETTINGS, JSON.stringify(alertSettings));
  }, [alertSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANNABIS_PLANTS, JSON.stringify(cannabisPlants));
  }, [cannabisPlants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANNABIS_FEED, JSON.stringify(cannabisFeedLogs));
  }, [cannabisFeedLogs]);

  // Complete User Onboarding & Personalize Application
  const completeOnboarding = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated: UserProfile = {
        ...prev,
        ...updates,
        onboarding_completed: true,
      };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    });
    setIsWelcomeOpen(false);
    showToast('✨ Experiência personalizada! Seu Minha Plantinha foi adaptado com sucesso.');
  }, [showToast]);

  // Cannabis CRUD
  const addCannabisPlant = useCallback((plantData: Partial<CannabisPlant> & { name: string; strain: string; stage: CannabisGrowthStage }) => {
    const now = new Date().toISOString();
    const newPlant: CannabisPlant = {
      id: `cnb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userProfile.id,
      name: plantData.name,
      strain: plantData.strain,
      strain_type: plantData.strain_type || 'hibrida',
      is_autoflower: !!plantData.is_autoflower,
      stage: plantData.stage,
      stage_start_date: plantData.stage_start_date || now.split('T')[0],
      germination_date: plantData.germination_date || now.split('T')[0],
      photoperiod: plantData.photoperiod || '18/6',
      medium: plantData.medium || 'solo_organico',
      pot_size_liters: plantData.pot_size_liters || 11,
      target_ph: plantData.target_ph || 6.2,
      target_ec: plantData.target_ec || 1.4,
      target_temp: plantData.target_temp || 24,
      target_rh: plantData.target_rh || 55,
      training_techniques: plantData.training_techniques || [],
      trichome_status: plantData.trichome_status || 'transparentes',
      cover_photo_url: plantData.cover_photo_url || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
      notes: plantData.notes || '',
      created_at: now,
      updated_at: now
    };
    setCannabisPlants(prev => [newPlant, ...prev]);
    showToast(`Cultivo "${newPlant.name}" adicionado com sucesso!`);
    return newPlant;
  }, [userProfile.id, showToast]);

  const updateCannabisPlant = useCallback((id: string, updates: Partial<CannabisPlant>) => {
    setCannabisPlants(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates, updated_at: new Date().toISOString() };
      }
      return p;
    }));
    showToast('Espécime de cannabis atualizado!');
  }, [showToast]);

  const deleteCannabisPlant = useCallback((id: string) => {
    const p = cannabisPlants.find(item => item.id === id);
    setCannabisPlants(prev => prev.filter(item => item.id !== id));
    setCannabisFeedLogs(prev => prev.filter(item => item.plant_id !== id));
    showToast(`Espécime "${p?.name || ''}" removido.`);
  }, [cannabisPlants, showToast]);

  const addCannabisFeedLog = useCallback((logData: Omit<CannabisFeedLog, 'id'>) => {
    const newLog: CannabisFeedLog = {
      ...logData,
      id: `feed-${Date.now()}`
    };
    setCannabisFeedLogs(prev => [newLog, ...prev]);
    showToast('Registro de fertirrigação salvo com sucesso!');
    return newLog;
  }, [showToast]);

  const deleteCannabisFeedLog = useCallback((id: string) => {
    setCannabisFeedLogs(prev => prev.filter(item => item.id !== id));
    showToast('Registro de rega/nutrientes excluído.');
  }, [showToast]);

  // Fetch weather data when user profile coordinates change
  const refreshWeather = useCallback(async () => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchOpenMeteoWeather(
        userProfile.weather_lat,
        userProfile.weather_lng,
        userProfile.weather_city
      );
      setWeatherData(data);
      localStorage.setItem(STORAGE_KEYS.CACHED_WEATHER, JSON.stringify(data));

      const computed = evaluateWeatherAlerts(data, alertSettings);
      setCalculatedAlerts(computed);
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [userProfile.weather_lat, userProfile.weather_lng, userProfile.weather_city, alertSettings]);

  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  // Comparison helper
  const openComparison = useCallback((plantId: string, photoAUrl?: string, photoBUrl?: string) => {
    setComparisonPlantId(plantId);
    if (photoAUrl) setComparisonPhotoA(photoAUrl);
    if (photoBUrl) setComparisonPhotoB(photoBUrl);
    setActiveTab('plantas');
    setSelectedPlantId(plantId);
  }, []);

  // Plant CRUD
  const addPlant = useCallback((plantData: Partial<Plant> & { name: string; acquired_date: string }) => {
    const now = new Date().toISOString();
    const newPlant: Plant = {
      id: `plant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: userProfile.id,
      name: plantData.name,
      species: plantData.species || '',
      cover_photo_url: plantData.cover_photo_url || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      acquired_date: plantData.acquired_date,
      status: plantData.status || 'active',
      location: plantData.location || 'indoor',
      light_level: plantData.light_level || 'alta_indireta',
      watering_frequency_days: plantData.watering_frequency_days || 7,
      notes: plantData.notes || '',
      created_at: now,
      updated_at: now,
    };

    setPlants(prev => [newPlant, ...prev]);
    showToast(`Planta "${newPlant.name}" cadastrada com sucesso!`);
    return newPlant;
  }, [userProfile.id, showToast]);

  const updatePlant = useCallback((id: string, updates: Partial<Plant>) => {
    setPlants(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates, updated_at: new Date().toISOString() };
      }
      return p;
    }));
    showToast('Planta atualizada com sucesso!');
  }, [showToast]);

  const deletePlant = useCallback((id: string) => {
    const plant = plants.find(p => p.id === id);
    setPlants(prev => prev.filter(p => p.id !== id));
    setDiaryEntries(prev => prev.filter(e => e.plant_id !== id));
    setPlantEvents(prev => prev.filter(e => e.plant_id !== id));
    if (selectedPlantId === id) setSelectedPlantId(null);
    showToast(`Planta "${plant?.name || ''}" removida.`);
  }, [plants, selectedPlantId, showToast]);

  // Diary CRUD
  const addDiaryEntry = useCallback((entryData: {
    plant_id: string;
    entry_date: string;
    entry_time?: string;
    content: string;
    photos: Array<{ storage_path: string; caption?: string }>;
    tag_names?: string[];
  }) => {
    const now = new Date().toISOString();
    const entryId = `entry-${Date.now()}`;

    // Map or create tags
    const entryTags: Tag[] = (entryData.tag_names || []).map((name) => {
      const cleanName = name.replace(/^#/, '').toLowerCase().trim();
      const existing = tags.find(t => t.name.toLowerCase() === cleanName);
      if (existing) return existing;
      const newTag: Tag = {
        id: `tag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: userProfile.id,
        name: cleanName,
        color: '#10b981'
      };
      setTags(prev => [...prev, newTag]);
      return newTag;
    });

    const newPhotos = entryData.photos.map((p, idx) => ({
      id: `photo-${Date.now()}-${idx}`,
      entry_id: entryId,
      user_id: userProfile.id,
      storage_path: p.storage_path,
      caption: p.caption || '',
      display_order: idx,
      created_at: now
    }));

    const newEntry: DiaryEntry = {
      id: entryId,
      plant_id: entryData.plant_id,
      user_id: userProfile.id,
      entry_date: entryData.entry_date,
      entry_time: entryData.entry_time || new Date().toTimeString().slice(0, 5),
      content: entryData.content,
      photos: newPhotos,
      tags: entryTags,
      created_at: now
    };

    setDiaryEntries(prev => [newEntry, ...prev]);

    // If new entry has a photo, update plant's cover photo if plant didn't have one
    if (newPhotos.length > 0) {
      setPlants(prev => prev.map(p => {
        if (p.id === entryData.plant_id && !p.cover_photo_url) {
          return { ...p, cover_photo_url: newPhotos[0].storage_path };
        }
        return p;
      }));
    }

    showToast('Novo registro no diário salvo com sucesso!');
    return newEntry;
  }, [userProfile.id, tags, showToast]);

  const deleteDiaryEntry = useCallback((id: string) => {
    setDiaryEntries(prev => prev.filter(e => e.id !== id));
    showToast('Registro do diário excluído.');
  }, [showToast]);

  // Plant Events CRUD
  const addPlantEvent = useCallback((eventData: {
    plant_id: string;
    event_type: EventType;
    event_date: string;
    notes?: string;
  }) => {
    const newEvent: PlantEvent = {
      id: `event-${Date.now()}`,
      plant_id: eventData.plant_id,
      user_id: userProfile.id,
      event_type: eventData.event_type,
      event_date: eventData.event_date,
      notes: eventData.notes || '',
      created_at: new Date().toISOString()
    };

    setPlantEvents(prev => [newEvent, ...prev]);
    showToast(`Evento de ${eventData.event_type} registrado!`);
    return newEvent;
  }, [userProfile.id, showToast]);

  const deletePlantEvent = useCallback((id: string) => {
    setPlantEvents(prev => prev.filter(e => e.id !== id));
    showToast('Evento removido.');
  }, [showToast]);

  // Settings
  const updateAlertSettings = useCallback((updates: Partial<WeatherAlertSettings>) => {
    setAlertSettings(prev => {
      const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
      if (weatherData) {
        setCalculatedAlerts(evaluateWeatherAlerts(weatherData, updated));
      }
      return updated;
    });
    showToast('Configurações de alerta atualizadas!');
  }, [weatherData, showToast]);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    showToast('Perfil atualizado!');
  }, [showToast]);

  // Test notification
  const triggerTestAlert = useCallback(() => {
    const testAlert: CalculatedAlert = {
      id: `test-${Date.now()}`,
      type: 'rain',
      severity: 'warning',
      title: 'Teste de Alerta Meteorológico',
      description: 'Simulação de notificação: Chuva prevista de 75% para as próximas horas.',
      plantCareTip: 'Plantas em área descoberta ou vasos sem dreno devem ser checados para evitar raízes encharcadas.',
      metrics: '75% prob. chuva',
      timestamp: new Date().toISOString()
    };
    setCalculatedAlerts(prev => [testAlert, ...prev]);
    showToast('🔔 Alerta de teste simulado e adicionado ao painel!');
  }, [showToast]);

  // Reset to Demo
  const resetToDemoData = useCallback(() => {
    setPlants(initialPlants);
    setDiaryEntries(initialDiaryEntries);
    setPlantEvents(initialPlantEvents);
    setTags(initialTags);
    setUserProfile(initialProfile);
    setAlertSettings(initialAlertSettings);
    setCannabisPlants(initialCannabisPlants);
    setCannabisFeedLogs(initialCannabisFeedLogs);
    localStorage.clear();
    showToast('Dados restaurados para o catálogo de exemplo!');
  }, [showToast]);

  const enableSampleData = useCallback(() => {
    setPlants(initialPlants);
    setDiaryEntries(initialDiaryEntries);
    setPlantEvents(initialPlantEvents);
    setTags(initialTags);
    setCannabisPlants(initialCannabisPlants);
    setCannabisFeedLogs(initialCannabisFeedLogs);
    setIsUsingSampleData(true);
    localStorage.setItem('minha_plantinha_is_sample_mode', 'true');
    storageService.seedSampleData().catch(() => {});
    showToast('Modo de Exemplo ativado! 6 plantas e histórico de fotos carregados.');
  }, [showToast]);

  const clearToEmptyData = useCallback(() => {
    setPlants([]);
    setDiaryEntries([]);
    setPlantEvents([]);
    setCannabisPlants([]);
    setCannabisFeedLogs([]);
    setIsUsingSampleData(false);
    localStorage.setItem('minha_plantinha_is_sample_mode', 'false');
    storageService.clearAllData().catch(() => {});
    showToast('Catálogo limpo. Comece cadastrando suas próprias plantas!');
  }, [showToast]);

  // Export JSON
  const exportBackup = useCallback(() => {
    const backupData = {
      version: '1.1',
      exported_at: new Date().toISOString(),
      profile: userProfile,
      alertSettings,
      plants,
      diaryEntries,
      plantEvents,
      tags,
      cannabisPlants,
      cannabisFeedLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minha-plantinha-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso!');
  }, [userProfile, alertSettings, plants, diaryEntries, plantEvents, tags, cannabisPlants, cannabisFeedLogs, showToast]);

  // Import JSON
  const importBackup = useCallback((jsonContent: string): boolean => {
    try {
      const data = JSON.parse(jsonContent);
      if (Array.isArray(data.plants)) {
        setPlants(data.plants);
        if (Array.isArray(data.diaryEntries)) setDiaryEntries(data.diaryEntries);
        if (Array.isArray(data.plantEvents)) setPlantEvents(data.plantEvents);
        if (Array.isArray(data.tags)) setTags(data.tags);
        if (data.profile) setUserProfile(data.profile);
        if (data.alertSettings) setAlertSettings(data.alertSettings);
        if (Array.isArray(data.cannabisPlants)) setCannabisPlants(data.cannabisPlants);
        if (Array.isArray(data.cannabisFeedLogs)) setCannabisFeedLogs(data.cannabisFeedLogs);
        showToast('Backup importado com sucesso!');
        return true;
      }
      throw new Error('Formato de arquivo inválido');
    } catch (err) {
      console.error('Error importing backup:', err);
      showToast('Erro ao importar backup: arquivo inválido.');
      return false;
    }
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        cultivationMode,
        setCultivationMode,
        selectedPlantId,
        setSelectedPlantId,
        plants,
        diaryEntries,
        plantEvents,
        tags,
        userProfile,
        alertSettings,
        weatherData,
        calculatedAlerts,
        isLoadingWeather,
        isWelcomeOpen,
        setIsWelcomeOpen,
        completeOnboarding,
        cannabisPlants,
        cannabisFeedLogs,
        addCannabisPlant,
        updateCannabisPlant,
        deleteCannabisPlant,
        addCannabisFeedLog,
        deleteCannabisFeedLog,
        isAuthenticated,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        isDesignPreviewOpen,
        setIsDesignPreviewOpen,
        comparisonPlantId,
        setComparisonPlantId,
        openComparison,
        comparisonPhotoA,
        comparisonPhotoB,
        setComparisonPhotoA,
        setComparisonPhotoB,
        addPlant,
        updatePlant,
        deletePlant,
        addDiaryEntry,
        deleteDiaryEntry,
        addPlantEvent,
        deletePlantEvent,
        updateAlertSettings,
        updateUserProfile,
        changePassword,
        deleteAccount,
        refreshWeather,
        triggerTestAlert,
        resetToDemoData,
        exportBackup,
        importBackup,
        isUsingSampleData,
        enableSampleData,
        clearToEmptyData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
