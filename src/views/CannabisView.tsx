import React, { useState, useMemo, memo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  CannabisPlant, 
  CannabisGrowthStage, 
  CannabisFeedLog 
} from '../types/index.ts';
import { 
  Cannabis, 
  Plus, 
  Sun, 
  Moon, 
  Droplets, 
  Activity, 
  Scissors, 
  Eye, 
  Trash2, 
  Edit3, 
  Sparkles, 
  X, 
  Info,
  Dna,
  ShieldCheck
} from 'lucide-react';
import { GeneticsAssistantTab } from '../components/cannabis/GeneticsAssistantTab.tsx';

interface CannabisViewProps {
  onSelectPhoto?: (url: string, caption?: string, plantName?: string) => void;
}

// Stage labels and colors tailored to the botanical cannabis theme
const STAGE_CONFIG: Record<CannabisGrowthStage, { label: string; color: string; badgeBg: string }> = {
  germinacao: { label: 'Germinação', color: 'text-emerald-300', badgeBg: 'bg-emerald-950/90 border-emerald-700/60' },
  plantula: { label: 'Plântula', color: 'text-teal-300', badgeBg: 'bg-teal-950/90 border-teal-700/60' },
  vegetativo: { label: 'Vegetativo (18/6)', color: 'text-emerald-200', badgeBg: 'bg-[var(--bg-surface)] border-[var(--border-strong)]' },
  pre_floracao: { label: 'Pré-Floração', color: 'text-amber-300', badgeBg: 'bg-amber-950/90 border-amber-700/60' },
  floracao: { label: 'Floração (12/12)', color: 'text-amber-200', badgeBg: 'bg-amber-950/90 border-amber-600/60' },
  flush: { label: 'Flush (Lavagem)', color: 'text-teal-200', badgeBg: 'bg-teal-950/90 border-teal-700/60' },
  secagem: { label: 'Secagem', color: 'text-amber-300', badgeBg: 'bg-amber-950/90 border-amber-700/60' },
  cura: { label: 'Cura & Maturação', color: 'text-stone-200', badgeBg: 'bg-stone-900/90 border-stone-700/60' }
};

