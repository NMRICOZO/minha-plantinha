import React from 'react';
import { Plant, DiaryEntry, PlantEvent } from '../types/index.ts';
import { calculateDaysBetween } from '../utils/plantCalculations.ts';
import { Calendar, Tag as TagIcon, Sparkles, Plus, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface PlantTimelineProps {
  plant: Plant;
  entries: DiaryEntry[];
  events: PlantEvent[];
  onOpenNewDiary: (plantId: string) => void;
  onOpenPhotoComparison: (photoUrl: string) => void;
  onSelectPhoto: (photoUrl: string, caption?: string) => void;
}

export const PlantTimeline: React.FC<PlantTimelineProps> = ({
  plant,
  entries,
  events,
  onOpenNewDiary,
  onOpenPhotoComparison,
  onSelectPhoto,
}) => {
  const plantEntries = entries
    .filter(e => e.plant_id === plant.id)
    .sort((a, b) => b.entry_date.localeCompare(a.entry_date));

  const plantEvents = events
    .filter(e => e.plant_id === plant.id)
    .sort((a, b) => b.event_date.localeCompare(a.event_date));

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-[#0a1812] p-3.5 rounded-xl border border-emerald-900/40">
        <div>
          <span className="font-semibold text-white text-sm">Linha do Tempo Visual</span>
          <p className="text-[11px] text-emerald-400/70">
            {plantEntries.length} {plantEntries.length === 1 ? 'registro' : 'registros'} documentados desde {plant.acquired_date}
          </p>
        </div>

        <button
          onClick={() => onOpenNewDiary(plant.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-semibold text-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Novo Registro</span>
        </button>
      </div>

      {plantEntries.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400 mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="font-medium text-emerald-200 text-sm">Nenhum registro no diário ainda.</p>
          <p className="text-xs text-emerald-400/60 mt-1 max-w-sm mx-auto">
            Tire uma foto hoje para iniciar a linha do tempo e acompanhar o surgimento de cada folha nova.
          </p>
          <button
            onClick={() => onOpenNewDiary(plant.id)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-emerald-950 font-semibold text-xs hover:bg-emerald-500 cursor-pointer"
          >
            Adicionar Primeiro Registro
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-700/60 before:to-emerald-900/20">
          
          {plantEntries.map((entry, idx) => {
            const daysSinceAcquisition = calculateDaysBetween(plant.acquired_date, entry.entry_date);

            return (
              <div key={entry.id} className="relative group">
                
                {/* Node marker on vertical timeline line */}
                <div className="absolute -left-[19px] sm:-left-[23px] top-1.5 w-4 h-4 rounded-full bg-[#08100d] border-2 border-emerald-400 flex items-center justify-center ring-4 ring-emerald-950/60 group-hover:scale-125 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>

                {/* Timeline Card */}
                <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-800/30 hover:border-emerald-600/50 transition-all space-y-3">
                  
                  {/* Card Header: Dates & Milestone Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/40 pb-2.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {entry.entry_date}
                      </span>
                      {entry.entry_time && (
                        <span className="text-emerald-400/60 font-mono text-[11px]">
                          às {entry.entry_time}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/40">
                      {daysSinceAcquisition === 0 
                        ? 'Chegada (Dia 0)' 
                        : `+${daysSinceAcquisition} dias`}
                    </span>
                  </div>

                  {/* Written Content */}
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed whitespace-pre-line">
                    {entry.content}
                  </p>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {entry.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 flex items-center gap-1"
                        >
                          <TagIcon className="w-2.5 h-2.5 opacity-60" />
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Entry Photos Grid */}
                  {entry.photos && entry.photos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {entry.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="group/photo relative rounded-xl overflow-hidden border border-emerald-900/60 bg-black/60 aspect-4/3"
                        >
                          <img
                            src={photo.storage_path}
                            alt={photo.caption || 'Foto da planta'}
                            className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => onSelectPhoto(photo.storage_path, photo.caption)}
                          />

                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                            {photo.caption && (
                              <p className="text-[11px] text-white font-medium mb-2 truncate">
                                {photo.caption}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenPhotoComparison(photo.storage_path);
                                }}
                                className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-semibold text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <span>Comparar com outra</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};
