import React, { memo, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { DiaryEntry, Plant } from '../../types/index.ts';
import { BookOpen, ChevronRight, Plus } from 'lucide-react';

interface UltimasAtualizacoesWidgetProps {
  onOpenNewDiary: (plantId?: string) => void;
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
}

// 1. Memoized Single Diary Update Row Item
const DiaryUpdateRow = memo(({
  entry,
  plant,
  onSelectPhoto,
  onSelectPlant
}: {
  entry: DiaryEntry;
  plant?: Plant;
  onSelectPhoto: (url: string, caption?: string, plantName?: string) => void;
  onSelectPlant: (id: string) => void;
}) => {
  const firstPhoto = entry.photos?.[0];

  return (
    <div className="p-3.5 rounded-xl bg-[#091610] border border-emerald-900/50 hover:border-emerald-700/50 transition-all flex gap-3.5 items-start">
      {firstPhoto && (
        <div
          onClick={() => onSelectPhoto(firstPhoto.storage_path, firstPhoto.caption, plant?.name)}
          className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 relative group cursor-pointer border border-emerald-800/40 aspect-square"
        >
          <img
            src={firstPhoto.storage_path}
            alt={firstPhoto.caption || 'Foto'}
            loading="lazy"
            decoding="async"
            width="64"
            height="64"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
          {entry.photos.length > 1 && (
            <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 rounded text-white font-mono">
              +{entry.photos.length - 1}
            </span>
          )}
        </div>
      )}

      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <button
            onClick={() => {
              if (plant) onSelectPlant(plant.id);
            }}
            className="font-bold text-xs text-emerald-300 hover:text-white transition-colors truncate cursor-pointer text-left"
          >
            {plant?.name || 'Planta'}
          </button>
          <span className="text-[10px] text-emerald-400/60 font-mono shrink-0">
            {entry.entry_date}
          </span>
        </div>

        <p className="text-xs text-emerald-100/90 line-clamp-2 leading-relaxed">
          {entry.content}
        </p>

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.tags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800/40 text-emerald-300"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
DiaryUpdateRow.displayName = 'DiaryUpdateRow';

export const UltimasAtualizacoesWidget: React.FC<UltimasAtualizacoesWidgetProps> = memo(({
  onOpenNewDiary,
  onSelectPhoto
}) => {
  const { plants, diaryEntries, setActiveTab, setSelectedPlantId } = useApp();

  const handleSelectPlant = useCallback((id: string) => {
    setSelectedPlantId(id);
    setActiveTab('plantas');
  }, [setSelectedPlantId, setActiveTab]);

  const plantMap = useMemo(() => {
    const map = new Map<string, Plant>();
    plants.forEach(p => map.set(p.id, p));
    return map;
  }, [plants]);

  const recentEntries = useMemo(() => {
    return [...diaryEntries]
      .sort((a, b) => b.entry_date.localeCompare(a.entry_date))
      .slice(0, 4);
  }, [diaryEntries]);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-900/40 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">Últimas Atualizações no Diário</h3>
            <span className="text-[11px] text-emerald-400/70 font-mono">
              {diaryEntries.length} registros documentados
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('diario')}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer font-medium"
        >
          <span>Ver diário</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentEntries.length === 0 ? (
        <div className="text-center py-6 text-xs text-emerald-400/60">
          Nenhuma nota cadastrada ainda no diário.
        </div>
      ) : (
        <div className="space-y-3">
          {recentEntries.map((entry) => (
            <DiaryUpdateRow
              key={entry.id}
              entry={entry}
              plant={plantMap.get(entry.plant_id)}
              onSelectPhoto={onSelectPhoto}
              onSelectPlant={handleSelectPlant}
            />
          ))}
        </div>
      )}

      {/* Quick Add */}
      <button
        onClick={() => onOpenNewDiary()}
        className="w-full py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Novo Registro no Diário</span>
      </button>
    </div>
  );
});
UltimasAtualizacoesWidget.displayName = 'UltimasAtualizacoesWidget';
