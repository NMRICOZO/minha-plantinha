import React, { memo, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ImageIcon, ChevronRight } from 'lucide-react';

interface UltimasFotosWidgetProps {
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
}

// 1. Memoized Single Photo Thumbnail Item
const PhotoThumbItem = memo(({
  storagePath,
  caption,
  plantName,
  entryDate,
  onSelectPhoto
}: {
  storagePath: string;
  caption?: string;
  plantName: string;
  entryDate: string;
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
}) => (
  <div
    onClick={() => onSelectPhoto(storagePath, caption, plantName)}
    className="group relative aspect-square rounded-xl overflow-hidden bg-black cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-all shadow-sm"
  >
    <img
      src={storagePath}
      alt={caption || plantName}
      loading="lazy"
      decoding="async"
      width="120"
      height="120"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex flex-col justify-end">
      <span className="text-[9px] text-[var(--accent-primary)] font-mono line-clamp-1">{entryDate}</span>
      <span className="text-[9px] text-white font-medium truncate">{plantName}</span>
    </div>
  </div>
));
PhotoThumbItem.displayName = 'PhotoThumbItem';

export const UltimasFotosWidget: React.FC<UltimasFotosWidgetProps> = memo(({
  onSelectPhoto
}) => {
  const { plants, diaryEntries, setActiveTab } = useApp();

  // Extract all photos with plant info, memoized to prevent recalculating on unrelated renders
  const allPhotos = useMemo(() => {
    const pMap = new Map<string, string>();
    plants.forEach(p => pMap.set(p.id, p.name));

    return diaryEntries
      .flatMap(entry => {
        const plantName = pMap.get(entry.plant_id) || 'Planta';
        return (entry.photos || []).map(photo => ({
          id: photo.id,
          storage_path: photo.storage_path,
          caption: photo.caption,
          entry_date: entry.entry_date,
          plant_id: entry.plant_id,
          plant_name: plantName
        }));
      })
      .sort((a, b) => b.entry_date.localeCompare(a.entry_date))
      .slice(0, 6);
  }, [plants, diaryEntries]);

  return (
    <div className="bg-[var(--bg-surface)] rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center text-[var(--accent-primary)]">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">Últimas Fotos</h3>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Galeria de evolução visual
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('diario')}
          className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] flex items-center gap-0.5 cursor-pointer font-medium min-h-[44px]"
        >
          <span>Ver todas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {allPhotos.length === 0 ? (
        <div className="text-center py-6 text-xs text-[var(--text-muted)]">
          Nenhuma foto cadastrada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {allPhotos.map((photo) => (
            <PhotoThumbItem
              key={photo.id || photo.storage_path}
              storagePath={photo.storage_path}
              caption={photo.caption}
              plantName={photo.plant_name}
              entryDate={photo.entry_date}
              onSelectPhoto={onSelectPhoto}
            />
          ))}
        </div>
      )}
    </div>
  );
});
UltimasFotosWidget.displayName = 'UltimasFotosWidget';
