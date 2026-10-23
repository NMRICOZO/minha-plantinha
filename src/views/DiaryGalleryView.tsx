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
  <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all space-y-3 shadow-sm">
    {/* Top: Plant Name, Date, Delete */}
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (plant) onSelectPlant(plant.id);
          }}
          className="font-bold text-sm text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer flex items-center gap-1.5 min-h-[36px]"
        >
          <Sprout className="w-4 h-4 text-[var(--accent-primary)]" />
          <span>{plant?.name || 'Planta'}</span>
        </button>
        {plant?.species && (
          <span className="text-xs text-[var(--text-muted)] italic hidden sm:inline">
            ({plant.species})
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          {entry.entry_date} {entry.entry_time ? `às ${entry.entry_time}` : ''}
        </span>
        <button
          onClick={() => {
            if (window.confirm('Excluir este registro do diário?')) {
              onDeleteEntry(entry.id);
            }
          }}
          className="p-2 rounded text-rose-500 hover:text-rose-600 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Excluir registro"
          aria-label="Excluir registro do diário"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Content text */}
    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
      {entry.content}
    </p>

    {/* Tags */}
    {entry.tags && entry.tags.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {entry.tags.map(t => (
          <span
            key={t.id}
            className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
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
            className="group/photo relative aspect-4/3 rounded-xl overflow-hidden bg-black cursor-pointer border border-[var(--border-subtle)]"
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
                className="mt-1 px-2.5 py-1.5 rounded bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-[10px] flex items-center gap-1 self-start cursor-pointer min-h-[32px]"
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
    className="group relative aspect-square rounded-2xl overflow-hidden bg-black cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] shadow-md transition-all"
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
      <div className="self-end bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-[var(--accent-primary)]">
        {photo.entry_date}
      </div>

      <div>
        <h4 className="text-xs font-bold text-white line-clamp-1">{photo.plant_name}</h4>
        {photo.caption && <p className="text-[10px] text-white/80 line-clamp-1">{photo.caption}</p>}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComparison(photo.plant_id, photo.storage_path);
          }}
          className="mt-2 px-2.5 py-1.5 rounded-md bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-[10px] flex items-center gap-1 cursor-pointer min-h-[32px]"
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
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
            Diário & Galeria Botânica
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Histórico visual de brotações, novas folhas e transformações
          </p>
        </div>

        <button
          onClick={() => onOpenNewDiary()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 cursor-pointer self-start sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo Registro no Diário</span>
        </button>
      </div>

      {/* Main Tab Controls: Feed vs Gallery */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 min-h-[44px] ${
              activeSubTab === 'feed'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Linha de Registros ({filteredEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 min-h-[44px] ${
              activeSubTab === 'gallery'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galeria de Fotos ({allPhotos.length})</span>
          </button>
        </div>

        {/* Gallery layout toggle if in gallery subtab */}
        {activeSubTab === 'gallery' && (
          <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-subtle)]">
            <button
              onClick={() => setGalleryLayout('grid')}
              className={`p-2 rounded text-xs transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                galleryLayout === 'grid' ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Modo Grade"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGalleryLayout('cards')}
              className={`p-2 rounded text-xs transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                galleryLayout === 'cards' ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Modo Cartões"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-[var(--bg-surface)] p-3 rounded-2xl border border-[var(--border-subtle)] text-xs shadow-sm">
        <div className="flex items-center gap-1.5 text-[var(--accent-primary)] font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtrar:</span>
        </div>

        {/* Plant select filter */}
        <select
          value={selectedPlantFilter}
          onChange={(e) => setSelectedPlantFilter(e.target.value)}
          className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent-primary)] min-h-[44px]"
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
          className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--accent-primary)] min-h-[44px]"
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
            className="text-[11px] text-[var(--accent-primary)] hover:underline ml-auto min-h-[44px] flex items-center"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeSubTab === 'feed' ? (
        filteredEntries.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] shadow-sm">
            <BookOpen className="w-10 h-10 mx-auto text-[var(--accent-primary)] mb-3" />
            <p className="font-semibold text-[var(--text-primary)] text-sm">Nenhum registro encontrado no diário.</p>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mt-1">
              Registre a evolução das suas plantas com anotações e fotos de crescimento.
            </p>
            <button
              onClick={() => onOpenNewDiary()}
              className="mt-4 px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs hover:bg-[var(--accent-hover)] cursor-pointer min-h-[44px]"
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
          <div className="text-center py-16 px-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] shadow-sm">
            <ImageIcon className="w-10 h-10 mx-auto text-[var(--accent-primary)] mb-3" />
            <p className="font-semibold text-[var(--text-primary)] text-sm">Nenhuma foto encontrada.</p>
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
                className="bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] flex flex-col shadow-sm"
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
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{photo.plant_name}</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{photo.entry_content}</p>
                  </div>
                  <button
                    onClick={() => handleOpenComparison(photo.plant_id, photo.storage_path)}
                    className="self-start px-3 py-2 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-medium flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                  >
                    <Split className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
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
