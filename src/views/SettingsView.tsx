import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { searchCities, GeocodingResult } from '../services/weatherService.ts';
import { compressImage } from '../utils/imageCompressor.ts';
import { aiService, AiUsageStatus } from '../services/aiService.ts';
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
  Compass,
  FlaskConical,
  Database,
  FileCheck2,
  Info,
  MessageSquare,
  Scale,
  Star,
  Send,
  FileText,
  ShieldCheck,
  CheckCircle2
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
    setIsWelcomeOpen,
    isUsingSampleData,
    enableSampleData,
    clearToEmptyData,
    showToast
  } = useApp();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'perfil' | 'notificacoes' | 'dados' | 'status' | 'feedback' | 'legal'>('perfil');
  const [legalSubDoc, setLegalSubDoc] = useState<'termos' | 'privacidade' | 'cannabis_aviso'>('termos');

  // In-settings feedback form state
  const [fbType, setFbType] = useState<'sugestao' | 'defeito' | 'elogio' | 'outro'>('sugestao');
  const [fbRating, setFbRating] = useState<number>(5);
  const [fbMessage, setFbMessage] = useState('');
  const [fbEmail, setFbEmail] = useState('');
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbSuccess, setFbSuccess] = useState(false);

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

  // AI Usage & Quotas state
  const [aiUsage, setAiUsage] = useState<AiUsageStatus | null>(null);

  React.useEffect(() => {
    aiService.getUsageStatus()
      .then(setAiUsage)
      .catch(err => console.warn('Falha ao obter status de IA em Ajustes:', err));
  }, []);

  const handleTogglePlan = async () => {
    if (!aiUsage) return;
    const nextPlan = aiUsage.plan === 'gratuito' ? 'apoiador' : 'gratuito';
    try {
      const updated = await aiService.setPlan('default_user', nextPlan);
      setAiUsage(updated);
      showToast(`Plano alterado para ${nextPlan === 'apoiador' ? 'Cultivador Apoiador (50/dia)' : 'Plano Gratuito (10/dia)'}!`);
    } catch (e: any) {
      showToast('Erro ao atualizar plano.');
    }
  };

  const handleResetQuota = async () => {
    try {
      const updated = await aiService.resetQuota('default_user');
      setAiUsage(updated);
      showToast('Cota de uso da IA resetada com sucesso para testes!');
    } catch (e: any) {
      showToast('Erro ao resetar cota.');
    }
  };

  // 2-Step Account Deletion state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Handle avatar file upload with compression
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { dataUrl } = await compressImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.85 });
        setAvatarPreview(dataUrl);
        updateUserProfile({ avatar_url: dataUrl });
        showToast('Foto de perfil atualizada e otimizada!');
      } catch (err: any) {
        showToast(err.message || 'Erro ao comprimir imagem de perfil.');
      }
    }
  };

  const handleSaveProfile = () => {
    updateUserProfile({
      full_name: nameInput.trim(),
      avatar_url: avatarPreview
    });
    showToast('Perfil atualizado com sucesso!');
  };

  // Search city via Open-Meteo Geocoding (Real API)
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
    refreshWeather();
    showToast(`Localização meteorológica atualizada para ${cityName}!`);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({ error: 'Todos os campos de senha são obrigatórios.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ error: 'A nova senha e a confirmação não conferem.' });
      return;
    }
    const res = changePassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordFeedback({ success: 'Senha alterada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordFeedback({ error: res.error || 'Erro ao alterar senha.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* 1. Header */}
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] font-mono">
            Painel do Cultivador
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-mono">
            Preferências & Dados
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
          Configurações & Ajustes
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Gerencie seu perfil, notificações, exportação de dados e transparência das funcionalidades.
        </p>
      </div>

      {/* 2. Subtabs Navigation Bar (min 44px touch targets) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSettingsTab('perfil')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSettingsTab === 'perfil'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil & Cultivo</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('notificacoes')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSettingsTab === 'notificacoes'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notificações & Lembretes</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('dados')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSettingsTab === 'dados'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Exportação & Backup</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('status')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSettingsTab === 'status'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Status & Auditoria</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('feedback')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSettingsTab === 'feedback'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feedback (Beta)</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('legal')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSettingsTab === 'legal'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Termos & Legal</span>
        </button>
      </div>

      {/* 3. Subtab Content: Perfil & Preferências */}
      {activeSettingsTab === 'perfil' && (
        <div className="space-y-6">
          
          {/* Profile Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Informações do Cultivador</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative group">
                <img
                  src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors"
                />
                <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-text)] cursor-pointer shadow-md hover:bg-[var(--accent-hover)] transition-transform hover:scale-105">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-xs font-semibold text-[var(--text-primary)]">Nome Completo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs cursor-pointer shadow-sm"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* City / Weather Location (Real Open-Meteo Geocoding) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div>
              <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Localização Meteorológica (API Open-Meteo Real)</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Cidade atual: <strong>{userProfile.weather_city || 'São Paulo, SP'}</strong>. Os alertas de chuva e choque térmico usam os dados meteorológicos desta região.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                  placeholder="Buscar nova cidade (ex: Curitiba, Rio de Janeiro, Florianópolis)..."
                  className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
                <button
                  onClick={handleCitySearch}
                  disabled={isSearchingCity}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{isSearchingCity ? 'Buscando...' : 'Buscar'}</span>
                </button>
              </div>

              {cityResults.length > 0 && (
                <div className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] px-2">Cidades Encontradas:</span>
                  {cityResults.map((city, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectCity(city)}
                      className="w-full min-h-[44px] px-3 py-2 text-left rounded-lg hover:bg-[var(--bg-surface)] text-xs flex items-center justify-between text-[var(--text-primary)] cursor-pointer"
                    >
                      <span>{city.name}{city.admin1 ? `, ${city.admin1}` : ''} ({city.country})</span>
                      <span className="text-[10px] text-[var(--accent-hover)] font-mono font-bold">Selecionar →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Security & Password */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Segurança da Conta</span>
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
                <input
                  type="password"
                  placeholder="Nova senha (min. 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
              </div>

              {passwordFeedback && (
                <div className={`p-2.5 rounded-xl text-xs ${
                  passwordFeedback.error ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {passwordFeedback.error || passwordFeedback.success}
                </div>
              )}

              <button
                type="submit"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs cursor-pointer"
              >
                Atualizar Senha
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 4. Subtab Content: Notificações & Lembretes */}
      {activeSettingsTab === 'notificacoes' && (
        <div className="space-y-6">
          
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[var(--text-primary)] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong>Aviso de Protótipo:</strong> As notificações push para o sistema operacional são <strong>SIMULADAS</strong> nesta versão alfa. O app avalia todas as regras climáticas localmente e exibe avisos na interface e na central de alertas.
            </div>
          </div>

          {/* Quiet Hours & Preferences */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Central de Alertas Meteorológicos</span>
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Escolha quais fenômenos devem gerar avisos no painel principal
                </p>
              </div>

              <button
                onClick={triggerTestAlert}
                className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold cursor-pointer"
              >
                Testar Alerta
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] cursor-pointer">
                <div>
                  <span className="font-semibold text-xs text-[var(--text-primary)] block">Alerta de Chuva Iminente</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Avisa quando a probabilidade passar de 60%</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.rain_alert}
                  onChange={(e) => updateAlertSettings({ rain_alert: e.target.checked })}
                  className="w-4 h-4 accent-[var(--accent-primary)] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] cursor-pointer">
                <div>
                  <span className="font-semibold text-xs text-[var(--text-primary)] block">Alerta de Choque Térmico</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Avisa se a oscilação de temperatura for &gt; 10°C em 24h</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.temp_swing_alert}
                  onChange={(e) => updateAlertSettings({ temp_swing_alert: e.target.checked })}
                  className="w-4 h-4 accent-[var(--accent-primary)] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] cursor-pointer">
                <div>
                  <span className="font-semibold text-xs text-[var(--text-primary)] block">Alerta de Rajadas de Vento</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Recomenda proteger vasos em varandas se vento &gt; 35 km/h</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.wind_alert}
                  onChange={(e) => updateAlertSettings({ wind_alert: e.target.checked })}
                  className="w-4 h-4 accent-[var(--accent-primary)] cursor-pointer"
                />
              </label>
            </div>
          </div>

        </div>
      )}

      {/* 5. Subtab Content: Backup & Exportação */}
      {activeSettingsTab === 'dados' && (
        <div className="space-y-6">
          
          {/* Real JSON Export Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div>
              <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
                <Download className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Exportar Dados do Usuário (JSON Completo) • REAL</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Faça download de todas as suas plantas, fotos, registros de diário, calendário e histórico em um arquivo JSON padronizado e portátil.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-2">
              <button
                onClick={exportBackup}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Backup Agora (.json)</span>
              </button>

              <label className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Restaurar de Arquivo JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        importBackup(content);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Sample Data Control (Clean Slate vs Demo Mode) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div>
              <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-500" />
                <span>Modo Dados de Exemplo (Demonstração)</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Alterne entre uma coleção limpa (com suas plantas reais) ou carregue o catálogo de exemplo completo para demonstrar o app.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[var(--text-primary)] block">
                  Status atual: {isUsingSampleData ? 'Ativo (Dados fictícios carregados)' : 'Inativo (Modo real / Dados próprios)'}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {isUsingSampleData ? 'Você pode limpar os dados fictícios a qualquer momento.' : 'Você pode carregar exemplos para testar.'}
                </span>
              </div>

              {isUsingSampleData ? (
                <button
                  onClick={clearToEmptyData}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold text-xs cursor-pointer hover:bg-rose-500/25 transition-colors"
                >
                  Limpar Dados de Exemplo
                </button>
              ) : (
                <button
                  onClick={enableSampleData}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold text-xs cursor-pointer hover:bg-amber-500/30 transition-colors"
                >
                  Carregar Dados de Exemplo
                </button>
              )}
            </div>
          </div>

          {/* Reset App to Factory Demo */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-rose-900/30 space-y-3">
            <h2 className="font-bold text-sm text-rose-400 font-serif flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>Zona de Perigo • Reset Completo</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Apaga todo o banco IndexedDB local e reinicia o aplicativo para o estado original de fábrica.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Tem certeza? Todos os registros e fotos locais serão apagados.')) {
                  resetToDemoData();
                }
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 text-xs font-semibold cursor-pointer"
            >
              Resetar Tudo de Fábrica
            </button>
          </div>

        </div>
      )}

      {/* 6. Subtab Content: Status & Transparência das Funcionalidades */}
      {activeSettingsTab === 'status' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div>
              <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Auditoria & Transparência de Funcionalidades</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Classificação honesta e rigorosa de cada ferramenta presente no Minha Plantinha.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase font-mono text-[var(--text-muted)]">
                    <th className="py-2.5 px-3">Recurso</th>
                    <th className="py-2.5 px-3">Classificação</th>
                    <th className="py-2.5 px-3">Implementação Real & Limitações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Catálogo de Plantas</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        REAL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">CRUD completo com persistência híbrida em IndexedDB + LocalStorage.</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Diário & Fotos</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        REAL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">Upload com compressão automática via Canvas HTML5 (1280px máx) e persistência IndexedDB.</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Previsão do Tempo</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        REAL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">Conexão real com a API pública e aberta Open-Meteo (temperatura, umidade, chuva, vento).</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Exportação de Dados</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        REAL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">Gera download real de arquivo JSON contendo todas as plantas, notas, eventos e imagens.</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Módulo Cannabis Medicinal</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        REAL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">Gestão técnica de semanas de floração, registro de fertirrigação com pH/EC e tema botânico dedicado.</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Autenticação de Usuário</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        PARCIAL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">Gerenciamento de sessão local no navegador; sincronização remota na nuvem planejada para beta.</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Notificações Push do SO</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        SIMULADA
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">Regras climáticas avaliadas localmente; envio de push nativo de sistema requer service worker remoto.</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">IA Horta (Jardinagem Geral)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        REAL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">Consultoria fitopatológica via Gemini 3.8 Flash, diagnóstico por fotos comprimidas, 4 blocos estruturados e cota diária de consumo.</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">IA Cannabis Medicinal</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        REAL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">Consultoria agronômica técnica via Gemini 3.8 Flash, diretrizes de segurança médica sem prescrição, conformidade legal e cota diária.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Usage & Cost Accounting Card */}
          {aiUsage && (
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-serif">
                    Monitoramento de Consumo de IA & Custos
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Plano {aiUsage.plan === 'apoiador' ? 'Apoiador' : 'Gratuito'}
                  </span>
                  <button
                    onClick={handleTogglePlan}
                    className="min-h-[36px] px-3 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-primary)] cursor-pointer transition-colors"
                  >
                    Alternar Plano
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Consultas Hoje</span>
                  <span className="text-base font-bold font-mono text-[var(--text-primary)]">
                    {aiUsage.usedToday} / {aiUsage.dailyLimit}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Consultas no Mês</span>
                  <span className="text-base font-bold font-mono text-[var(--text-primary)]">
                    {aiUsage.usedThisMonth} / {aiUsage.monthlyLimit}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Custo Estimado</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    ${aiUsage.totalCostUSD.toFixed(4)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Total de Tokens</span>
                  <span className="text-base font-bold font-mono text-[var(--text-primary)]">
                    {aiUsage.totalTokens.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 text-xs">
                <span className="text-[11px] text-[var(--text-muted)]">
                  Distribuição: <strong>{aiUsage.breakdown.horta}</strong> na Horta • <strong>{aiUsage.breakdown.cannabis}</strong> na Cannabis
                </span>
                <button
                  onClick={handleResetQuota}
                  className="min-h-[36px] px-3 rounded-lg bg-[var(--bg-primary)] hover:bg-amber-500/10 text-[var(--text-secondary)] hover:text-amber-400 border border-[var(--border-subtle)] text-[11px] font-medium cursor-pointer transition-colors"
                >
                  Resetar Cota (Teste)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Subtab Content: Feedback da Versão Beta */}
      {activeSettingsTab === 'feedback' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="border-b border-[var(--border-subtle)] pb-3">
              <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Canal Direto de Feedback • Beta Fechada</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Compartilhe sua experiência, relate defeitos ou sugira melhorias para a equipe de desenvolvimento.
              </p>
            </div>

            {fbSuccess ? (
              <div className="p-8 text-center space-y-3 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-subtle)]">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif">
                  Feedback enviado com sucesso!
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                  Agradecemos imensamente por testar o aplicativo e ajudar a tornar o Minha Plantinha cada vez melhor.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFbSuccess(false);
                    setFbMessage('');
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] text-xs font-semibold cursor-pointer"
                >
                  Enviar Novo Feedback
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!fbMessage.trim()) return;
                  setFbSubmitting(true);
                  try {
                    await fetch('/api/feedback', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: fbType,
                        rating: fbRating,
                        message: fbMessage.trim(),
                        email: fbEmail.trim() || undefined,
                        userId: 'default_user'
                      })
                    });
                    setFbSuccess(true);
                    showToast('Feedback registrado com sucesso!');
                  } catch (err) {
                    showToast('Erro ao enviar feedback pela rede. Cópia salva localmente.');
                  } finally {
                    setFbSubmitting(false);
                  }
                }}
                className="space-y-4"
              >
                {/* Category buttons */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)] block">
                    Categoria da Mensagem
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'sugestao', label: 'Sugestão' },
                      { id: 'defeito', label: 'Defeito / Bug' },
                      { id: 'elogio', label: 'Elogio' },
                      { id: 'outro', label: 'Outro' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFbType(item.id as any)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                          fbType === item.id
                            ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-hover)] font-bold'
                            : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)] block">
                    Avaliação Geral da Experiência
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFbRating(star)}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-amber-400 hover:bg-[var(--bg-primary)] cursor-pointer"
                        title={`${star} estrelas`}
                      >
                        <Star className={`w-6 h-6 ${star <= fbRating ? 'fill-amber-400 stroke-amber-400' : 'stroke-stone-600'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)] ml-2">
                      {fbRating} de 5
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="settings-feedback-message" className="text-xs font-semibold text-[var(--text-primary)] block">
                    Mensagem Detalhada *
                  </label>
                  <textarea
                    id="settings-feedback-message"
                    value={fbMessage}
                    onChange={(e) => setFbMessage(e.target.value)}
                    placeholder="Descreva o que funcionou bem, o que pode melhorar ou o passo a passo para reproduzir um defeito..."
                    rows={4}
                    required
                    className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] resize-none leading-relaxed"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="settings-feedback-email" className="text-xs font-semibold text-[var(--text-primary)] block">
                    E-mail para Contato (Opcional)
                  </label>
                  <input
                    id="settings-feedback-email"
                    type="email"
                    value={fbEmail}
                    onChange={(e) => setFbEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full min-h-[44px] px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={fbSubmitting || !fbMessage.trim()}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] text-xs font-bold transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{fbSubmitting ? 'Enviando...' : 'Enviar Feedback'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 8. Subtab Content: Documentos Legais & Diretrizes */}
      {activeSettingsTab === 'legal' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Documentos Legais, Termos & Avisos Sanitários</span>
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Modelos de conformidade jurídica para a versão beta fechada.
                </p>
              </div>

              {/* Document Selector Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setLegalSubDoc('termos')}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    legalSubDoc === 'termos'
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                      : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Termos de Uso
                </button>
                <button
                  type="button"
                  onClick={() => setLegalSubDoc('privacidade')}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    legalSubDoc === 'privacidade'
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                      : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Privacidade
                </button>
                <button
                  type="button"
                  onClick={() => setLegalSubDoc('cannabis_aviso')}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    legalSubDoc === 'cannabis_aviso'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-amber-400 hover:text-amber-300'
                  }`}
                >
                  Aviso Cannabis
                </button>
              </div>
            </div>

            {/* Mandatory Review Notice */}
            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-mono text-[11px] leading-relaxed">
                [REVISAR COM PROFISSIONAL JURÍDICO/MÉDICO ANTES DO LANÇAMENTO PÚBLICO DEFINITIVO]
              </span>
            </div>

            {/* Document Body */}
            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-4">
              {legalSubDoc === 'termos' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-serif">Termos de Uso da Plataforma</h3>
                  <p>1. O <strong>Minha Plantinha</strong> é uma ferramenta tecnológica de diário visual botânico, controle de rotinas de cultivo e consultoria informativa assistida por IA.</p>
                  <p>2. Todas as orientações geradas possuem caráter educativo e botânico. Nenhuma resposta constitui laudo agronômico presencial oficial nem garantia de rendimento vegetal.</p>
                  <p>3. O usuário é o único responsável pelo manejo adequado de insumos, ferramentas e pelo cumprimento estrito das legislações locais aplicáveis.</p>
                  <p>4. O serviço aplica limites de consumo computacional justo para assegurar a perenidade da infraestrutura.</p>
                </div>
              )}

              {legalSubDoc === 'privacidade' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] font-serif">Política de Privacidade & LGPD</h3>
                  <p>1. <strong>Armazenamento Local Soberano:</strong> Seus dados de cultivo, diários e fotos residem prioritariamente no seu próprio navegador via IndexedDB/LocalStorage.</p>
                  <p>2. <strong>Consultas de IA:</strong> Apenas os dados contextuais estritamente necessários para formular a resposta da consulta são transmitidos de forma segura ao servidor serverless.</p>
                  <p>3. <strong>Previsão Climática:</strong> As consultas de clima à Open-Meteo utilizam coordenadas aproximadas sem identificadores pessoais persistidos.</p>
                  <p>4. <strong>Direito de Exclusão e Exportação:</strong> Você pode exportar um backup JSON de todos os seus dados ou realizar a exclusão irreversível da conta a qualquer momento na aba Exportação & Backup.</p>
                </div>
              )}

              {legalSubDoc === 'cannabis_aviso' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-amber-300 font-serif">Aviso Sanitário e Legal sobre Cannabis Medicinal</h3>
                  <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-100 text-xs">
                    <strong>Vedações Expressas:</strong> O aplicativo NÃO realiza prescrição de medicamentos, NÃO indica doses terapêuticas (mg de canabinoides/dia) para seres humanos e NÃO substitui o médico prescritor habilitado.
                  </div>
                  <p>1. O módulo destina-se exclusivamente ao monitoramento botânico e fitotécnico (pH, EC, fotoperíodo e tricomas) por pacientes legalmente autorizados no Brasil (salvo-conduto judicial ou entidades registradas).</p>
                  <p>2. É vedado qualquer uso ilícito, comércio ou desvio de finalidade. O app não constitui autorização legal nem salvo-conduto.</p>
                  <p>3. Em caso de dúvidas clínicas ou de saúde, consulte sempre seu médico prescritor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
