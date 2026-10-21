import React, { useState, useMemo, useCallback, memo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  CannabisPlant, 
  CannabisGrowthStage, 
  CannabisStrainType, 
  CannabisPhotoperiod,
  CannabisMedium,
  CannabisFeedLog 
} from '../types/index.ts';
import { 
  Cannabis, 
  Plus, 
  Sun, 
  Moon, 
  Droplets, 
  Thermometer, 
  Activity, 
  Sliders, 
  Scissors, 
  Eye, 
  Check, 
  Calendar, 
  X, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';

interface CannabisViewProps {
  onSelectPhoto?: (url: string, caption?: string, plantName?: string) => void;
}

// Stage labels and colors in iOS theme
const STAGE_CONFIG: Record<CannabisGrowthStage, { label: string; color: string; badgeBg: string }> = {
  germinacao: { label: 'Germinação', color: 'text-emerald-300', badgeBg: 'bg-emerald-950/80 border-emerald-700/50' },
  plantula: { label: 'Plântula', color: 'text-teal-300', badgeBg: 'bg-teal-950/80 border-teal-700/50' },
  vegetativo: { label: 'Vegetativo (18/6)', color: 'text-green-300', badgeBg: 'bg-green-950/80 border-green-700/50' },
  pre_floracao: { label: 'Pré-Floração', color: 'text-amber-300', badgeBg: 'bg-amber-950/80 border-amber-700/50' },
  floracao: { label: 'Floração (12/12)', color: 'text-fuchsia-300', badgeBg: 'bg-fuchsia-950/80 border-fuchsia-700/50' },
  flush: { label: 'Flush (Lavagem)', color: 'text-cyan-300', badgeBg: 'bg-cyan-950/80 border-cyan-700/50' },
  secagem: { label: 'Secagem', color: 'text-orange-300', badgeBg: 'bg-orange-950/80 border-orange-700/50' },
  cura: { label: 'Cura & Maturação', color: 'text-purple-300', badgeBg: 'bg-purple-950/80 border-purple-700/50' }
};

// 1. Memoized Cannabis Plant Card (iOS Squircle Card)
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
    <div className="glass-card rounded-3xl overflow-hidden border border-emerald-900/40 hover:border-emerald-600/50 transition-all flex flex-col justify-between group shadow-xl">
      <div>
        {/* Cover Photo with iOS Badge Overlays */}
        <div 
          onClick={() => onSelectPhoto && plant.cover_photo_url && onSelectPhoto(plant.cover_photo_url, plant.strain, plant.name)}
          className="relative aspect-16/10 overflow-hidden bg-black cursor-pointer"
        >
          <img
            src={plant.cover_photo_url || 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80'}
            alt={plant.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="250"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Stage & Photoperiod Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${stageInfo.badgeBg} ${stageInfo.color}`}>
              {stageInfo.label}
            </span>
            <span className="px-2 py-1 rounded-xl text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md text-emerald-300 border border-white/10">
              {plant.photoperiod}
            </span>
          </div>

          {/* Strain Type Pill */}
          <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 text-[10px] font-semibold text-white capitalize">
            {plant.strain_type === 'ruderalis_auto' ? 'Autoflorescente' : plant.strain_type}
          </div>

          {/* Bottom Photo Gradient Info */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 drop-shadow font-mono">
            <span>Dia {totalDays} total</span>
            <span>{daysInStage}d nesta fase</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                {plant.name}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(plant)}
                  className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 transition-colors cursor-pointer"
                  title="Editar espécime"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja remover "${plant.name}" do seu cultivo?`)) {
                      onDelete(plant.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                  title="Excluir espécime"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <p className="text-xs text-emerald-400/80 italic font-serif">
              {plant.strain}
            </p>
          </div>

          {/* Vital Targets Matrix */}
          <div className="grid grid-cols-4 gap-2 text-center p-2.5 rounded-2xl bg-[#07140f] border border-emerald-900/50 text-[11px]">
            <div>
              <span className="text-[9px] text-emerald-400/60 uppercase block font-mono">pH Alvo</span>
              <span className="font-bold text-cyan-300 font-mono">{plant.target_ph || '6.2'}</span>
            </div>
            <div>
              <span className="text-[9px] text-emerald-400/60 uppercase block font-mono">EC Alvo</span>
              <span className="font-bold text-emerald-300 font-mono">{plant.target_ec || '1.4'}</span>
            </div>
            <div>
              <span className="text-[9px] text-emerald-400/60 uppercase block font-mono">Temp</span>
              <span className="font-bold text-amber-300 font-mono">{plant.target_temp || '24'}°C</span>
            </div>
            <div>
              <span className="text-[9px] text-emerald-400/60 uppercase block font-mono">Umidade</span>
              <span className="font-bold text-teal-300 font-mono">{plant.target_rh || '55'}%</span>
            </div>
          </div>

          {/* Substrate & Pot */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-emerald-300/80">
            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 capitalize">
              {plant.medium.replace('_', ' ')}
            </span>
            {plant.pot_size_liters && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40">
                Vaso {plant.pot_size_liters}L
              </span>
            )}
            {plant.trichome_status && (
              <span className="px-2 py-0.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-300">
                🔬 Tricomas: {plant.trichome_status.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Applied Training Badges */}
          {plant.training_techniques && plant.training_techniques.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {plant.training_techniques.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-700/40 text-emerald-300"
                >
                  ✂️ {tech}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {plant.notes && (
            <p className="text-xs text-emerald-200/80 line-clamp-2 leading-relaxed">
              {plant.notes}
            </p>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3.5 bg-[#05110c] border-t border-emerald-950 flex items-center justify-between text-xs">
        <span className="text-emerald-400/70 font-mono text-[11px]">
          {feedLogsCount} regas registradas
        </span>

        <button
          onClick={() => onOpenFeedLog(plant.id)}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-950 transition-transform active:scale-95 cursor-pointer"
        >
          <Droplets className="w-3.5 h-3.5 stroke-[2.5]" />
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
    deleteCannabisFeedLog,
    userProfile 
  } = useApp();

  const [activeStageFilter, setActiveStageFilter] = useState<'all' | CannabisGrowthStage>('all');
  const [activeSubTab, setActiveSubTab] = useState<'plants' | 'fertigation' | 'guide'>('plants');

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
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* 1. iOS-Style Sophisticated Hero Bar */}
      <div className="bg-gradient-to-r from-[#0d281e] via-[#091b14] to-[#06110d] p-5 sm:p-6 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative leaf background glow */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-700/50">
                <Cannabis className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Cultivo Especializado • Modo Avançado
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
              Módulo de Cannabis & Fotoperíodo
            </h1>
            <p className="text-xs text-emerald-300/80 mt-1 max-w-lg leading-relaxed">
              Controle científico de fases vegetativa e floral, equilíbrio de pH/EC, nutrição e tricomas no ponto exato de colheita.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingPlant(null);
                setIsNewPlantModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-xs shadow-md shadow-emerald-950 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 font-medium text-xs transition-colors cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Registrar Rega / pH</span>
            </button>
          </div>
        </div>

        {/* Vital Quick Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-emerald-900/50 text-xs">
          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/40 flex items-center gap-2.5">
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-400/60 block font-mono">Vega Recomendado</span>
              <span className="font-bold text-white">18h Luz / 6h Escuro</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/40 flex items-center gap-2.5">
            <Moon className="w-4 h-4 text-fuchsia-400 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-400/60 block font-mono">Flora Recomendada</span>
              <span className="font-bold text-white">12h Luz / 12h Escuro</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/40 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-400/60 block font-mono">Faixa Segura pH</span>
              <span className="font-bold text-white">5.8 a 6.5 (Solo/Coco)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/40 flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-400/60 block font-mono">Ponto de Colheita</span>
              <span className="font-bold text-white">70% Leitoso / 20% Âmbar</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Sub-tabs Segmented Control (iOS Style) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
        <div className="flex items-center gap-1.5 bg-[#07140f] p-1 rounded-2xl border border-emerald-900/50">
          <button
            onClick={() => setActiveSubTab('plants')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'plants'
                ? 'bg-emerald-600 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Cannabis className="w-3.5 h-3.5" />
            <span>Espécimes ({cannabisPlants.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fertigation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'fertigation'
                ? 'bg-emerald-600 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Regas & Nutrientes ({cannabisFeedLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'guide'
                ? 'bg-emerald-600 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Guia de Tricomas & LST</span>
          </button>
        </div>

        {/* Stage Filter Pills (when in plants subtab) */}
        {activeSubTab === 'plants' && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setActiveStageFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                activeStageFilter === 'all'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-emerald-950/40 text-emerald-400 hover:text-emerald-200'
              }`}
            >
              Todos ({cannabisPlants.length})
            </button>
            <button
              onClick={() => setActiveStageFilter('vegetativo')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                activeStageFilter === 'vegetativo'
                  ? 'bg-green-700 text-white font-bold'
                  : 'bg-emerald-950/40 text-emerald-400 hover:text-emerald-200'
              }`}
            >
              Vega ({cannabisPlants.filter(p => p.stage === 'vegetativo').length})
            </button>
            <button
              onClick={() => setActiveStageFilter('floracao')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                activeStageFilter === 'floracao'
                  ? 'bg-fuchsia-700 text-white font-bold'
                  : 'bg-emerald-950/40 text-emerald-400 hover:text-emerald-200'
              }`}
            >
              Flora ({cannabisPlants.filter(p => p.stage === 'floracao').length})
            </button>
          </div>
        )}
      </div>

      {/* 3. Main Content Views */}
      {activeSubTab === 'plants' && (
        filteredPlants.length === 0 ? (
          <div className="text-center py-16 px-4 bg-emerald-950/20 rounded-3xl border border-emerald-900/30 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">
              <Cannabis className="w-6 h-6" />
            </div>
            <p className="font-semibold text-sm text-emerald-200">Nenhum cultivo encontrado neste filtro</p>
            <p className="text-xs text-emerald-400/60 max-w-sm mx-auto">
              Adicione seu primeiro espécime de cannabis para acompanhar as semanas de floração e regas.
            </p>
            <button
              onClick={() => {
                setEditingPlant(null);
                setIsNewPlantModalOpen(true);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-emerald-950 font-bold text-xs hover:bg-emerald-500 cursor-pointer"
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

      {/* Subtab: Fertigation & Nutrients Log */}
      {activeSubTab === 'fertigation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-serif">
              Histórico de Fertirrigação & Balanço de pH
            </h3>
            <button
              onClick={() => {
                if (cannabisPlants.length > 0) {
                  setSelectedPlantForFeed(cannabisPlants[0].id);
                  setIsNewFeedModalOpen(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-emerald-950 font-bold text-xs hover:bg-emerald-500 cursor-pointer"
            >
              + Nova Fertirrigação
            </button>
          </div>

          {cannabisFeedLogs.length === 0 ? (
            <div className="p-8 text-center bg-emerald-950/20 rounded-2xl border border-emerald-900/30 text-xs text-emerald-400/70">
              Nenhum registro de fertirrigação adicionado ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {cannabisFeedLogs.map((log) => {
                const plant = cannabisPlants.find(p => p.id === log.plant_id);
                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-[#091712] border border-emerald-900/50 hover:border-emerald-700/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {plant?.name || 'Cultivo'}
                        </span>
                        <span className="text-[11px] text-emerald-400/70 font-mono">
                          • {log.date}
                        </span>
                      </div>
                      
                      {/* Nutrients Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {log.nutrients.map((n, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-800/40 text-[10px] text-emerald-300 font-mono"
                          >
                            {n.name}: {n.mlPerLiter} ml/L
                          </span>
                        ))}
                      </div>

                      {log.notes && (
                        <p className="text-[11px] text-emerald-300/80 italic mt-1">
                          "{log.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right font-mono text-[11px]">
                        <div>
                          <span className="text-emerald-400/60">pH Entrada: </span>
                          <strong className="text-cyan-300">{log.ph_in}</strong>
                          {log.ph_out && (
                            <span className="text-emerald-300/80"> → Runoff: {log.ph_out}</span>
                          )}
                        </div>
                        {log.ec_ppm && (
                          <div className="text-emerald-300">
                            EC: {log.ec_ppm} mS/cm • Vol: {log.water_liters}L
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => deleteCannabisFeedLog(log.id)}
                        className="p-1.5 rounded-lg text-rose-400/60 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Excluir registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-800/40 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="font-bold text-base text-white font-serif">
                  Identificação de Tricomas e o Ponto Ideal da Colheita
                </h3>
                <span className="text-xs text-emerald-400/70">
                  Avaliação sob lupa de aumento (30x - 60x) nos cálices florais
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-900/40 space-y-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold font-mono">
                  ⚪
                </div>
                <h4 className="font-bold text-sm text-white">1. Transparentes / Cristalinos</h4>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  Os canabinoides (THC/CBD) ainda estão em formação embrionária. Colher agora resulta em efeito fraco e sabor verde de clorofila.
                </p>
                <span className="text-[10px] font-bold text-amber-400 block font-mono">ESTÁGIO: IMATURO</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-2 shadow-lg shadow-emerald-950">
                <div className="w-8 h-8 rounded-full bg-emerald-400/30 border border-emerald-400 flex items-center justify-center text-emerald-300 text-xs font-bold font-mono">
                  🥛
                </div>
                <h4 className="font-bold text-sm text-white">2. Leitosos / Opacos (Pico de THC)</h4>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Glândulas cheias com teor máximo de THC. Proporciona efeito cerebral vívido, energético, eufórico e medicinal ativo.
                </p>
                <span className="text-[10px] font-bold text-emerald-400 block font-mono">ESTÁGIO: PONTO IDEAL MÁXIMO</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-amber-900/40 space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 text-xs font-bold font-mono">
                  🍯
                </div>
                <h4 className="font-bold text-sm text-white">3. Âmbares / Dourados (Sedativo)</h4>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  O THC começa a se degradar naturalmente em CBN. Efeito corporal pesado ("couch-lock"), excelente para insônia e relaxamento muscular.
                </p>
                <span className="text-[10px] font-bold text-amber-300 block font-mono">ESTÁGIO: TERAPÊUTICO SEDATIVO</span>
              </div>
            </div>
          </div>

          {/* LST & Training Guide */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-800/40 space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-base text-white font-serif">
                  Técnicas de Treinamento e Maximização de Canópea
                </h3>
                <span className="text-xs text-emerald-400/70">
                  Como distribuir a luz igualmente e multiplicar os topos principais
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-[#091712] border border-emerald-900/50 space-y-1.5">
                <span className="font-bold text-emerald-300 text-sm">LST (Low Stress Training)</span>
                <p className="text-emerald-200/80 leading-relaxed">
                  Amarras suaves com arame emborrachado curvando o caule principal horizontalmente. Quebra a dominância apical e faz todos os ramos laterais crescerem como topos centrais.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#091712] border border-emerald-900/50 space-y-1.5">
                <span className="font-bold text-emerald-300 text-sm">Topping (Poda Apical)</span>
                <p className="text-emerald-200/80 leading-relaxed">
                  Corte da ponta apical no 3º a 5º nó durante a fase vegetativa. Transforma 1 topo principal em 2 hastes dominantes simétricas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#091712] border border-emerald-900/50 space-y-1.5">
                <span className="font-bold text-emerald-300 text-sm">ScrOG (Screen of Green)</span>
                <p className="text-emerald-200/80 leading-relaxed">
                  Uso de rede horizontal com malha de 5x5cm. Conduz-se cada ramo sob os quadrados até criar uma mesa densa e nivelada de flores uniformes.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#091712] border border-emerald-900/50 space-y-1.5">
                <span className="font-bold text-emerald-300 text-sm">Desfolhação Estratégica</span>
                <p className="text-emerald-200/80 leading-relaxed">
                  Remoção seletiva de folhas-leque grandes que bloqueiam a luz dos topos inferiores no dia 21 da floração. Melhora o fluxo de ar e reduz mofo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: New / Edit Cannabis Plant */}
      {isNewPlantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0a1812] border border-emerald-600/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-5 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-emerald-950/40">
              <div className="flex items-center gap-2">
                <Cannabis className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {editingPlant ? 'Editar Espécime de Cannabis' : 'Cadastrar Novo Espécime de Cannabis'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewPlantModalOpen(false)}
                className="p-1 rounded-lg text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
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
                <label className="font-semibold text-emerald-200">Nome do Espécime *</label>
                <input
                  name="plantName"
                  required
                  defaultValue={editingPlant?.name || ''}
                  placeholder="Ex: GG#4 - Matriz 01"
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">Genética / Strain *</label>
                  <input
                    name="strain"
                    required
                    defaultValue={editingPlant?.strain || ''}
                    placeholder="Ex: Gorilla Glue, Haze..."
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">Tipo de Genética</label>
                  <select
                    name="strainType"
                    defaultValue={editingPlant?.strain_type || 'hibrida'}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="hibrida">Híbrida Equilibrada</option>
                    <option value="indica">Indica Dominante</option>
                    <option value="sativa">Sativa Dominante</option>
                    <option value="ruderalis_auto">Autoflorescente (Auto)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                <input
                  type="checkbox"
                  id="isAutoflower"
                  name="isAutoflower"
                  defaultChecked={editingPlant?.is_autoflower}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isAutoflower" className="text-emerald-200 cursor-pointer">
                  Esta planta é Autoflorescente (não depende de fotoperíodo 12/12)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">Estágio de Crescimento</label>
                  <select
                    name="stage"
                    defaultValue={editingPlant?.stage || 'vegetativo'}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                  <label className="font-semibold text-emerald-200">Fotoperíodo Atual</label>
                  <select
                    name="photoperiod"
                    defaultValue={editingPlant?.photoperiod || '18/6'}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                  <label className="font-semibold text-emerald-200">Meio / Substrato</label>
                  <select
                    name="medium"
                    defaultValue={editingPlant?.medium || 'solo_organico'}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-2 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="solo_organico">Solo Orgânico</option>
                    <option value="coco_perlita">Inerte (Coco/Perlita)</option>
                    <option value="hidroponia">DWC / Hidroponia</option>
                    <option value="mineral">Solo Mineral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">Vaso (Litros)</label>
                  <input
                    name="potSize"
                    type="number"
                    defaultValue={editingPlant?.pot_size_liters || 11}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">pH Alvo</label>
                  <input
                    name="targetPh"
                    type="number"
                    step="0.1"
                    defaultValue={editingPlant?.target_ph || 6.2}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">Data de Germinação</label>
                  <input
                    name="germDate"
                    type="date"
                    defaultValue={editingPlant?.germination_date || new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">Início da Fase Atual</label>
                  <input
                    name="stageDate"
                    type="date"
                    defaultValue={editingPlant?.stage_start_date || new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-emerald-200">URL da Foto de Capa (Opcional)</label>
                <input
                  name="coverPhoto"
                  defaultValue={editingPlant?.cover_photo_url || ''}
                  placeholder="https://..."
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-emerald-200">Anotações e Observações</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingPlant?.notes || ''}
                  placeholder="Lâmpada LED Quantum Board 240W, LST realizado no nó 4..."
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-900/60">
                <button
                  type="button"
                  onClick={() => setIsNewPlantModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  Salvar Espécime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: New Fertigation Log */}
      {isNewFeedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0a1812] border border-cyan-600/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-5 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-emerald-950/40">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Registrar Fertirrigação / Rega
                </h3>
              </div>
              <button
                onClick={() => setIsNewFeedModalOpen(false)}
                className="p-1 rounded-lg text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
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
                <label className="font-semibold text-emerald-200">Planta / Espécime</label>
                <select
                  value={selectedPlantForFeed}
                  onChange={(e) => setSelectedPlantForFeed(e.target.value)}
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {cannabisPlants.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.strain})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">Data</label>
                  <input
                    name="feedDate"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">Volume de Água (L)</label>
                  <input
                    name="waterVol"
                    type="number"
                    step="0.5"
                    defaultValue={2.5}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-cyan-300">pH Entrada *</label>
                  <input
                    name="phIn"
                    type="number"
                    step="0.1"
                    defaultValue={6.2}
                    required
                    className="w-full bg-[#07130e] border border-cyan-800/50 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">pH Runoff (Saída)</label>
                  <input
                    name="phOut"
                    type="number"
                    step="0.1"
                    placeholder="6.4"
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-emerald-200">EC (mS/cm)</label>
                  <input
                    name="ecPpm"
                    type="number"
                    step="0.1"
                    defaultValue={1.4}
                    className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-semibold text-emerald-200">Nutrientes Dosados (ml/Litro)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    name="nutrBase"
                    type="number"
                    step="0.5"
                    placeholder="Base NPK"
                    className="bg-[#07130e] border border-emerald-800/50 rounded-xl px-2 py-1.5 text-white text-xs placeholder-emerald-700 font-mono"
                  />
                  <input
                    name="nutrCalmag"
                    type="number"
                    step="0.5"
                    placeholder="CalMag"
                    className="bg-[#07130e] border border-emerald-800/50 rounded-xl px-2 py-1.5 text-white text-xs placeholder-emerald-700 font-mono"
                  />
                  <input
                    name="nutrBooster"
                    type="number"
                    step="0.5"
                    placeholder="Booster"
                    className="bg-[#07130e] border border-emerald-800/50 rounded-xl px-2 py-1.5 text-white text-xs placeholder-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-emerald-200">Observações de Rega</label>
                <input
                  name="feedNotes"
                  placeholder="Escorrimento de 15%, folhas bem túrgidas..."
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-900/60">
                <button
                  type="button"
                  onClick={() => setIsNewFeedModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-cyan-950 font-bold shadow-lg shadow-cyan-950 cursor-pointer"
                >
                  Salvar Fertirrigação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
