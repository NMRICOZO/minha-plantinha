import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plant, DiaryEntry } from '../types/index.ts';
import { calculateDaysBetween } from '../utils/plantCalculations.ts';
import { Split, Columns2, Calendar, MoveHorizontal, ArrowLeftRight } from 'lucide-react';

interface PhotoComparisonSliderProps {
  plant: Plant;
  entries: DiaryEntry[];
  initialPhotoA?: string | null;
  initialPhotoB?: string | null;
  onClose?: () => void;
}

export const PhotoComparisonSlider: React.FC<PhotoComparisonSliderProps> = ({
  plant,
  entries,
  initialPhotoA,
  initialPhotoB,
  onClose
}) => {
  // Extract all photos from entries for this plant
  const allPlantPhotos = entries
    .filter(e => e.plant_id === plant.id)
    .flatMap(e => (e.photos || []).map(p => ({
      ...p,
      entry_date: e.entry_date,
      entry_content: e.content
    })))
    .sort((a, b) => a.entry_date.localeCompare(b.entry_date));

  // Determine initial photo A and B
  const [photoAIndex, setPhotoAIndex] = useState<number>(() => {
    if (initialPhotoA) {
      const idx = allPlantPhotos.findIndex(p => p.storage_path === initialPhotoA);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const [photoBIndex, setPhotoBIndex] = useState<number>(() => {
    if (initialPhotoB) {
      const idx = allPlantPhotos.findIndex(p => p.storage_path === initialPhotoB);
      if (idx !== -1) return idx;
    }
    return Math.max(0, allPlantPhotos.length - 1);
  });

  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const containerRef = useRef<HTMLDivElement>(null);

  const photoA = allPlantPhotos[photoAIndex] || {
    storage_path: plant.cover_photo_url || '',
    entry_date: plant.acquired_date,
    caption: 'Foto de Aquisição'
  };

  const photoB = allPlantPhotos[photoBIndex] || photoA;

  const daysDifference = calculateDaysBetween(photoA.entry_date, photoB.entry_date);

  // Handle Dragging
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  if (allPlantPhotos.length === 0) {
    return (
      <div className="p-8 text-center text-emerald-400/80 bg-emerald-950/20 rounded-2xl border border-emerald-900/30">
        <p className="font-medium text-sm">Esta planta ainda não possui fotos no diário para comparação.</p>
        <p className="text-xs text-emerald-500/60 mt-1">Adicione registros visuais para acompanhar a evolução botânica.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a1812] p-3.5 rounded-xl border border-emerald-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">Comparador Visual Antes/Depois</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
              {daysDifference >= 0 ? `+${daysDifference} dias de evolução` : `${Math.abs(daysDifference)} dias antes`}
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/70 mt-0.5">
            Arraste a linha central para comparar visualmente o crescimento das folhas e ramos.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-emerald-900/50">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'slider' ? 'bg-emerald-700 text-white shadow-sm' : 'text-emerald-400/70 hover:text-emerald-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Slider Interativo</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'side-by-side' ? 'bg-emerald-700 text-white shadow-sm' : 'text-emerald-400/70 hover:text-emerald-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Lado a Lado</span>
          </button>
        </div>
      </div>

      {/* Comparison Surface */}
      {viewMode === 'slider' ? (
        <div 
          ref={containerRef}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
          className="relative w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-emerald-800/40 shadow-2xl bg-black touch-slider-handle"
          style={{ touchAction: 'none' }}
        >
          {/* Base Layer: Photo B (After / Right) */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={photoB.storage_path} 
              alt="Depois" 
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Label for Photo B */}
            <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs shadow-lg text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">Depois</span>
              <span className="font-semibold text-white">{photoB.entry_date}</span>
            </div>
          </div>

          {/* Top Layer: Photo A (Before / Left) clipped with width */}
          <div 
            className="absolute inset-0 h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
              <img 
                src={photoA.storage_path} 
                alt="Antes" 
                className="w-full h-full object-cover pointer-events-none"
              />
              {/* Label for Photo A */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs shadow-lg text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">Antes</span>
                <span className="font-semibold text-white">{photoA.entry_date}</span>
              </div>
            </div>
          </div>

          {/* Draggable Divider Line & Knob */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(0,0,0,0.8)] z-20 flex items-center justify-center -ml-0.5"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-black/40 touch-slider-handle">
              <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
      ) : (
        /* Side by side mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden border border-emerald-900/60 bg-black">
            <img src={photoA.storage_path} alt="Antes" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-black/80 px-2.5 py-1 rounded text-xs border border-white/20">
              <span className="text-[10px] text-amber-400 font-bold block uppercase">Antes</span>
              <span className="text-white font-medium">{photoA.entry_date}</span>
            </div>
          </div>

          <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden border border-emerald-900/60 bg-black">
            <img src={photoB.storage_path} alt="Depois" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded text-xs border border-white/20 text-right">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase">Depois</span>
              <span className="text-white font-medium">{photoB.entry_date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Selector: Choose which two photos to compare */}
      <div className="p-3.5 bg-[#0a1812] rounded-xl border border-emerald-900/40 space-y-3">
        <span className="text-xs font-semibold text-emerald-300">
          Escolha os Registros para Comparar ({allPlantPhotos.length} fotos disponíveis)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          
          {/* Picker A (Antes) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
              <span>Foto A (Primeiro Registro / Antes)</span>
            </label>
            <select
              value={photoAIndex}
              onChange={(e) => setPhotoAIndex(Number(e.target.value))}
              className="w-full bg-[#07130e] border border-emerald-800/50 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {allPlantPhotos.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.entry_date} — {p.caption || 'Registro de Foto'}
                </option>
              ))}
            </select>
          </div>

          {/* Picker B (Depois) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <span>Foto B (Registro Recente / Depois)</span>
            </label>
            <select
              value={photoBIndex}
              onChange={(e) => setPhotoBIndex(Number(e.target.value))}
              className="w-full bg-[#07130e] border border-emerald-800/50 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {allPlantPhotos.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.entry_date} — {p.caption || 'Registro de Foto'}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </div>
  );
};
