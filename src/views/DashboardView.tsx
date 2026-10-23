import React, { useMemo, memo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { WeatherWidget } from '../components/WeatherWidget.tsx';
import { ResumoPlantasWidget } from '../components/dashboard/ResumoPlantasWidget.tsx';
import { UltimasAtualizacoesWidget } from '../components/dashboard/UltimasAtualizacoesWidget.tsx';
import { UltimasFotosWidget } from '../components/dashboard/UltimasFotosWidget.tsx';
import { ProximosEventosWidget } from '../components/dashboard/ProximosEventosWidget.tsx';
import { LazyWidgetContainer } from '../components/dashboard/LazyWidgetContainer.tsx';
import { 
  Sprout, 
  BookOpen, 
  Droplets, 
  Plus, 
  Calendar, 
  AlertCircle, 
  Image as ImageIcon,
  Cannabis,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewPlant: () => void;
  onOpenNewDiary: (plantId?: string) => void;
  onOpenNewEvent: (plantId?: string) => void;
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
}

// 1. Memoized Stat Card for Quick Overview (Above the fold - Critical LCP)
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
  <div 
    onClick={onClick}
    className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all cursor-pointer group shadow-sm"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] text-[var(--text-muted)] uppercase font-bold tracking-wider">{label}</span>
      <div className={`w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center ${accentColor} group-hover:scale-105 transition-transform`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">{value}</div>
    <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">{sublabel}</span>
  </div>
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
    setActiveTab,
    userProfile,
    cannabisPlants,
    setIsWelcomeOpen 
  } = useApp();

  // Format today's date prominently for the top of the dashboard
  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  // User adaptation labels
  const focusLabel = useMemo(() => {
    switch (userProfile.primary_focus) {
      case 'cannabis': return '🍁 Foco: Cultivo Especializado';
      case 'ornamentais': return '🪴 Foco: Plantas de Interior';
      case 'horta': return '🌱 Foco: Horta & Temperos';
      default: return '🌿 Foco: Coleção Botânica Completa';
    }
  }, [userProfile.primary_focus]);

  const growTypeLabel = useMemo(() => {
    switch (userProfile.grow_type) {
      case 'indoor': return 'Ambiente: Indoor / Estufa';
      case 'outdoor': return 'Ambiente: Jardim / Outdoor';
      case 'greenhouse': return 'Ambiente: Varanda / Sol';
      case 'hydro': return 'Ambiente: Hidroponia';
      default: return 'Ambiente: Misto';
    }
  }, [userProfile.grow_type]);

  // Memoize top-level collection metrics
  const { 
    activePlantsCount, 
    entriesThisMonth, 
    totalPhotos, 
    plantsNeedingCareCount,
    cannabisVegaCount,
    cannabisFloraCount
  } = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const active = plants.filter(p => p.status === 'active');
    const currentMonthStr = todayStr.slice(0, 7);
    const thisMonth = diaryEntries.filter(e => e.entry_date.startsWith(currentMonthStr)).length;
    const photos = diaryEntries.reduce((acc, e) => acc + (e.photos ? e.photos.length : 0), 0);

    let needing = 0;
    active.forEach(plant => {
      const pEntries = diaryEntries.filter(e => e.plant_id === plant.id);
      if (pEntries.length === 0) {
        needing++;
      } else {
        const sorted = [...pEntries].sort((a, b) => b.entry_date.localeCompare(a.entry_date));
        const diffMs = Math.abs(new Date(todayStr).getTime() - new Date(sorted[0].entry_date).getTime());
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 14) needing++;
      }
    });

    const vega = cannabisPlants.filter(p => ['vegetativo', 'plantula', 'germinacao'].includes(p.stage)).length;
    const flora = cannabisPlants.filter(p => ['floracao', 'pre_floracao', 'flush'].includes(p.stage)).length;

    return {
      activePlantsCount: active.length,
      entriesThisMonth: thisMonth,
      totalPhotos: photos,
      plantsNeedingCareCount: needing,
      cannabisVegaCount: vega,
      cannabisFloraCount: flora
    };
  }, [plants, diaryEntries, cannabisPlants]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* 1. Welcome Banner Adapted for User */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] font-mono">
              {formattedToday}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              {focusLabel}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hidden xs:inline">
              {growTypeLabel}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
            Olá, {userProfile.full_name || 'Cultivador'}!
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-lg leading-relaxed">
            Seu diário visual acompanha {activePlantsCount} plantas convencionais e {cannabisPlants.length} espécimes de cannabis com {totalPhotos} fotos documentadas.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsWelcomeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs transition-colors cursor-pointer min-h-[44px]"
            title="Abrir introdução e preferências"
          >
            <span className="text-amber-500">✨</span>
            <span>Tutorial</span>
          </button>

          <button
            onClick={() => onOpenNewDiary()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer min-h-[44px]"
          >
            <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Novo Registro</span>
          </button>
          
          <button
            onClick={() => onOpenNewEvent()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs transition-colors cursor-pointer min-h-[44px]"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            <span>Registrar Rega</span>
          </button>

          <button
            onClick={() => onOpenNewPlant()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs transition-colors cursor-pointer min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Nova Planta</span>
          </button>
        </div>
      </div>

      {/* 2. Weather & Botanical Alerts (Above-the-fold) */}
      <WeatherWidget />

      {/* 3. Quick Stats Grid with Memoized StatCards (Above-the-fold) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Plantas"
          value={activePlantsCount}
          sublabel="ativas na coleção"
          icon={Sprout}
          onClick={() => setActiveTab('plantas')}
        />

        <StatCard
          label="Mês Atual"
          value={entriesThisMonth}
          sublabel="registros no diário"
          icon={BookOpen}
          onClick={() => setActiveTab('diario')}
        />

        <StatCard
          label="Galeria"
          value={totalPhotos}
          sublabel="fotos documentadas"
          icon={ImageIcon}
          onClick={() => setActiveTab('diario')}
        />

        <StatCard
          label="Atenção"
          value={plantsNeedingCareCount}
          sublabel="> 14 dias sem notas"
          icon={AlertCircle}
          accentColor="text-amber-400"
          onClick={() => setActiveTab('insights')}
        />
      </div>

      {/* 4. Below-the-fold Modular Widgets with LazyWidgetContainer for Instantaneous Initial LCP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Recent Diary Logs Feed */}
        <div className="lg:col-span-2 space-y-6">
          <LazyWidgetContainer minHeight="360px">
            <UltimasAtualizacoesWidget
              onOpenNewDiary={onOpenNewDiary}
              onSelectPhoto={onSelectPhoto}
            />
          </LazyWidgetContainer>

          <LazyWidgetContainer minHeight="240px">
            <UltimasFotosWidget
              onSelectPhoto={onSelectPhoto}
            />
          </LazyWidgetContainer>
        </div>

        {/* Right Column (1 col): Care Events & Collection Attention */}
        <div className="space-y-6">
          <LazyWidgetContainer minHeight="280px">
            <ProximosEventosWidget
              onOpenNewEvent={onOpenNewEvent}
            />
          </LazyWidgetContainer>

          <LazyWidgetContainer minHeight="260px">
            <ResumoPlantasWidget
              onOpenNewPlant={onOpenNewPlant}
              onOpenNewDiary={onOpenNewDiary}
            />
          </LazyWidgetContainer>
        </div>

      </div>

    </div>
  );
});
DashboardView.displayName = 'DashboardView';
