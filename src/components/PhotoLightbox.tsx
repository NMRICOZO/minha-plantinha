import React from 'react';
import { X, Split, Download, Calendar } from 'lucide-react';

interface PhotoLightboxProps {
  photoUrl: string | null;
  caption?: string;
  plantName?: string;
  date?: string;
  onClose: () => void;
  onOpenComparison?: (photoUrl: string) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photoUrl,
  caption,
  plantName,
  date,
  onClose,
  onOpenComparison
}) => {
  if (!photoUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div 
        className="flex items-center justify-between text-white max-w-5xl mx-auto w-full z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {plantName && (
            <h3 className="font-bold text-sm sm:text-base text-emerald-300">
              {plantName}
            </h3>
          )}
          {date && (
            <p className="text-xs text-white/70 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-emerald-400" />
              {date}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onOpenComparison && (
            <button
              onClick={() => {
                onClose();
                onOpenComparison(photoUrl);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Comparar esta foto</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div 
        className="flex-1 flex items-center justify-center p-2 sm:p-4 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photoUrl}
          alt={caption || 'Visualização botânica'}
          className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
        />
      </div>

      {/* Bottom Caption */}
      {caption && (
        <div 
          className="max-w-xl mx-auto w-full text-center pb-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 inline-block text-xs text-emerald-200">
            {caption}
          </div>
        </div>
      )}
    </div>
  );
};
