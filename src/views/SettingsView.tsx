import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { searchCities, GeocodingResult } from '../services/weatherService.ts';
import { 
  Settings, 
  User, 
  Camera, 
  MapPin, 
  Bell, 
  CloudSun, 
  Shield, 
  KeyRound, 
  LogOut, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  Smartphone, 
  Check, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  X,
  Cannabis,
  Compass
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    alertSettings, 
    updateAlertSettings, 
    changePassword, 
    deleteAccount, 
    triggerTestAlert, 
    exportBackup, 
    importBackup, 
    resetToDemoData, 
    refreshWeather, 
    logoutUser,
    setIsWelcomeOpen
  } = useApp();

  // Profile Form
  const [nameInput, setNameInput] = useState(userProfile.full_name);
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar_url || '');

  // Weather Search
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityResults, setCityResults] = useState<GeocodingResult[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  // Password change modal / state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ error?: string; success?: string } | null>(null);

  // 2-Step Account Deletion state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Handle avatar file upload
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAvatarPreview(base64);
        updateUserProfile({ avatar_url: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUserProfile({
      full_name: nameInput.trim(),
      avatar_url: avatarPreview
    });
  };

  // Search city via Open-Meteo Geocoding
  const handleCitySearch = async () => {
    if (!citySearchQuery.trim()) return;
    setIsSearchingCity(true);
    const results = await searchCities(citySearchQuery);
    setCityResults(results);
    setIsSearchingCity(false);
  };

  const handleSelectCity = (city: GeocodingResult) => {
    const cityName = `${city.name}${city.admin1 ? `, ${city.admin1}` : ''}`;
    updateUserProfile({
      weather_city: cityName,
      weather_lat: city.latitude,
      weather_lng: city.longitude
    });
    setCityResults([]);
    setCitySearchQuery('');
  };

  // Password submit
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ error: 'A confirmação de senha não confere.' });
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    if (!result.success) {
      setPasswordFeedback({ error: result.error });
    } else {
      setPasswordFeedback({ success: 'Senha atualizada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // 2-Step Delete Account confirmation
  const handleConfirmAccountDeletion = () => {
    if (deleteConfirmationText.trim().toUpperCase() === 'EXCLUIR') {
      deleteAccount();
      setIsDeleteModalOpen(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          importBackup(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
            Configurações Unificadas
          </h1>
        </div>
        <p className="text-xs text-emerald-300/70 mt-1">
          Gerencie seu perfil, localização climática, regras de alerta e dados da conta
        </p>
      </div>

      {/* 1. SEÇÃO PERFIL (ETAPA 18 TAREFA 1 & 2) */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-emerald-900/40 space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <User className="w-4 h-4 text-emerald-400" />
          <span>Perfil do Usuário</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar Preview & Upload */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-black/60 border-2 border-emerald-600/60 group">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-500">
                  <User className="w-8 h-8" />
                </div>
              )}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer">
                <Camera className="w-4 h-4 text-emerald-300" />
                <span className="text-[9px] text-emerald-200 mt-1">Alterar</span>
                <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
              </label>
            </div>
            
            <label className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium">
              Carregar foto
              <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
            </label>
          </div>

          {/* Form Fields */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Nome de Exibição
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-[#07130e] border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Avatar presets */}
            <div>
              <span className="text-[10px] text-emerald-400/70 block mb-1.5 font-medium">
                Ou selecione um avatar rápido:
              </span>
              <div className="flex items-center gap-2">
                {avatarPresets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setAvatarPreview(preset);
                      updateUserProfile({ avatar_url: preset });
                    }}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarPreview === preset ? 'border-emerald-400 scale-110 shadow-sm' : 'border-emerald-900/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Salvar Alterações do Perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEÇÃO ADAPTAÇÃO & FOCO DE CULTIVO (iOS Safari Style) */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-emerald-900/40 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Adaptação do App & Foco de Cultivo</span>
          </div>

          <button
            onClick={() => setIsWelcomeOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Reabrir Passo a Passo / Tutorial</span>
          </button>
        </div>

        <p className="text-xs text-emerald-300/70 leading-relaxed">
          O Minha Plantinha adapta os cards do Dashboard, os alertas meteorológicos e as sugestões de cultivo de acordo com o seu perfil.
        </p>

        {/* Primary Focus Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-emerald-300">
            Foco Principal de Cultivo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'todas', label: '🌿 Coleção Mista (Todas)', desc: 'Plantas ornamentais, horta e espécies especiais' },
              { id: 'cannabis', label: '🍁 Cannabis Especializado', desc: 'Controle de fotoperíodo, estágios florais e fertirrigação' },
              { id: 'ornamentais', label: '🪴 Plantas de Interior', desc: 'Folhagens, Monsteras, Ficus e Philodendrons' },
              { id: 'horta', label: '🌱 Horta & Ervas', desc: 'Temperos, aromáticas e pequenos vegetais' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateUserProfile({ primary_focus: f.id as any })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  userProfile.primary_focus === f.id
                    ? 'bg-emerald-900/40 border-emerald-500 text-white shadow-sm shadow-emerald-950 font-bold'
                    : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300/70 hover:bg-emerald-950/40'
                }`}
              >
                <div className="text-xs">{f.label}</div>
                <div className="text-[10px] text-emerald-400/60 font-normal mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Environment / Grow Type */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-emerald-300">
            Ambiente Principal de Cultivo
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'indoor', label: 'Indoor / Estufa' },
              { id: 'outdoor', label: 'Jardim / Quintal' },
              { id: 'greenhouse', label: 'Varanda / Janela' },
              { id: 'hydro', label: 'Hidroponia' }
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => updateUserProfile({ grow_type: g.id as any })}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                  userProfile.grow_type === g.id
                    ? 'bg-emerald-600 text-emerald-950 font-bold border-emerald-400'
                    : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-emerald-300">
            Nível de Experiência
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'iniciante', label: 'Iniciante' },
              { id: 'intermediario', label: 'Entusiasta' },
              { id: 'avancado', label: 'Master Grower' }
            ].map(exp => (
              <button
                key={exp.id}
                type="button"
                onClick={() => updateUserProfile({ experience_level: exp.id as any })}
                className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                  userProfile.experience_level === exp.id
                    ? 'bg-emerald-700/60 border-emerald-500 text-white font-bold'
                    : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400/80 hover:text-white'
                }`}
              >
                {exp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SEÇÃO LOCALIZAÇÃO & CLIMA (ETAPA 18 TAREFA 1 & 4) */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-emerald-900/40 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Localização & Previsão Meteorológica (Open-Meteo)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider block">Cidade Ativa:</span>
            <span className="text-sm font-bold text-white">{userProfile.weather_city}</span>
            <p className="text-[11px] text-emerald-300/70 font-mono mt-0.5">
              Coordenadas: {userProfile.weather_lat.toFixed(4)}, {userProfile.weather_lng.toFixed(4)}
            </p>
          </div>
          <button
            onClick={() => refreshWeather()}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Sincronizar Agora
          </button>
        </div>

        {/* City Search via Open-Meteo */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-emerald-300">
            Alterar Cidade de Referência
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={citySearchQuery}
              onChange={(e) => setCitySearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCitySearch(); }}
              placeholder="Digite o nome da cidade (ex: Curitiba, Rio de Janeiro, Florianópolis...)"
              className="flex-1 bg-[#07130e] border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCitySearch}
              disabled={isSearchingCity}
              className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isSearchingCity ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </div>

          {/* Search results */}
          {cityResults.length > 0 && (
            <div className="p-2 bg-[#081510] border border-emerald-800/60 rounded-xl space-y-1 mt-2">
              <span className="text-[10px] text-emerald-400/70 px-2 font-semibold">Cidades encontradas:</span>
              {cityResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCity(c)}
                  className="w-full text-left p-2 rounded-lg hover:bg-emerald-900/40 text-xs text-white flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-medium">{c.name}, {c.admin1 || c.country}</span>
                  <span className="text-[10px] font-mono text-emerald-400/70">Selecionar →</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. SEÇÃO ALERTAS METEOROLÓGICOS (ETAPA 18 TAREFA 1) */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-emerald-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span>Preferências de Alertas Meteorológicos</span>
          </div>

          <button
            onClick={() => triggerTestAlert()}
            className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Disparar Alerta de Teste</span>
          </button>
        </div>

        <p className="text-xs text-emerald-300/70 leading-relaxed">
          Os alertas são acionados apenas quando as previsões meteorológicas superarem os limiares de risco configurados abaixo.
        </p>

        {/* Toggle switches */}
        <div className="space-y-3 pt-1">
          
          <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-white block">Alerta de Chuva Excessiva</span>
              <span className="text-[11px] text-emerald-400/60">Avisa quando a probabilidade de precipitação ultrapassa 60%</span>
            </div>
            <input
              type="checkbox"
              checked={alertSettings.rain_alert}
              onChange={(e) => updateAlertSettings({ rain_alert: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-white block">Oscilação Térmica Brusca</span>
              <span className="text-[11px] text-emerald-400/60">Avisa quando a variação diária de temperatura for superior a 8°C</span>
            </div>
            <input
              type="checkbox"
              checked={alertSettings.temp_swing_alert}
              onChange={(e) => updateAlertSettings({ temp_swing_alert: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-white block">Alerta de Ventos Fortes</span>
              <span className="text-[11px] text-emerald-400/60">Avisa quando a velocidade do vento ultrapassar 35 km/h</span>
            </div>
            <input
              type="checkbox"
              checked={alertSettings.wind_alert}
              onChange={(e) => updateAlertSettings({ wind_alert: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-white block">Temperaturas Extremas (Geada ou Calor Excessivo)</span>
              <span className="text-[11px] text-emerald-400/60">Mínima abaixo de 6°C ou máxima acima de 34°C</span>
            </div>
            <input
              type="checkbox"
              checked={alertSettings.severe_alert}
              onChange={(e) => updateAlertSettings({ severe_alert: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </label>

        </div>

        {/* Quiet Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">
              Sensibilidade das Notificações
            </label>
            <select
              value={alertSettings.sensitivity}
              onChange={(e) => updateAlertSettings({ sensitivity: e.target.value as 'baixa' | 'media' | 'alta' })}
              className="w-full bg-[#07130e] border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="baixa">Baixa (Apenas alertas severos/críticos)</option>
              <option value="media">Média (Recomendado para cultivo geral)</option>
              <option value="alta">Alta (Ideal para espécies raras e sensíveis)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Silêncio Início
              </label>
              <input
                type="time"
                value={alertSettings.quiet_hours_start || '22:00'}
                onChange={(e) => updateAlertSettings({ quiet_hours_start: e.target.value })}
                className="w-full bg-[#07130e] border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Silêncio Término
              </label>
              <input
                type="time"
                value={alertSettings.quiet_hours_end || '07:00'}
                onChange={(e) => updateAlertSettings({ quiet_hours_end: e.target.value })}
                className="w-full bg-[#07130e] border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEÇÃO CONTA & SEGURANÇA (ETAPA 18 TAREFA 1, 3) */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-emerald-900/40 space-y-6">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <span>Conta & Segurança</span>
        </div>

        {/* Change password form */}
        <form onSubmit={handleChangePasswordSubmit} className="space-y-3 bg-[#07130e]/60 p-4 rounded-xl border border-emerald-900/40">
          <span className="text-xs font-semibold text-emerald-200 block">
            Alterar Senha de Acesso
          </span>

          {passwordFeedback?.error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {passwordFeedback.error}
            </div>
          )}
          {passwordFeedback?.success && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
              {passwordFeedback.success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-emerald-400/80 mb-1">Senha Atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050d09] border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-emerald-400/80 mb-1">Nova Senha (mín. 8 caracteres)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050d09] border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-emerald-400/80 mb-1">Confirmar Nova Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050d09] border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 text-xs font-semibold cursor-pointer transition-colors"
          >
            Atualizar Senha
          </button>
        </form>

        {/* Sessions & Danger zone */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          
          <button
            onClick={() => {
              if (window.confirm('Deseja realmente sair de todos os dispositivos e encerrar a sessão?')) {
                logoutUser();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair de Todos os Dispositivos (Logout)</span>
          </button>

          <button
            onClick={() => {
              setDeleteConfirmationText('');
              setIsDeleteModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir Conta Permanentemente</span>
          </button>

        </div>
      </div>

      {/* 5. SEÇÃO BACKUP & PRIVACIDADE */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-emerald-900/40 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Privacidade & Backup Local dos Dados</span>
        </div>

        <p className="text-xs text-emerald-300/70 leading-relaxed">
          Exporte um arquivo JSON completo com todas as suas plantas, fotos e histórico. Você pode restaurar em qualquer navegador ou dispositivo a qualquer momento.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => exportBackup()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Backup (JSON)</span>
          </button>

          <label className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Importar Backup</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Restaurar o catálogo com as plantas e fotos de demonstração?')) {
                resetToDemoData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-black/40 hover:bg-emerald-950/80 text-emerald-400 border border-emerald-900/50 text-xs flex items-center gap-2 transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Catálogo Demo</span>
          </button>
        </div>
      </div>

      {/* 2-STEP ACCOUNT DELETION CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1712] border border-rose-800/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>Excluir Conta Permanentemente</span>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-900/60 text-xs text-rose-200 space-y-2 leading-relaxed">
              <p className="font-bold">Esta ação é irreversível e remove tudo em cascata (ON DELETE CASCADE):</p>
              <ul className="list-disc list-inside space-y-1 text-rose-300/80 text-[11px]">
                <li>Todas as plantas cadastradas e fichas botânicas</li>
                <li>Todas as fotos do diário e marcos visuais</li>
                <li>Histórico completo de regas, podas e adubações</li>
                <li>Preferências de alerta meteorológico</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-emerald-200 font-medium">
                Para confirmar a exclusão definitiva, digite a palavra <strong className="text-rose-400 font-mono">EXCLUIR</strong> abaixo:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="EXCLUIR"
                className="w-full bg-[#050c09] border border-rose-800/60 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500 uppercase"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-300 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'EXCLUIR'}
                onClick={handleConfirmAccountDeletion}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Sim, Excluir Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
