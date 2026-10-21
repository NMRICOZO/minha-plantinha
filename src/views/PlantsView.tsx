import React, { useState, useMemo, useCallback, memo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Plant, PlantStatus } from '../types/index.ts';
import { calculatePlantAge, calculateLastActionDays } from '../utils/plantCalculations.ts';
import { PlantTimeline } from '../components/PlantTimeline.tsx';
import { PhotoComparisonSlider } from '../components/PhotoComparisonSlider.tsx';
import { 
  Plus, 
  Search, 
  Sprout, 
  Calendar, 
  Split, 
  ArrowLeft, 
  Droplets, 
  Sun, 
  MapPin, 
  Edit3, 
  Trash2, 
  History,
  Archive,
  CheckCircle2
} from 'lucide-react';

// Memoized Plant Card for Collection Grid
const PlantCard = memo(({
  plant,
  entryCount,
  photoCount,
  onSelect
}: {
  plant: Plant;
  entryCount: number;
  photoCount: number;
  onSelect: (id: string) => void;
}) => {
  const age = useMemo(() => calculatePlantAge(plant.acquired_date), [plant.acquired_date]);

  return (
    <div
      onClick={() => onSelect(plant.id)}
      className="glass-card rounded-2xl overflow-hidden border border-emerald-900/40 hover:border-emerald-600/50 transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Card Cover Photo */}
        <div className="relative aspect-16/10 overflow-hidden bg-black">
          <img
            src={plant.cover_photo_url || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'}
            alt={plant.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="250"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Age Badge */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[11px] font-mono text-emerald-300">
            {age.formatted}
          </div>

          {/* Status Pill */}
          {plant.status !== 'active' && (
            <div className="absolute top-3 right-3 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-700/50 text-[10px] text-amber-200 capitalize">
              {plant.status}
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-2.5">
          <div>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
              {plant.name}
            </h3>
            {plant.species && (
              <p className="text-xs text-emerald-400/70 italic font-serif line-clamp-1">
                {plant.species}
              </p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-300/80">
            {plant.location && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/40 capitalize">
                {plant.location}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/40 flex items-center gap-1">
              <Droplets className="w-2.5 h-2.5 text-cyan-400" />
              {plant.watering_frequency_days ? `${plant.watering_frequency_days}d` : 'Rega'}
            </span>
          </div>

          {plant.notes && (
            <p className="text-xs text-emerald-300/60 line-clamp-2 leading-relaxed">
              {plant.notes}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 bg-[#07140f] border-t border-emerald-950 flex items-center justify-between text-xs text-emerald-400/70 font-mono">
        <span>{photoCount} fotos • {entryCount} notas</span>
        <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-xs font-semibold">
          Ver Timeline →
        </span>
      </div>
    </div>
  );
});
PlantCard.displayName = 'PlantCard';

interface PlantsViewProps {
  onOpenNewPlant: (editPlant?: Plant) => void;
  onOpenNewDiary: (plantId?: string) => void;
  onOpenNewEvent: (plantId?: string) => void;
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
}

export const PlantsView: React.FC<PlantsViewProps> = ({
  onOpenNewPlant,
  onOpenNewDiary,
  onOpenNewEvent,
  onSelectPhoto
}) => {
  const { 
    plants, 
    diaryEntries, 
    plantEvents, 
    selectedPlantId, 
    setSelectedPlantId, 
    deletePlant,
    comparisonPhotoA,
    comparisonPhotoB
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PlantStatus>('active');
  const [detailTab, setDetailTab] = useState<'timeline' | 'compare' | 'history'>('timeline');

  // If a plant is selected, render individual detail view
  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  if (selectedPlant) {
    const age = calculatePlantAge(selectedPlant.acquired_date);
    const plantEntries = diaryEntries.filter(e => e.plant_id === selectedPlant.id);
    const plantPhotos = plantEntries.flatMap(e => e.photos || []);
    const { daysSinceLastEvent, daysSinceLastDiary } = calculateLastActionDays(
      selectedPlant.id, 
      plantEvents, 
      diaryEntries, 
      'rega'
    );

    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
        
        {/* Top Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPlantId(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Plantas</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenNewPlant(selectedPlant)}
              className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 text-xs transition-colors cursor-pointer"
              title="Editar dados da planta"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Tem certeza que deseja excluir "${selectedPlant.name}" e todo seu histórico?`)) {
                  deletePlant(selectedPlant.id);
                }
              }}
              className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs transition-colors cursor-pointer"
              title="Excluir planta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Plant Hero Header */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-emerald-800/40 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            
            {/* Cover photo */}
            <div 
              onClick={() => onSelectPhoto(selectedPlant.cover_photo_url || '', selectedPlant.name, selectedPlant.name)}
              className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden bg-black shrink-0 relative group cursor-pointer border border-emerald-700/50 shadow-xl"
            >
              <img
                src={selectedPlant.cover_photo_url || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'}
                alt={selectedPlant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white">
                Ampliar Capa
              </div>
            </div>

            {/* Botanical Meta */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
                    {selectedPlant.name}
                  </h1>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                    {age.formatted}
                  </span>
                </div>
                {selectedPlant.species && (
                  <p className="text-xs text-emerald-400/80 italic font-serif">
                    {selectedPlant.species}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedPlant.location && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-200 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span className="capitalize">{selectedPlant.location}</span>
                  </span>
                )}
                {selectedPlant.light_level && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-200 flex items-center gap-1.5">
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Luz: {selectedPlant.light_level.replace('_', ' ')}</span>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-200 flex items-center gap-1.5">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  <span>Rega: {selectedPlant.watering_frequency_days ? `a cada ${selectedPlant.watering_frequency_days}d` : 'Sob demanda'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-200 flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>Chegada: {selectedPlant.acquired_date}</span>
                </span>
              </div>

              {/* Notes */}
              {selectedPlant.notes && (
                <p className="text-xs text-emerald-200/80 bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50 leading-relaxed">
                  {selectedPlant.notes}
                </p>
              )}

              {/* Summary Indicators */}
              <div className="flex items-center gap-4 text-xs text-emerald-400/80 pt-1 font-mono">
                <span>{plantEntries.length} registros no diário</span>
                <span>•</span>
                <span>{plantPhotos.length} fotos</span>
                <span>•</span>
                <span>Última rega: {daysSinceLastEvent !== null ? `${daysSinceLastEvent}d atrás` : 'Sem registro'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-1">
          <button
            onClick={() => setDetailTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              detailTab === 'timeline'
                ? 'bg-emerald-600 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Linha do Tempo Visual ({plantEntries.length})</span>
          </button>

          <button
            onClick={() => setDetailTab('compare')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              detailTab === 'compare'
                ? 'bg-emerald-600 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <Split className="w-4 h-4" />
            <span>Comparar Antes/Depois</span>
          </button>

          <button
            onClick={() => setDetailTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              detailTab === 'history'
                ? 'bg-emerald-600 text-emerald-950 shadow-md'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico de Cuidados</span>
          </button>
        </div>

        {/* Tab Content */}
        {detailTab === 'timeline' && (
          <PlantTimeline
            plant={selectedPlant}
            entries={diaryEntries}
            events={plantEvents}
            onOpenNewDiary={onOpenNewDiary}
            onOpenPhotoComparison={(photoUrl) => {
              setDetailTab('compare');
            }}
            onSelectPhoto={(url, caption) => onSelectPhoto(url, caption, selectedPlant.name)}
          />
        )}

        {detailTab === 'compare' && (
          <PhotoComparisonSlider
            plant={selectedPlant}
            entries={diaryEntries}
            initialPhotoA={comparisonPhotoA}
            initialPhotoB={comparisonPhotoB}
          />
        )}

        {detailTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#0a1812] p-3.5 rounded-xl border border-emerald-900/40">
              <div>
                <span className="font-semibold text-white text-sm">Histórico de Manutenção e Regas</span>
                <p className="text-[11px] text-emerald-400/70">
                  Registros de regas, adubações, replantio e podas desta planta
                </p>
              </div>
              <button
                onClick={() => onOpenNewEvent(selectedPlant.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-emerald-950 font-bold text-xs hover:bg-emerald-500 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Cuidado</span>
              </button>
            </div>

            <div className="space-y-2">
              {plantEvents.filter(e => e.plant_id === selectedPlant.id).length === 0 ? (
                <div className="p-8 text-center text-emerald-400/60 bg-emerald-950/20 rounded-xl border border-emerald-900/30 text-xs">
                  Nenhum evento registrado ainda para esta planta.
                </div>
              ) : (
                plantEvents
                  .filter(e => e.plant_id === selectedPlant.id)
                  .sort((a, b) => b.event_date.localeCompare(a.event_date))
                  .map(e => (
                    <div 
                      key={e.id}
                      className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-emerald-900/50 flex items-center justify-center text-sm">
                          {e.event_type === 'rega' ? '💧' : e.event_type === 'adubacao' ? '✨' : e.event_type === 'poda' ? '✂️' : '🌿'}
                        </span>
                        <div>
                          <span className="font-bold text-white capitalize">{e.event_type}</span>
                          {e.notes && <p className="text-[11px] text-emerald-300/80">{e.notes}</p>}
                        </div>
                      </div>
                      <span className="font-mono text-emerald-400/80 text-[11px]">{e.event_date}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

      </div>
    );
  }

  // Precompute stats per plant in O(N) single pass to eliminate redundant filters during list rendering
  const plantStatsMap = useMemo(() => {
    const stats = new Map<string, { entryCount: number; photoCount: number }>();
    plants.forEach(p => stats.set(p.id, { entryCount: 0, photoCount: 0 }));

    diaryEntries.forEach(entry => {
      const current = stats.get(entry.plant_id) || { entryCount: 0, photoCount: 0 };
      current.entryCount += 1;
      current.photoCount += (entry.photos ? entry.photos.length : 0);
      stats.set(entry.plant_id, current);
    });

    return stats;
  }, [plants, diaryEntries]);

  const handleSelectPlant = useCallback((id: string) => {
    setSelectedPlantId(id);
  }, [setSelectedPlantId]);

  // Collection View with useMemo
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesStatus = statusFilter === 'all' || plant.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        plant.name.toLowerCase().includes(query) || 
        (plant.species && plant.species.toLowerCase().includes(query)) ||
        (plant.notes && plant.notes.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [plants, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
            Minhas Plantas
          </h1>
          <p className="text-xs text-emerald-300/70 mt-0.5">
            Gerenciamento individual, evolução cronológica e linha do tempo
          </p>
        </div>

        <button
          onClick={() => onOpenNewPlant()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/60 transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Nova Planta</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0a1812] p-3 rounded-2xl border border-emerald-900/40">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-emerald-500/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou espécie..."
            className="w-full bg-[#07130e] border border-emerald-800/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-emerald-600/60 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'active', label: `Ativas (${plants.filter(p => p.status === 'active').length})` },
            { id: 'all', label: `Todas (${plants.length})` },
            { id: 'archived', label: `Arquivadas (${plants.filter(p => p.status === 'archived').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as 'all' | PlantStatus)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-emerald-950/40 text-emerald-400/80 hover:text-emerald-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-16 px-4 bg-emerald-950/20 rounded-2xl border border-emerald-900/30 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">
            <Sprout className="w-6 h-6" />
          </div>
          <p className="font-semibold text-sm text-emerald-200">Nenhuma planta encontrada</p>
          <p className="text-xs text-emerald-400/60 max-w-sm mx-auto">
            {searchQuery ? 'Tente alterar os termos de busca.' : 'Cadastre sua primeira planta para começar a documentar seu crescimento.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => onOpenNewPlant()}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-emerald-950 font-bold text-xs hover:bg-emerald-500 cursor-pointer"
            >
              Cadastrar Planta
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlants.map((plant) => {
            const stats = plantStatsMap.get(plant.id) || { entryCount: 0, photoCount: 0 };
            return (
              <PlantCard
                key={plant.id}
                plant={plant}
                entryCount={stats.entryCount}
                photoCount={stats.photoCount}
                onSelect={handleSelectPlant}
              />
            );
          })}
        </div>
      )}

    </div>
  );
};