// 1. Memoized Cannabis Plant Card with Botanical Tokens
const CannabisPlantCard = memo(({
  plant,
  feedLogsCount,
  onOpenFeedLog,
  onEdit,
  onDelete,
  onSelectPhoto
}: {
  plant: CannabisPlant;
  feedLogsCount: number;
  onOpenFeedLog: (plantId: string) => void;
  onEdit: (plant: CannabisPlant) => void;
  onDelete: (id: string) => void;
  onSelectPhoto?: (url: string, caption?: string, plantName?: string) => void;
}) => {
  const stageInfo = STAGE_CONFIG[plant.stage] || STAGE_CONFIG.vegetativo;

  // Calculate days in current stage and total days since germination
  const daysInStage = useMemo(() => {
    const start = new Date(plant.stage_start_date).getTime();
    const now = new Date().getTime();
    return Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  }, [plant.stage_start_date]);

  const totalDays = useMemo(() => {
    const germ = new Date(plant.germination_date).getTime();
    const now = new Date().getTime();
    return Math.max(1, Math.floor((now - germ) / (1000 * 60 * 60 * 24)));
  }, [plant.germination_date]);

  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between group shadow-sm">
      <div>
        {/* Cover Photo with Badge Overlays */}
        <div 
          onClick={() => onSelectPhoto && plant.cover_photo_url && onSelectPhoto(plant.cover_photo_url, plant.strain, plant.name)}
          className="relative aspect-16/10 overflow-hidden bg-[var(--bg-secondary)] cursor-pointer"
        >
          <img
            src={plant.cover_photo_url || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'}
            alt=""
            loading="lazy"
            decoding="async"
            width="400"
            height="250"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
          />

          {/* Top Stage & Photoperiod Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/65 backdrop-blur-md border border-white/15 ${stageInfo.color}`}>
              {stageInfo.label}
            </span>
            <span className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/65 backdrop-blur-md text-[var(--text-secondary)] border border-white/15">
              {plant.photoperiod}
            </span>
          </div>

          {/* Strain Type Pill */}
          <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15 text-[10px] font-semibold text-[var(--text-secondary)] capitalize">
            {plant.strain_type === 'ruderalis_auto' ? 'Autoflorescente' : plant.strain_type}
          </div>

          {/* Bottom Photo Info Bar */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/95 drop-shadow font-mono">
            <span>Dia {totalDays} total</span>
            <span>{daysInStage}d nesta fase</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-hover)] transition-colors line-clamp-1 font-serif">
                {plant.name}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(plant)}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center justify-center transition-colors cursor-pointer"
                  title="Editar espécime"
                  aria-label={`Editar ${plant.name}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja remover "${plant.name}" do seu cultivo?`)) {
                      onDelete(plant.id);
                    }
                  }}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--bg-secondary)] hover:bg-rose-950/60 text-rose-300 border border-[var(--border-subtle)] flex items-center justify-center transition-colors cursor-pointer"
                  title="Excluir espécime"
                  aria-label={`Excluir ${plant.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-xs text-[var(--accent-hover)] italic font-serif">
              {plant.strain}
            </p>
          </div>

          {/* Vital Targets Matrix */}
          <div className="grid grid-cols-4 gap-2 text-center p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px]">
            <div>
              <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">pH Alvo</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">{plant.target_ph || '6.2'}</span>
            </div>
            <div>
              <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">EC Alvo</span>
              <span className="font-bold text-[var(--accent-hover)] font-mono">{plant.target_ec || '1.4'}</span>
            </div>
            <div>
              <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">Temp</span>
              <span className="font-bold text-[var(--accent-secondary)] font-mono">{plant.target_temp || '24'}°C</span>
            </div>
            <div>
              <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">Umidade</span>
              <span className="font-bold text-[var(--text-secondary)] font-mono">{plant.target_rh || '55'}%</span>
            </div>
          </div>

          {/* Substrate & Pot */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <span className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] capitalize">
              {plant.medium.replace('_', ' ')}
            </span>
            {plant.pot_size_liters && (
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                Vaso {plant.pot_size_liters}L
              </span>
            )}
            {plant.trichome_status && (
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--accent-secondary)]/40 text-[var(--accent-secondary)] font-mono">
                Tricomas: {plant.trichome_status.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Applied Training Badges */}
          {plant.training_techniques && plant.training_techniques.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {plant.training_techniques.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                >
                  ✂️ {tech}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {plant.notes && (
            <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
              {plant.notes}
            </p>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3.5 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs gap-2">
        <span className="text-[var(--text-muted)] font-mono text-[11px]">
          {feedLogsCount} regas
        </span>

        <button
          onClick={() => onOpenFeedLog(plant.id)}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Droplets className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Rega / pH</span>
        </button>
      </div>

    </div>
  );
});
CannabisPlantCard.displayName = 'CannabisPlantCard';

export const CannabisView: React.FC<CannabisViewProps> = ({ onSelectPhoto }) => {
  const { 
    cannabisPlants, 
    cannabisFeedLogs, 
    addCannabisPlant, 
    updateCannabisPlant, 
    deleteCannabisPlant, 
    addCannabisFeedLog, 
    deleteCannabisFeedLog 
  } = useApp();

  const [activeStageFilter, setActiveStageFilter] = useState<'all' | CannabisGrowthStage>('all');
  const [activeSubTab, setActiveSubTab] = useState<'plants' | 'genetics' | 'fertigation' | 'guide'>('plants');

  // Modals state
  const [isNewPlantModalOpen, setIsNewPlantModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<CannabisPlant | null>(null);

  const [isNewFeedModalOpen, setIsNewFeedModalOpen] = useState(false);
  const [selectedPlantForFeed, setSelectedPlantForFeed] = useState<string>(
    cannabisPlants[0]?.id || ''
  );

  // Filtered Plants with useMemo
  const filteredPlants = useMemo(() => {
    if (activeStageFilter === 'all') return cannabisPlants;
    return cannabisPlants.filter(p => p.stage === activeStageFilter);
  }, [cannabisPlants, activeStageFilter]);

  // Feed logs map per plant
  const feedLogsCountMap = useMemo(() => {
    const map = new Map<string, number>();
    cannabisPlants.forEach(p => map.set(p.id, 0));
    cannabisFeedLogs.forEach(f => {
      map.set(f.plant_id, (map.get(f.plant_id) || 0) + 1);
    });
    return map;
  }, [cannabisPlants, cannabisFeedLogs]);

  // Handle Plant Form Submit
  const handleSavePlant = (formData: any) => {
    if (editingPlant) {
      updateCannabisPlant(editingPlant.id, formData);
    } else {
      addCannabisPlant(formData);
    }
    setIsNewPlantModalOpen(false);
    setEditingPlant(null);
  };

  // Handle Feed Log Form Submit
  const handleSaveFeed = (feedData: any) => {
    addCannabisFeedLog({
      ...feedData,
      plant_id: selectedPlantForFeed || cannabisPlants[0]?.id
    });
    setIsNewFeedModalOpen(false);
  };

  return (
    <div 
      data-theme="cannabis" 
      data-tema="cannabis" 
      className="space-y-6 max-w-6xl mx-auto pb-12 transition-colors duration-200"
    >
      
      {/* 1. Discrete Informative Notice Banner (Notice sóbrio e informativo) */}
      <section 
        aria-label="Aviso informativo do módulo"
        className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3.5 sm:p-4 flex items-start gap-3 shadow-sm"
      >
        <div className="w-8 h-8 rounded-xl bg-[var(--accent-secondary)]/15 border border-[var(--accent-secondary)]/30 text-[var(--accent-secondary)] flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Módulo Técnico de Cultivo Pessoal e Medicinal
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)] font-bold">
              Uso Agronômico
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
            Registro técnico para monitoramento fitossanitário de fotoperíodo, balanço de pH/EC e maturação de tricomas. Diretrizes agronômicas voltadas ao manejo botânico de precisão.
          </p>
        </div>
      </section>

      {/* 2. Hero Bar — Agronomic & Botanical Precision */}
      <div className="bg-[var(--bg-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--accent-hover)] border border-[var(--border-subtle)]">
                <Cannabis className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-hover)] font-mono">
                Cultivo Especializado • Controle Fitotécnico
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
              Módulo de Cannabis & Fotoperíodo
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl leading-relaxed">
              Acompanhamento de fases vegetativa e floral, equilíbrio de pH/EC, nutrição e tricomas no ponto exato de colheita.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveSubTab('genetics')}
              className="min-h-[44px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Assistente de Genética</span>
            </button>

            <button
              onClick={() => {
                setEditingPlant(null);
                setIsNewPlantModalOpen(true);
              }}
              className="min-h-[44px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Novo Espécime</span>
            </button>

            <button
              onClick={() => {
                if (cannabisPlants.length > 0) {
                  setSelectedPlantForFeed(cannabisPlants[0].id);
                  setIsNewFeedModalOpen(true);
                } else {
                  alert('Cadastre um espécime antes de registrar a fertirrigação.');
                }
              }}
              className="min-h-[44px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium text-xs transition-colors cursor-pointer"
            >
              <Droplets className="w-4 h-4 text-[var(--accent-hover)]" />
              <span>Registrar Rega / pH</span>
            </button>
          </div>
        </div>

        {/* Vital Quick Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-[var(--border-subtle)] text-xs">
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-2.5">
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block font-mono">Vega Recomendado</span>
              <span className="font-bold text-[var(--text-primary)]">18h Luz / 6h Escuro</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-2.5">
            <Moon className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block font-mono">Flora Recomendada</span>
              <span className="font-bold text-[var(--text-primary)]">12h Luz / 12h Escuro</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block font-mono">Faixa Segura pH</span>
              <span className="font-bold text-[var(--text-primary)]">5.8 a 6.5 (Solo/Coco)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-[var(--accent-secondary)] shrink-0" />
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block font-mono">Ponto de Colheita</span>
              <span className="font-bold text-[var(--text-primary)]">70% Leitoso / 20% Âmbar</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Sub-tabs Segmented Control */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] p-1.5 rounded-xl border border-[var(--border-subtle)] overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('plants')}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeSubTab === 'plants'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Cannabis className="w-4 h-4" />
            <span>Espécimes ({cannabisPlants.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('genetics')}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'genetics'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>Assistente de Genética</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fertigation')}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeSubTab === 'fertigation'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Regas & Nutrientes ({cannabisFeedLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeSubTab === 'guide'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Guia de Tricomas & LST</span>
          </button>
        </div>

        {/* Stage Filter Pills (when in plants subtab) */}
        {activeSubTab === 'plants' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setActiveStageFilter('all')}
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors inline-flex items-center justify-center ${
                activeStageFilter === 'all'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              Todos ({cannabisPlants.length})
            </button>
            <button
              onClick={() => setActiveStageFilter('vegetativo')}
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors inline-flex items-center justify-center ${
                activeStageFilter === 'vegetativo'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              Vega ({cannabisPlants.filter(p => p.stage === 'vegetativo').length})
            </button>
            <button
              onClick={() => setActiveStageFilter('floracao')}
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors inline-flex items-center justify-center ${
                activeStageFilter === 'floracao'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              Flora ({cannabisPlants.filter(p => p.stage === 'floracao').length})
            </button>
          </div>
        )}
      </div>

      {/* 4. Main Content Views */}
      {activeSubTab === 'plants' && (
        filteredPlants.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-hover)]">
              <Cannabis className="w-6 h-6" />
            </div>
            <p className="font-semibold text-sm text-[var(--text-primary)] font-serif">Nenhum cultivo encontrado neste filtro</p>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Adicione seu primeiro espécime de cannabis para acompanhar as semanas de floração, fotoperíodo e regas.
            </p>
            <button
              onClick={() => {
                setEditingPlant(null);
                setIsNewPlantModalOpen(true);
              }}
              className="mt-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              Cadastrar Espécime
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlants.map((plant) => (
              <CannabisPlantCard
                key={plant.id}
                plant={plant}
                feedLogsCount={feedLogsCountMap.get(plant.id) || 0}
                onOpenFeedLog={(pId) => {
                  setSelectedPlantForFeed(pId);
                  setIsNewFeedModalOpen(true);
                }}
                onEdit={(p) => {
                  setEditingPlant(p);
                  setIsNewPlantModalOpen(true);
                }}
                onDelete={deleteCannabisPlant}
                onSelectPhoto={onSelectPhoto}
              />
            ))}
          </div>
        )
      )}

      {/* Subtab: Assistente de Genética */}
      {activeSubTab === 'genetics' && (
        <GeneticsAssistantTab
          plants={cannabisPlants}
          onUpdatePlantTargets={(plantId, targets) => updateCannabisPlant(plantId, {
            target_ph: targets.ph,
            target_ec: targets.ec,
            target_temp: targets.temp,
            target_rh: targets.rh
          })}
        />
      )}

      {/* Subtab: Fertigation & Nutrients Log */}
      {activeSubTab === 'fertigation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-primary)] font-serif">
              Histórico de Fertirrigação & Balanço de pH
            </h3>
            <button
              onClick={() => {
                if (cannabisPlants.length > 0) {
                  setSelectedPlantForFeed(cannabisPlants[0].id);
                  setIsNewFeedModalOpen(true);
                }
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs hover:bg-[var(--accent-hover)] cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Fertirrigação</span>
            </button>
          </div>

          {cannabisFeedLogs.length === 0 ? (
            <div className="p-8 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              Nenhum registro de fertirrigação adicionado ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {cannabisFeedLogs.map((log) => {
                const plant = cannabisPlants.find(p => p.id === log.plant_id);
                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--text-primary)] text-sm font-serif">
                          {plant?.name || 'Cultivo'}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] font-mono">
                          • {log.date}
                        </span>
                      </div>
                      
                      {/* Nutrients Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {log.nutrients.map((n, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] font-mono"
                          >
                            {n.name}: {n.mlPerLiter} ml/L
                          </span>
                        ))}
                      </div>

                      {log.notes && (
                        <p className="text-[11px] text-[var(--text-muted)] italic mt-1">
                          "{log.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right font-mono text-[11px]">
                        <div>
                          <span className="text-[var(--text-muted)]">pH Entrada: </span>
                          <strong className="text-[var(--text-primary)]">{log.ph_in}</strong>
                          {log.ph_out && (
                            <span className="text-[var(--text-secondary)]"> → Runoff: {log.ph_out}</span>
                          )}
                        </div>
                        {log.ec_ppm && (
                          <div className="text-[var(--accent-hover)]">
                            EC: {log.ec_ppm} mS/cm • Vol: {log.water_liters}L
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => deleteCannabisFeedLog(log.id)}
                        className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Excluir registro"
                        aria-label="Excluir registro de fertirrigação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Subtab: Trichome & LST Visual Guide */}
      {activeSubTab === 'guide' && (
        <div className="space-y-6">
          {/* Trichome Chart */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[var(--accent-secondary)]" />
              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)] font-serif">
                  Identificação de Tricomas e o Ponto Ideal da Colheita
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  Avaliação sob lente de aumento (30x - 60x) nos cálices florais
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold font-mono">
                  ⚪
                </div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">1. Transparentes / Cristalinos</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Os canabinoides ainda estão em formação embrionária. Colher agora resulta em efeito fraco e sabor residual de clorofila.
                </p>
                <span className="text-[10px] font-bold text-amber-400 block font-mono">ESTÁGIO: IMATURO</span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-strong)] space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)] flex items-center justify-center text-[var(--accent-hover)] text-xs font-bold font-mono">
                  🥛
                </div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">2. Leitosos / Opacos (Pico de Canabinoides)</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Glândulas densas com teor máximo de princípios ativos. Proporciona efeito claro, vívido e máxima expressão terapêutica.
                </p>
                <span className="text-[10px] font-bold text-[var(--accent-hover)] block font-mono">ESTÁGIO: PONTO IDEAL MÁXIMO</span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-amber-900/40 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-300 text-xs font-bold font-mono">
                  🍯
                </div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">3. Âmbares / Dourados (Sedativo)</h4>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  O THC se degrada naturalmente em CBN. Efeito corporal calmante e sedativo, propício para indução de sono e relaxamento muscular profundo.
                </p>
                <span className="text-[10px] font-bold text-amber-300 block font-mono">ESTÁGIO: TERAPÊUTICO SEDATIVO</span>
              </div>
            </div>
          </div>

          {/* LST & Training Guide */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[var(--accent-hover)]" />
              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)] font-serif">
                  Técnicas de Manejo e Distribuição da Canópea
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  Como distribuir a luz igualmente e multiplicar os topos principais
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-bold text-[var(--accent-hover)] text-sm">LST (Low Stress Training)</span>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Amarras suaves curvando o caule principal horizontalmente. Quebra a dominância apical e faz todos os ramos laterais crescerem uniformemente.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-bold text-[var(--accent-hover)] text-sm">Topping (Poda Apical)</span>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Corte da gema apical no 3º a 5º nó durante a fase vegetativa. Transforma 1 topo principal em 2 hastes dominantes simétricas.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-bold text-[var(--accent-hover)] text-sm">ScrOG (Screen of Green)</span>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Uso de rede horizontal com malha de 5x5cm. Conduz-se cada ramo sob os quadrados até criar uma mesa densa e nivelada de flores uniformes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-bold text-[var(--accent-hover)] text-sm">Desfolhação Estratégica</span>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Remoção seletiva de folhas-leque que bloqueiam a luz dos topos inferiores no dia 21 da floração. Melhora o fluxo de ar e reduz umidade excessiva.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: New / Edit Cannabis Plant */}
      {isNewPlantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-2">
                <Cannabis className="w-5 h-5 text-[var(--accent-hover)]" />
                <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] font-serif">
                  {editingPlant ? 'Editar Espécime' : 'Cadastrar Novo Espécime'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewPlantModalOpen(false)}
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = {
                  name: form.plantName.value,
                  strain: form.strain.value,
                  strain_type: form.strainType.value,
                  is_autoflower: form.isAutoflower.checked,
                  stage: form.stage.value,
                  photoperiod: form.photoperiod.value,
                  medium: form.medium.value,
                  pot_size_liters: Number(form.potSize.value) || 11,
                  target_ph: Number(form.targetPh.value) || 6.2,
                  target_ec: Number(form.targetEc.value) || 1.4,
                  cover_photo_url: form.coverPhoto.value || 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80',
                  notes: form.notes.value,
                  germination_date: form.germDate.value || new Date().toISOString().split('T')[0],
                  stage_start_date: form.stageDate.value || new Date().toISOString().split('T')[0]
                };
                handleSavePlant(data);
              }}
              className="p-5 overflow-y-auto space-y-4 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-[var(--text-primary)]">Nome do Espécime *</label>
                <input
                  name="plantName"
                  required
                  defaultValue={editingPlant?.name || ''}
                  placeholder="Ex: Gorilla Glue #4 - Matriz 01"
                  className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Genética / Strain *</label>
                  <input
                    name="strain"
                    required
                    defaultValue={editingPlant?.strain || ''}
                    placeholder="Ex: GG#4, OG Kush..."
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Tipo de Genética</label>
                  <select
                    name="strainType"
                    defaultValue={editingPlant?.strain_type || 'hibrida'}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  >
                    <option value="hibrida">Híbrida Equilibrada</option>
                    <option value="indica">Indica Dominante</option>
                    <option value="sativa">Sativa Dominante</option>
                    <option value="ruderalis_auto">Autoflorescente (Auto)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] min-h-[44px]">
                <input
                  type="checkbox"
                  id="isAutoflower"
                  name="isAutoflower"
                  defaultChecked={editingPlant?.is_autoflower}
                  className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isAutoflower" className="text-[var(--text-primary)] cursor-pointer">
                  Esta planta é Autoflorescente (não depende de fotoperíodo 12/12)
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Estágio de Crescimento</label>
                  <select
                    name="stage"
                    defaultValue={editingPlant?.stage || 'vegetativo'}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  >
                    <option value="germinacao">Germinação</option>
                    <option value="plantula">Plântula (Seedling)</option>
                    <option value="vegetativo">Vegetativo (18/6)</option>
                    <option value="pre_floracao">Pré-Floração</option>
                    <option value="floracao">Floração (12/12)</option>
                    <option value="flush">Flush (Lavagem final)</option>
                    <option value="secagem">Secagem</option>
                    <option value="cura">Cura & Armazenamento</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Fotoperíodo Atual</label>
                  <select
                    name="photoperiod"
                    defaultValue={editingPlant?.photoperiod || '18/6'}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  >
                    <option value="18/6">18h Luz / 6h Escuro (Vegetativo)</option>
                    <option value="12/12">12h Luz / 12h Escuro (Floração)</option>
                    <option value="20/4">20h Luz / 4h Escuro (Auto)</option>
                    <option value="24/0">24h Luz Contínua</option>
                    <option value="sol_natural">Luz Natural / Outdoor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Meio</label>
                  <select
                    name="medium"
                    defaultValue={editingPlant?.medium || 'solo_organico'}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-2 py-2 text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent-primary)]"
                  >
                    <option value="solo_organico">Solo Orgânico</option>
                    <option value="coco_perlita">Inerte (Coco/Perlita)</option>
                    <option value="hidroponia">DWC / Hidroponia</option>
                    <option value="mineral">Solo Mineral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Vaso (L)</label>
                  <input
                    name="potSize"
                    type="number"
                    defaultValue={editingPlant?.pot_size_liters || 11}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">pH Alvo</label>
                  <input
                    name="targetPh"
                    type="number"
                    step="0.1"
                    defaultValue={editingPlant?.target_ph || 6.2}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Data de Germinação</label>
                  <input
                    name="germDate"
                    type="date"
                    defaultValue={editingPlant?.germination_date || new Date().toISOString().split('T')[0]}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Início da Fase Atual</label>
                  <input
                    name="stageDate"
                    type="date"
                    defaultValue={editingPlant?.stage_start_date || new Date().toISOString().split('T')[0]}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[var(--text-primary)]">URL da Foto de Capa (Opcional)</label>
                <input
                  name="coverPhoto"
                  defaultValue={editingPlant?.cover_photo_url || ''}
                  placeholder="https://..."
                  className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[var(--text-primary)]">Anotações e Observações</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingPlant?.notes || ''}
                  placeholder="Iluminação LED Quantum Board, LST aplicado no 4º nó..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsNewPlantModalOpen(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold shadow-sm cursor-pointer"
                >
                  Salvar Espécime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: New Fertigation Log */}
      {isNewFeedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-[var(--accent-hover)]" />
                <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] font-serif">
                  Registrar Fertirrigação / Rega
                </h3>
              </div>
              <button
                onClick={() => setIsNewFeedModalOpen(false)}
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const nutrients: any[] = [];
                if (form.nutrBase.value) nutrients.push({ name: 'Base NPK', mlPerLiter: Number(form.nutrBase.value) });
                if (form.nutrCalmag.value) nutrients.push({ name: 'CalMag', mlPerLiter: Number(form.nutrCalmag.value) });
                if (form.nutrBooster.value) nutrients.push({ name: 'Estimulante / PK', mlPerLiter: Number(form.nutrBooster.value) });

                handleSaveFeed({
                  date: form.feedDate.value || new Date().toISOString().split('T')[0],
                  water_liters: Number(form.waterVol.value) || 2.0,
                  ph_in: Number(form.phIn.value) || 6.2,
                  ph_out: form.phOut.value ? Number(form.phOut.value) : undefined,
                  ec_ppm: form.ecPpm.value ? Number(form.ecPpm.value) : undefined,
                  nutrients,
                  notes: form.feedNotes.value
                });
              }}
              className="p-5 overflow-y-auto space-y-3.5 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-[var(--text-primary)]">Planta / Espécime</label>
                <select
                  value={selectedPlantForFeed}
                  onChange={(e) => setSelectedPlantForFeed(e.target.value)}
                  className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  {cannabisPlants.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.strain})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Data</label>
                  <input
                    name="feedDate"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">Volume de Água (L)</label>
                  <input
                    name="waterVol"
                    type="number"
                    step="0.5"
                    defaultValue={2.5}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">pH Entrada *</label>
                  <input
                    name="phIn"
                    type="number"
                    step="0.1"
                    defaultValue={6.2}
                    required
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">pH Runoff</label>
                  <input
                    name="phOut"
                    type="number"
                    step="0.1"
                    placeholder="6.4"
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-primary)]">EC (mS/cm)</label>
                  <input
                    name="ecPpm"
                    type="number"
                    step="0.1"
                    defaultValue={1.4}
                    className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-semibold text-[var(--text-primary)]">Nutrientes Dosados (ml/Litro)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    name="nutrBase"
                    type="number"
                    step="0.5"
                    placeholder="Base NPK"
                    className="min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-2 py-1.5 text-[var(--text-primary)] text-xs placeholder-[var(--text-muted)] font-mono"
                  />
                  <input
                    name="nutrCalmag"
                    type="number"
                    step="0.5"
                    placeholder="CalMag"
                    className="min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-2 py-1.5 text-[var(--text-primary)] text-xs placeholder-[var(--text-muted)] font-mono"
                  />
                  <input
                    name="nutrBooster"
                    type="number"
                    step="0.5"
                    placeholder="Booster"
                    className="min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-2 py-1.5 text-[var(--text-primary)] text-xs placeholder-[var(--text-muted)] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[var(--text-primary)]">Observações de Rega</label>
                <input
                  name="feedNotes"
                  placeholder="Escorrimento de 15%, folhas bem túrgidas..."
                  className="w-full min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsNewFeedModalOpen(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold shadow-sm cursor-pointer"
                >
                  Salvar Fertirrigação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Rodapé Discreto Informativo */}
      <footer className="mt-8 pt-4 border-t border-[var(--border-subtle)] text-center text-[11px] text-[var(--text-muted)] font-mono">
        Cultivo sujeito à legislação local. No Brasil, exige autorização judicial ou associação autorizada. Informações estritamente agronômicas e de redução de danos botânicos.
      </footer>

    </div>
  );
};
