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
  <div className="p-2.5 rounded-xl bg-[#141311] border border-[#c2593f]/25 flex items-center justify-between text-xs">
    <div 
      onClick={() => onSelectPlant(plant.id)}
      className="flex items-center gap-2.5 cursor-pointer group min-w-0"
    >
      <div className="w-9 h-9 rounded-lg overflow-hidden bg-black shrink-0 border border-[#c2593f]/40 relative">
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
        <span className="font-bold text-white group-hover:text-[#f09b82] transition-colors truncate block">
          {plant.name}
        </span>
        <span className="text-[10px] text-amber-300 font-mono block">
          {days} dias sem foto/nota
        </span>
      </div>
    </div>

    <button
      onClick={() => onOpenNewDiary(plant.id)}
      aria-label={`Registrar diário para ${plant.name}`}
      className="px-2.5 py-1 rounded-lg bg-[#24221d] hover:bg-[#343029] text-[#f09b82] border border-[#c2593f]/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0 ml-2"
    >
      <Plus className="w-3 h-3 text-[#de7355]" />
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
    <div className="horta-card rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#3d1810]/70 border border-[#c2593f]/30 flex items-center justify-center text-[#f09b82]">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white font-serif">Resumo da Coleção</h3>
            <span className="text-[11px] text-[#e7dfd5]/80 font-mono">
              {activePlants.length} ativas • {archivedPlants.length} arquivadas
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('plantas')}
          className="text-xs text-[#de7355] hover:text-[#f09b82] flex items-center gap-0.5 cursor-pointer font-medium transition-colors"
        >
          <span>Ver todas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Longest time without update section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#faf8f5] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Aguardando Atualização</span>
          </span>
          {plantsNeedingAttention.length > 0 && (
            <span className="text-[10px] text-amber-300 font-mono bg-[#3d1810]/70 px-2 py-0.5 rounded-full border border-[#c2593f]/40">
              {plantsNeedingAttention.length} precisam de atenção
            </span>
          )}
        </div>

        {plantsNeedingAttention.length === 0 ? (
          <div className="p-3 rounded-xl bg-[#141311] border border-[#c2593f]/20 text-xs text-[#e7dfd5]/80 flex items-center gap-2">
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
        className="w-full py-2.5 rounded-xl bg-[#24221d] hover:bg-[#343029] text-[#faf8f5] border border-[#c2593f]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-[#de7355]" />
        <span>Cadastrar Nova Planta</span>
      </button>
    </div>
  );
});
ResumoPlantasWidget.displayName = 'ResumoPlantasWidget';
