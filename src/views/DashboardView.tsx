import React, { useMemo, useState, memo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { WeatherWidget } from '../components/WeatherWidget.tsx';
import { 
  Sprout, 
  BookOpen, 
  Droplets, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  Image as ImageIcon,
  Cannabis,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewPlant: () => void;
  onOpenNewDiary: (plantId?: string) => void;
  onOpenNewEvent: (plantId?: string) => void;
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
}

// Stat Card
const StatCard = memo(({ 
  label, 
  value, 
  sublabel, 
  icon: Icon, 
  onClick, 
  accentColor = 'text-[var(--accent-primary)]' 
}: { 
  label: string; 
  value: number; 
  sublabel: string; 
  icon: React.ComponentType<{ className?: string }>; 
  onClick: () => void;
  accentColor?: string;
}) => (
  <button
    type="button" 
    onClick={onClick}
    className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all cursor-pointer text-left w-full shadow-sm group min-h-[44px]"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-wider font-mono">{label}</span>
      <div className={`w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center ${accentColor} group-hover:scale-105 transition-transform`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">{value}</div>
    <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">{sublabel}</span>
  </button>
));
StatCard.displayName = 'StatCard';

export const DashboardView: React.FC<DashboardViewProps> = memo(({
  onOpenNewPlant,
  onOpenNewDiary,
  onOpenNewEvent,
  onSelectPhoto,
}) => {
  const { 
    plants, 
    diaryEntries, 
    plantEvents,
    addPlantEvent,
    setActiveTab,
    userProfile,
    cannabisPlants,
    cultivationMode,
    isUsingSampleData,
    enableSampleData,
    clearToEmptyData,
    calculatedAlerts,
    showToast
  } = useApp();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Format today's date prominently
  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  // Today string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // 1. Calculate "O que fazer hoje" (Regas e Cuidados Pendentes)
  const todaysWateringTasks = useMemo(() => {
    const active = plants.filter(p => p.status === 'active');
    const tasks: Array<{ plant: typeof active[0]; lastWateredDaysAgo: number; interval: number }> = [];

    active.forEach(p => {
      const interval = p.watering_frequency_days || 7;
      // Find latest watering event for this plant
      const wateringEvents = plantEvents.filter(e => e.plant_id === p.id && e.event_type === 'rega');
      let lastDate = p.acquired_date;

      if (wateringEvents.length > 0) {
        const sorted = [...wateringEvents].sort((a, b) => b.event_date.localeCompare(a.event_date));
        lastDate = sorted[0].event_date;
      }

      const diffMs = new Date(todayStr).getTime() - new Date(lastDate).getTime();
      const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      if (diffDays >= interval) {
        tasks.push({ plant: p, lastWateredDaysAgo: diffDays, interval });
      }
    });

    return tasks;
  }, [plants, plantEvents, todayStr]);

  // 2. Plants Needing Attention (> 14 days without diary note or health concern)
  const plantsNeedingAttention = useMemo(() => {
    const active = plants.filter(p => p.status === 'active');
    const needing: Array<{ plant: typeof active[0]; daysWithoutNote: number }> = [];

    active.forEach(plant => {
      const pEntries = diaryEntries.filter(e => e.plant_id === plant.id);
      if (pEntries.length === 0) {
        const diffMs = new Date(todayStr).getTime() - new Date(plant.acquired_date).getTime();
        const diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        needing.push({ plant, daysWithoutNote: diffDays });
      } else {
        const sorted = [...pEntries].sort((a, b) => b.entry_date.localeCompare(a.entry_date));
        const diffMs = new Date(todayStr).getTime() - new Date(sorted[0].entry_date).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 14) {
          needing.push({ plant, daysWithoutNote: diffDays });
        }
      }
    });

    return needing;
  }, [plants, diaryEntries, todayStr]);

  const totalPhotos = useMemo(() => {
    return diaryEntries.reduce((acc, e) => acc + (e.photos ? e.photos.length : 0), 0);
  }, [diaryEntries]);

  // Quick action: water plant today
  const handleQuickWater = (plantId: string, plantName: string) => {
    addPlantEvent({
      plant_id: plantId,
      event_type: 'rega',
      event_date: todayStr,
      notes: 'Rega realizada via painel do dia'
    });
    showToast(`Rega de "${plantName}" confirmada com sucesso!`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Sample Data Mode Banner (when active) */}
      {isUsingSampleData && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[var(--text-primary)]">
              Você está no <strong>Modo Dados de Exemplo</strong> (6 plantas e fotos de demonstração carregadas).
            </span>
          </div>
          <button
            onClick={clearToEmptyData}
            className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-medium text-xs whitespace-nowrap cursor-pointer transition-colors"
          >
            Limpar e Começar do Zero
          </button>
        </div>
      )}

      {/* 1. Header Card with Date and Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] font-mono">
              {formattedToday}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono">
              {cultivationMode === 'cannabis' ? 'Área Medicinal' : 'Área Horta'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
            Olá, {userProfile.full_name || 'Cultivador'}!
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-lg leading-relaxed">
            {plants.length === 0 && cannabisPlants.length === 0 
              ? 'Seu diário botânico está pronto para receber suas primeiras plantas.'
              : `Acompanhando ${plants.length} plantas na horta e ${cannabisPlants.length} espécimes com ${totalPhotos} fotos documentadas.`
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenNewDiary()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer min-h-[44px]"
          >
            <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Novo Registro</span>
          </button>
          
          <button
            onClick={() => onOpenNewPlant()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs transition-colors cursor-pointer min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Nova Planta</span>
          </button>
        </div>
      </div>

      {/* 2. Weather & Botanical Real Forecast (Open-Meteo API Real) */}
      <WeatherWidget />

      {/* Empty State when 0 Plants in the app */}
      {plants.length === 0 && cannabisPlants.length === 0 && (
        <div className="p-8 sm:p-12 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)] shadow-inner">
            <Sprout className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif">
              Nenhuma planta cadastrada ainda
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Você pode cadastrar sua primeira folhagem, tempero ou espécime agora, ou carregar dados de demonstração para explorar todas as funções visuais do app.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenNewPlant}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Cadastrar Minha Primeira Planta</span>
            </button>

            <button
              onClick={enableSampleData}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold text-xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <FlaskConical className="w-4 h-4 text-amber-500" />
              <span>Carregar Dados de Exemplo</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Essential Dashboard Columns: "O Que Fazer Hoje" & "Plantas em Atenção" */}
      {(plants.length > 0 || cannabisPlants.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card: O Que Fazer Hoje */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif">
                    O Que Fazer Hoje
                  </h2>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    Rotina de regas & cuidados programados
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                todaysWateringTasks.length > 0
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {todaysWateringTasks.length} {todaysWateringTasks.length === 1 ? 'pendência' : 'pendências'}
              </span>
            </div>

            {todaysWateringTasks.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs font-semibold text-[var(--text-primary)]">Tudo em dia para hoje!</p>
                <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">
                  Nenhuma rega atrasada ou programada para hoje. Suas plantas estão com substrato hidratado.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todaysWateringTasks.map(({ plant, lastWateredDaysAgo, interval }) => (
                  <div
                    key={plant.id}
                    className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {plant.cover_photo_url ? (
                        <img 
                          src={plant.cover_photo_url} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover border border-[var(--border-subtle)] shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                          <Sprout className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[var(--text-primary)] font-serif line-clamp-1">
                          {plant.name}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          Última rega há {lastWateredDaysAgo}d (intervalo: a cada {interval}d)
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickWater(plant.id, plant.name)}
                      className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95 shadow-sm"
                      title="Registrar rega de hoje"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Regada!</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveTab('cuidados')}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Ver Calendário Completo de Regas</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card: Plantas Que Precisam de Atenção */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[var(--text-primary)] font-serif">
                    Plantas em Atenção
                  </h2>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    Sem registros fotográficos recentes (&gt; 14 dias)
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                plantsNeedingAttention.length > 0
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {plantsNeedingAttention.length}
              </span>
            </div>

            {plantsNeedingAttention.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs font-semibold text-[var(--text-primary)]">Coleção 100% monitorada!</p>
                <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">
                  Todas as suas plantas foram fotografadas ou atualizadas no diário recentemente.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {plantsNeedingAttention.slice(0, 4).map(({ plant, daysWithoutNote }) => (
                  <div
                    key={plant.id}
                    className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {plant.cover_photo_url ? (
                        <img 
                          src={plant.cover_photo_url} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover border border-[var(--border-subtle)] shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                          <Sprout className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[var(--text-primary)] font-serif line-clamp-1">
                          {plant.name}
                        </div>
                        <div className="text-[11px] text-amber-400">
                          {daysWithoutNote} dias sem foto ou evolução
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenNewDiary(plant.id)}
                      className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                      title="Adicionar foto para esta planta"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-hover)]" />
                      <span>Fotografar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveTab('diario')}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Abrir Galeria & Diário Visual</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 4. AI Reserved Entry Points (IA Horta & IA Cannabis - Em Breve) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--text-primary)] font-serif">
                {cultivationMode === 'cannabis' ? 'IA Cannabis • Consultor Fitotécnico' : 'IA Horta • Diagnóstico Visual por Foto'}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Em breve
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
              {cultivationMode === 'cannabis'
                ? 'Análise de tricomas por macrofotografia, cálculo de VPD e detecção de pragas e fungos no cultivo indoor.'
                : 'Identificação de carências de nutrientes (NPK), fungos e pragas por inteligência artificial a partir de uma foto da folha.'
              }
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold shrink-0 cursor-pointer transition-colors"
        >
          Conhecer Funcionalidade
        </button>
      </div>

      {/* Modal: IA Info (Simulado / Em Breve) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] font-serif">
                  {cultivationMode === 'cannabis' ? 'Módulo IA Cannabis' : 'Módulo IA Horta'}
                </h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono font-bold text-amber-400 uppercase">
              Recurso Simulado • Em Desenvolvimento
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Esta funcionalidade conectará modelos de visão computacional para analisar as fotos que você envia ao diário, oferecendo recomendações agronômicas sem substituir o acompanhamento manual.
            </p>

            <button
              onClick={() => setIsAiModalOpen(false)}
              className="w-full min-h-[44px] py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
});
DashboardView.displayName = 'DashboardView';
