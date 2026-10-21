import React, { useState } from 'react';
import { Plant, PlantStatus, PlantLocation } from '../types/index.ts';
import { X, Upload, Sprout, Image as ImageIcon, Check } from 'lucide-react';

interface PlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Plant> & { name: string; acquired_date: string }) => void;
  initialPlant?: Plant | null;
}

const PRESET_PHOTOS = [
  { label: 'Monstera', url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ficus', url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jiboia', url: 'https://images.unsplash.com/photo-1617173944883-6ffbd35d584d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Calathea', url: 'https://images.unsplash.com/photo-1620127682256-0f512ca82a9a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Peperomia', url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Suculenta', url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80' },
];

export const PlantModal: React.FC<PlantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlant
}) => {
  const [name, setName] = useState(initialPlant?.name || '');
  const [species, setSpecies] = useState(initialPlant?.species || '');
  const [acquiredDate, setAcquiredDate] = useState(initialPlant?.acquired_date || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<PlantStatus>(initialPlant?.status || 'active');
  const [location, setLocation] = useState<PlantLocation>(initialPlant?.location || 'indoor');
  const [lightLevel, setLightLevel] = useState<Plant['light_level']>(initialPlant?.light_level || 'alta_indireta');
  const [wateringFrequency, setWateringFrequency] = useState<number>(initialPlant?.watering_frequency_days || 7);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(initialPlant?.cover_photo_url || PRESET_PHOTOS[0].url);
  const [notes, setNotes] = useState(initialPlant?.notes || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome da planta.');
      return;
    }
    if (!acquiredDate) {
      setError('Por favor, selecione a data de aquisição.');
      return;
    }

    onSave({
      name: name.trim(),
      species: species.trim() || undefined,
      acquired_date: acquiredDate,
      status,
      location,
      light_level: lightLevel,
      watering_frequency_days: wateringFrequency,
      cover_photo_url: coverPhotoUrl,
      notes: notes.trim() || undefined,
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
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialPlant ? 'Editar Planta' : 'Cadastrar Nova Planta'}
              </h2>
              <p className="text-[11px] text-emerald-400/70">
                Acompanhe o crescimento e histórico de cuidados
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
          
          {/* Name & Species */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Nome da Planta *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="Ex: Monstera Deliciosa"
                className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Espécie Botânica
              </label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="Ex: Monstera deliciosa"
                className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Acquired Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Data de Chegada / Aquisição *
              </label>
              <input
                type="date"
                required
                value={acquiredDate}
                onChange={(e) => setAcquiredDate(e.target.value)}
                className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Status Atual
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PlantStatus)}
                className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="active">Ativa (Na coleção)</option>
                <option value="archived">Arquivada</option>
                <option value="gifted">Presenteada</option>
                <option value="deceased">Não sobreviveu</option>
              </select>
            </div>
          </div>

          {/* Location & Light Requirement */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Ambiente / Local
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as PlantLocation)}
                className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="indoor">Interior / Sala</option>
                <option value="balcony">Varanda / Sacada</option>
                <option value="outdoor">Jardim Externo</option>
                <option value="window">Parapeito de Janela</option>
                <option value="greenhouse">Estufa / Viveiro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Necessidade de Luz
              </label>
              <select
                value={lightLevel}
                onChange={(e) => setLightLevel(e.target.value as Plant['light_level'])}
                className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="baixa">Baixa luminosidade</option>
                <option value="media_indireta">Luz média indireta</option>
                <option value="alta_indireta">Luz alta indireta</option>
                <option value="sol_pleno">Sol pleno direto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">
                Frequência de Rega
              </label>
              <select
                value={wateringFrequency}
                onChange={(e) => setWateringFrequency(Number(e.target.value))}
                className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={3}>A cada 3 dias (Úmido)</option>
                <option value={5}>A cada 5 dias</option>
                <option value={7}>A cada 7 dias (1x sem)</option>
                <option value={10}>A cada 10 dias</option>
                <option value={14}>A cada 14 dias (2x mês)</option>
                <option value={21}>A cada 21 dias (Suculenta)</option>
              </select>
            </div>
          </div>

          {/* Cover Photo Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-emerald-300">
              Foto de Capa
            </label>
            
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-700/60 bg-black shrink-0">
                <img src={coverPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/40 text-emerald-200 border border-emerald-700/50 text-xs flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carregar Foto</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[10px] text-emerald-400/60">
                  Ou escolha uma foto das espécies comuns abaixo:
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
              {PRESET_PHOTOS.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setCoverPhotoUrl(p.url)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    coverPhotoUrl === p.url ? 'border-emerald-400 ring-2 ring-emerald-500/40 scale-105' : 'border-emerald-950 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  {coverPhotoUrl === p.url && (
                    <div className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">
              Notas e Observações
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Presente de aniversário, substrato aerado com casca de pinus..."
              className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
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
              {initialPlant ? 'Salvar Alterações' : 'Cadastrar Planta'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
