import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { EventType } from '../types/index.ts';
import { X, Droplets, Sparkles, Scissors, RefreshCw, Bug, MoreHorizontal } from 'lucide-react';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPlantId?: string | null;
  defaultDate?: string;
}

const EVENT_OPTIONS: Array<{ type: EventType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }> = [
  { type: 'rega', label: 'Rega', icon: Droplets, desc: 'Hidratação do solo / substrato' },
  { type: 'adubacao', label: 'Adubação', icon: Sparkles, desc: 'Nutrientes (Bokashi, NPK, osmocote)' },
  { type: 'poda', label: 'Poda', icon: Scissors, desc: 'Remoção de folhas secas ou estaquia' },
  { type: 'replantio', label: 'Replantio', icon: RefreshCw, desc: 'Troca de vaso ou renovação de substrato' },
  { type: 'tratamento_pragas', label: 'Tratamento', icon: Bug, desc: 'Óleo de neem, álcool, controle preventivo' },
  { type: 'outro', label: 'Outro Cuidado', icon: MoreHorizontal, desc: 'Limpeza de folhas, tutoramento, etc.' },
];

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  preselectedPlantId,
  defaultDate
}) => {
  const { plants, addPlantEvent } = useApp();

  const [plantId, setPlantId] = useState<string>(() => {
    return preselectedPlantId || (plants[0]?.id ?? '');
  });
  const [eventType, setEventType] = useState<EventType>('rega');
  const [eventDate, setEventDate] = useState<string>(() => {
    return defaultDate || new Date().toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantId) {
      setError('Por favor, selecione a planta.');
      return;
    }
    if (!eventDate) {
      setError('Selecione a data do cuidado.');
      return;
    }

    addPlantEvent({
      plant_id: plantId,
      event_type: eventType,
      event_date: eventDate,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0b1712] border border-emerald-800/50 rounded-2xl shadow-2xl p-5 sm:p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Registrar Cuidado</h2>
              <p className="text-[11px] text-emerald-400/70">
                Mantenha o histórico de regas e manutenção em dia
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
          
          {/* Plant Selection */}
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">
              Planta Cuidada *
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

          {/* Event Type Grid */}
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-2">
              Tipo de Cuidado *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = eventType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setEventType(opt.type)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800/40 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/50'
                        : 'bg-[#07130e] border-emerald-900/50 text-emerald-300/80 hover:border-emerald-700/50 hover:bg-emerald-950/30'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-500'}`} />
                    <div>
                      <div className="font-semibold text-xs text-white">{opt.label}</div>
                      <div className="text-[10px] text-emerald-400/60 line-clamp-1">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">
              Data da Ação *
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-emerald-300 mb-1">
              Observações (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Água da chuva, adubo diluído a 50%, poda de ramos secos..."
              className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
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
              Confirmar Registro
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
