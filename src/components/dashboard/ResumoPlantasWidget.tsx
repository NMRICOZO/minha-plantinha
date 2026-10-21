import React, { memo, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { calculateDaysBetween } from '../../utils/plantCalculations.ts';
import { Plant } from '../../types/index.ts';
import { Sprout, AlertCircle, Plus, ChevronRight } from 'lucide-react';

interface ResumoPlantasWidgetProps {
  onOpenNewPlant: () => void;
  onOpenNewDiary: (plantId: string) => void;
}

// 1. Memoized Attention Plant Row Item
const AttentionPlantRow = memo(({
  plant,
  days,
  onSelectPlant,
  onOpenNewDiary
}: {
  plant: Plant;
  days: number;
  onSelectPlant: (id: string) => void;
  onOpenNewDiary: (id: string) => void;
}) => (
  <div className="p-2.5 rounded-xl bg-[#091610] border border-emerald-900/50 flex items-center justify-between text-xs">
    <div 
      onClick={() => onSelectPlant(plant.id)}
      className="flex items-center gap-2.5 cursor-pointer group min-w-0"
    >
      <div className="w-9 h-9 rounded-lg overflow-hidden bg-black shrink-0 border border-emerald-800/40 relative">
        <img 
          src={plant.cover_photo_url || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=120&q=80'} 
          alt={plant.name}
          loading="lazy"
          decoding="async"
          width="36"
          height="36"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
        />
      </div>
      <div className="min-w-0">
        <span className="font-bold text-white group-hover:text-emerald-300 transition-colors truncate block">
          {plant.name}
        </span>
        <span className="text-[10px] text-amber-400/90 font-mono block">
          {days} dias sem foto/nota
        </span>
      </div>
    </div>

    <button
      onClick={() => onOpenNewDiary(plant.id)}
      className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0 ml-2"
    >
      <Plus className="w-3 h-3" />
      <span>Registrar</span>
    </button>
  </div>
));
AttentionPlantRow.displayName = 'AttentionPlantRow';

export const ResumoPlantasWidget: React.FC<ResumoPlantasWidgetProps> = memo(({
  onOpenNewPlant,
  onOpenNewDiary
}) => {
  const { plants, diaryEntries, setActiveTab, setSelectedPlantId } = useApp();

  const handleSelectPlant = useCallback((id: string) => {
    setSelectedPlantId(id);
    setActiveTab('plantas');
  }, [setSelectedPlantId, setActiveTab]);

  // Memoize plant analysis to avoid recalculations on unrelated state updates
  const { activePlants, archivedPlants, plantsNeedingAttention } = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const active = plants.filter(p => p.status === 'active');
    const archived = plants.filter(p => p.status === 'archived');

    const needing = active.map(plant => {
      const pEntries = diaryEntries
        .filter(e => e.plant_id === plant.id)
        .sort((a, b) => b.entry_date.localeCompare(a.entry_date));
      const lastDate = pEntries[0]?.entry_date || plant.acquired_date;
      const days = Math.max(0, calculateDaysBetween(lastDate, todayStr));
      return {
        plant,
        days,
        lastDate
      };
    })
    .sort((a, b) => b.days - a.days)
    .filter(item => item.days >= 14);

    return {
      activePlants: active,
      archivedPlants: archived,
      plantsNeedingAttention: needing
    };
  }, [plants, diaryEntries]);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-900/40 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 flex items-center justify-center text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">Resumo da Coleção</h3>
            <span className="text-[11px] text-emerald-400/70 font-mono">
              {activePlants.length} ativas • {archivedPlants.length} arquivadas
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('plantas')}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer font-medium"
        >
          <span>Ver todas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Longest time without update section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-200 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Aguardando Atualização</span>
          </span>
          {plantsNeedingAttention.length > 0 && (
            <span className="text-[10px] text-amber-300 font-mono bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/40">
              {plantsNeedingAttention.length} precisam de atenção
            </span>
          )}
        </div>

        {plantsNeedingAttention.length === 0 ? (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300/80 flex items-center gap-2">
            <span>✨ Todas as suas plantas receberam atualizações no diário nas últimas 2 semanas!</span>
          </div>
        ) : (
          <div className="space-y-2">
            {plantsNeedingAttention.slice(0, 3).map(({ plant, days }) => (
              <AttentionPlantRow
                key={plant.id}
                plant={plant}
                days={days}
                onSelectPlant={handleSelectPlant}
                onOpenNewDiary={onOpenNewDiary}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Add */}
      <button
        onClick={onOpenNewPlant}
        className="w-full py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Cadastrar Nova Planta</span>
      </button>
    </div>
  );
});
ResumoPlantasWidget.displayName = 'ResumoPlantasWidget';
