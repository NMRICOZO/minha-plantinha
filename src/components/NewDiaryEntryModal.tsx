import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Upload, Plus, Tag as TagIcon, Check, BookOpen } from 'lucide-react';

interface NewDiaryEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPlantId?: string | null;
}

const SAMPLE_DIARY_PHOTOS = [
  { label: 'Folha Nova', url: 'https://images.unsplash.com/photo-1596724806089-3c8fcff50b2b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tutor / Replantio', url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80' },
  { label: 'Folha Gigante', url: 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=800&q=80' },
  { label: 'Brotos Apicais', url: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80' },
  { label: 'Vaso Suspenso', url: 'https://images.unsplash.com/photo-1617173944883-6ffbd35d584d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Planta no Canto', url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80' },
];

export const NewDiaryEntryModal: React.FC<NewDiaryEntryModalProps> = ({
  isOpen,
  onClose,
  preselectedPlantId
}) => {
  const { plants, tags, addDiaryEntry } = useApp();

  const [plantId, setPlantId] = useState<string>(() => {
    return preselectedPlantId || (plants[0]?.id ?? '');
  });
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entryTime, setEntryTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [content, setContent] = useState<string>('');
  const [selectedPhotoUrls, setSelectedPhotoUrls] = useState<Array<{ storage_path: string; caption?: string }>>([
    { storage_path: SAMPLE_DIARY_PHOTOS[0].url, caption: 'Evolução e desenvolvimento' }
  ]);
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>(['nova_folha']);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedPhotoUrls(prev => [{ storage_path: reader.result as string, caption: 'Nova foto' }, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tagName: string) => {
    setSelectedTagNames(prev => 
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const addCustomTag = () => {
    const clean = customTagInput.replace(/^#/, '').trim().toLowerCase();
    if (clean && !selectedTagNames.includes(clean)) {
      setSelectedTagNames(prev => [...prev, clean]);
      setCustomTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantId) {
      setError('Selecione a planta correspondente.');
      return;
    }
    if (!content.trim()) {
      setError('Escreva uma breve anotação sobre o desenvolvimento da planta.');
      return;
    }

    addDiaryEntry({
      plant_id: plantId,
      entry_date: entryDate,
      entry_time: entryTime,
      content: content.trim(),
      photos: selectedPhotoUrls,
      tag_names: selectedTagNames
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0b1712] border border-emerald-800/50 rounded-2xl shadow-2xl p-5 sm:p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Novo Registro no Diário</h2>
              <p className="text-[11px] text-emerald-400/70">
                Documente fotos, brotações e acontecimentos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Plant selection & date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Planta *
              </label>
              <select
                required
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {plants.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.species ? `(${p.species})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-emerald-300 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-300 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Written observation */}
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">
              Anotação / O que aconteceu? *
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(null); }}
              placeholder="Ex: Nova folha abriu com fenestração perfeita! O tom verde-claro está lindo e as raízes aéreas cresceram 5 cm..."
              className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Photo Management */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-emerald-300">
                Fotos do Registro
              </label>
              <label className="cursor-pointer text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">
                <Upload className="w-3 h-3" />
                <span>Upload de Foto</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Currently selected photos preview */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {selectedPhotoUrls.map((p, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-700/60 bg-black shrink-0 group">
                  <img src={p.storage_path} alt="Registro" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoUrls(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-emerald-400/60">
              Ou selecione uma foto botânica de referência:
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {SAMPLE_DIARY_PHOTOS.map((sp) => {
                const isSelected = selectedPhotoUrls.some(p => p.storage_path === sp.url);
                return (
                  <button
                    type="button"
                    key={sp.label}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPhotoUrls(prev => prev.filter(p => p.storage_path !== sp.url));
                      } else {
                        setSelectedPhotoUrls(prev => [...prev, { storage_path: sp.url, caption: sp.label }]);
                      }
                    }}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/40' : 'border-emerald-950 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={sp.url} alt={sp.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-emerald-300">
              Tags do Momento
            </label>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => {
                const isSelected = selectedTagNames.includes(t.name);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => toggleTag(t.name)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-emerald-950 font-bold border-emerald-400'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:border-emerald-600/50'
                    }`}
                  >
                    <TagIcon className="w-2.5 h-2.5" />
                    <span>#{t.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Tag input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }}
                placeholder="Criar nova tag (ex: #raiz_nova)"
                className="flex-1 bg-[#07130e] border border-emerald-800/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={addCustomTag}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-200 text-xs font-medium cursor-pointer"
              >
                + Adicionar
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-900/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-emerald-300 hover:text-white hover:bg-emerald-950/60 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs shadow-md shadow-emerald-950/60 transition-colors cursor-pointer"
            >
              Salvar no Diário
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
