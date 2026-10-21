import React, { useState, useMemo, useCallback, memo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { DiaryEntry, Plant } from '../types/index.ts';
import { 
  BookOpen, 
  Image as ImageIcon, 
  Plus, 
  Filter, 
  Grid3X3, 
  LayoutList, 
  Calendar, 
  Split, 
  Trash2,
  Sprout
} from 'lucide-react';

interface DiaryGalleryViewProps {
  onOpenNewDiary: (plantId?: string) => void;
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
}

// 1. Memoized Diary Feed Card Component
const DiaryFeedCard = memo(({
  entry,
  plant,
  onSelectPlant,
  onDeleteEntry,
  onSelectPhoto,
  onOpenComparison
}: {
  entry: DiaryEntry;
  plant?: Plant;
  onSelectPlant: (id: string) => void;
  onDeleteEntry: (id: string) => void;
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
  onOpenComparison: (plantId: string, photoUrl: string) => void;
}) => (
  <div className="glass-card rounded-2xl p-5 border border-emerald-900/40 hover:border-emerald-700/50 transition-all space-y-3">
    {/* Top: Plant Name, Date, Delete */}
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-950 pb-2.5">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (plant) onSelectPlant(plant.id);
          }}
          className="font-bold text-sm text-emerald-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span>{plant?.name || 'Planta'}</span>
        </button>
        {plant?.species && (
          <span className="text-xs text-emerald-400/60 italic hidden sm:inline">
            ({plant.species})
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-emerald-400/80 font-mono flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          {entry.entry_date} {entry.entry_time ? `às ${entry.entry_time}` : ''}
        </span>
        <button
          onClick={() => {
            if (window.confirm('Excluir este registro do diário?')) {
              onDeleteEntry(entry.id);
            }
          }}
          className="p-1 rounded text-rose-400/60 hover:text-rose-300 transition-colors cursor-pointer"
          title="Excluir registro"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    {/* Content text */}
    <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed whitespace-pre-line">
      {entry.content}
    </p>

    {/* Tags */}
    {entry.tags && entry.tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {entry.tags.map(t => (
          <span
            key={t.id}
            className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/40 text-emerald-300"
          >
            #{t.name}
          </span>
        ))}
      </div>
    )}

    {/* Photos Grid */}
    {entry.photos && entry.photos.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
        {entry.photos.map(p => (
          <div
            key={p.id}
            onClick={() => onSelectPhoto(p.storage_path, p.caption, plant?.name)}
            className="group/photo relative aspect-4/3 rounded-xl overflow-hidden bg-black cursor-pointer border border-emerald-900/60"
          >
            <img
              src={p.storage_path}
              alt={p.caption || 'Foto'}
              loading="lazy"
              decoding="async"
              width="240"
              height="180"
              className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
              {p.caption && <span className="text-[11px] text-white font-medium truncate">{p.caption}</span>}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (plant) onOpenComparison(plant.id, p.storage_path);
                }}
                className="mt-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-[10px] flex items-center gap-1 self-start cursor-pointer"
              >
                <Split className="w-3 h-3" />
                <span>Comparar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
));
DiaryFeedCard.displayName = 'DiaryFeedCard';

// 2. Memoized Gallery Photo Item
const GalleryPhotoItem = memo(({
  photo,
  onSelectPhoto,
  onOpenComparison
}: {
  photo: {
    storage_path: string;
    caption?: string;
    plant_name: string;
    entry_date: string;
    plant_id: string;
  };
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
  onOpenComparison: (plantId: string, photoUrl: string) => void;
}) => (
  <div
    onClick={() => onSelectPhoto(photo.storage_path, photo.caption, photo.plant_name)}
    className="group relative aspect-square rounded-2xl overflow-hidden bg-black cursor-pointer border border-emerald-900/50 hover:border-emerald-500/60 shadow-lg transition-all"
  >
    <img
      src={photo.storage_path}
      alt={photo.caption || photo.plant_name}
      loading="lazy"
      decoding="async"
      width="200"
      height="200"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    
    {/* Overlay Badge */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-3 flex flex-col justify-between opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="self-end bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300">
        {photo.entry_date}
      </div>

      <div>
        <h4 className="text-xs font-bold text-white line-clamp-1">{photo.plant_name}</h4>
        {photo.caption && <p className="text-[10px] text-emerald-300/80 line-clamp-1">{photo.caption}</p>}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComparison(photo.plant_id, photo.storage_path);
          }}
          className="mt-2 px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
        >
          <Split className="w-3 h-3" />
          <span>Comparar</span>
        </button>
      </div>
    </div>
  </div>
));
GalleryPhotoItem.displayName = 'GalleryPhotoItem';

export const DiaryGalleryView: React.FC<DiaryGalleryViewProps> = ({
  onOpenNewDiary,
  onSelectPhoto
}) => {
  const { 
    plants, 
    diaryEntries, 
    tags, 
    deleteDiaryEntry, 
    setSelectedPlantId, 
    setActiveTab,
    openComparison
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'gallery'>('feed');
  const [selectedPlantFilter, setSelectedPlantFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [galleryLayout, setGalleryLayout] = useState<'grid' | 'cards'>('grid');

  const handleSelectPlant = useCallback((id: string) => {
    setSelectedPlantId(id);
    setActiveTab('plantas');
  }, [setSelectedPlantId, setActiveTab]);

  const handleDeleteEntry = useCallback((id: string) => {
    deleteDiaryEntry(id);
  }, [deleteDiaryEntry]);

  const handleOpenComparison = useCallback((plantId: string, photoUrl: string) => {
    openComparison(plantId, photoUrl);
  }, [openComparison]);

  const plantMap = useMemo(() => {
    const map = new Map<string, Plant>();
    plants.forEach(p => map.set(p.id, p));
    return map;
  }, [plants]);

  // Filter entries with useMemo
  const filteredEntries: DiaryEntry[] = useMemo(() => {
    return diaryEntries
      .filter((entry: DiaryEntry) => {
        const matchesPlant = selectedPlantFilter === 'all' || entry.plant_id === selectedPlantFilter;
        const matchesTag = selectedTagFilter === 'all' || entry.tags.some(t => t.name === selectedTagFilter);
        return matchesPlant && matchesTag;
      })
      .sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  }, [diaryEntries, selectedPlantFilter, selectedTagFilter]);

  // Extract all photos with parent entry metadata with useMemo
  const allPhotos = useMemo(() => {
    return filteredEntries.flatMap((entry: DiaryEntry) => {
      const plant = plantMap.get(entry.plant_id);
      return (entry.photos || []).map((photo) => ({
        ...photo,
        entry_id: entry.id,
        entry_date: entry.entry_date,
        entry_content: entry.content,
        plant_id: entry.plant_id,
        plant_name: plant?.name || 'Planta',
        plant_species: plant?.species || '',
        tags: entry.tags || []
      }));
    });
  }, [filteredEntries, plantMap]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
            Diário & Galeria Botânica
          </h1>
          <p className="text-xs text-emerald-300/70 mt-0.5">
            Histórico visual de brotações, novas folhas e transformações
          </p>
        </div>

        <button
          onClick={() => onOpenNewDiary()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/60 transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo Registro no Diário</span>
        </button>
      </div>

      {/* Main Tab Controls: Feed vs Gallery */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'feed'
                ? 'bg-emerald-600 text-emerald-950 shadow-sm'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Linha de Registros ({filteredEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gallery')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'gallery'
                ? 'bg-emerald-600 text-emerald-950 shadow-sm'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galeria de Fotos ({allPhotos.length})</span>
          </button>
        </div>

        {/* Gallery layout toggle if in gallery subtab */}
        {activeSubTab === 'gallery' && (
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-emerald-900/40">
            <button
              onClick={() => setGalleryLayout('grid')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                galleryLayout === 'grid' ? 'bg-emerald-700 text-white' : 'text-emerald-400/60 hover:text-white'
              }`}
              title="Modo Grade"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGalleryLayout('cards')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                galleryLayout === 'cards' ? 'bg-emerald-700 text-white' : 'text-emerald-400/60 hover:text-white'
              }`}
              title="Modo Cartões"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-[#091711] p-3 rounded-2xl border border-emerald-900/40 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtrar:</span>
        </div>

        {/* Plant select filter */}
        <select
          value={selectedPlantFilter}
          onChange={(e) => setSelectedPlantFilter(e.target.value)}
          className="bg-[#050f0b] border border-emerald-800/50 rounded-lg px-2.5 py-1 text-emerald-200 text-xs focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Todas as plantas ({plants.length})</option>
          {plants.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Tag select filter */}
        <select
          value={selectedTagFilter}
          onChange={(e) => setSelectedTagFilter(e.target.value)}
          className="bg-[#050f0b] border border-emerald-800/50 rounded-lg px-2.5 py-1 text-emerald-200 text-xs focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Todas as tags ({tags.length})</option>
          {tags.map(t => (
            <option key={t.id} value={t.name}>#{t.name}</option>
          ))}
        </select>

        {(selectedPlantFilter !== 'all' || selectedTagFilter !== 'all') && (
          <button
            onClick={() => {
              setSelectedPlantFilter('all');
              setSelectedTagFilter('all');
            }}
            className="text-[11px] text-emerald-400 hover:underline ml-auto cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeSubTab === 'feed' ? (
        filteredEntries.length === 0 ? (
          <div className="text-center py-16 px-4 bg-emerald-950/20 rounded-2xl border border-emerald-900/30">
            <BookOpen className="w-10 h-10 mx-auto text-emerald-500/50 mb-3" />
            <p className="font-semibold text-emerald-200 text-sm">Nenhum registro encontrado no diário.</p>
            <p className="text-xs text-emerald-400/60 max-w-sm mx-auto mt-1">
              Registre a evolução das suas plantas com anotações e fotos de crescimento.
            </p>
            <button
              onClick={() => onOpenNewDiary()}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-emerald-950 font-bold text-xs hover:bg-emerald-500 cursor-pointer"
            >
              Criar Novo Registro
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <DiaryFeedCard
                key={entry.id}
                entry={entry}
                plant={plantMap.get(entry.plant_id)}
                onSelectPlant={handleSelectPlant}
                onDeleteEntry={handleDeleteEntry}
                onSelectPhoto={onSelectPhoto}
                onOpenComparison={handleOpenComparison}
              />
            ))}
          </div>
        )
      ) : (
        /* Gallery Subtab (Photos only) */
        allPhotos.length === 0 ? (
          <div className="text-center py-16 px-4 bg-emerald-950/20 rounded-2xl border border-emerald-900/30">
            <ImageIcon className="w-10 h-10 mx-auto text-emerald-500/50 mb-3" />
            <p className="font-semibold text-emerald-200 text-sm">Nenhuma foto encontrada.</p>
          </div>
        ) : galleryLayout === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {allPhotos.map((photo, i) => (
              <GalleryPhotoItem
                key={photo.id || `${photo.entry_id}-${i}`}
                photo={photo}
                onSelectPhoto={onSelectPhoto}
                onOpenComparison={handleOpenComparison}
              />
            ))}
          </div>
        ) : (
          /* Cards mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allPhotos.map((photo, i) => (
              <div
                key={photo.id || `${photo.entry_id}-${i}`}
                className="glass-card rounded-2xl overflow-hidden border border-emerald-900/40 flex flex-col"
              >
                <div 
                  onClick={() => onSelectPhoto(photo.storage_path, photo.caption, photo.plant_name)}
                  className="relative aspect-16/10 bg-black cursor-pointer group"
                >
                  <img 
                    src={photo.storage_path} 
                    alt="Foto" 
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="250"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-1 rounded text-[10px] font-mono text-white">
                    {photo.entry_date}
                  </div>
                </div>
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{photo.plant_name}</h4>
                    <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2">{photo.entry_content}</p>
                  </div>
                  <button
                    onClick={() => handleOpenComparison(photo.plant_id, photo.storage_path)}
                    className="self-start px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 text-[11px] font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Split className="w-3 h-3" />
                    <span>Abrir no Comparador</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
};
