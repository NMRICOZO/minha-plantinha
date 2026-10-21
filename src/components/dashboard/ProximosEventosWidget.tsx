import React, { memo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { PlantEvent, Plant } from '../../types/index.ts';
import { Droplets, Plus } from 'lucide-react';

interface ProximosEventosWidgetProps {
  onOpenNewEvent: (plantId?: string) => void;
}

// Memoized Event Row Item
const EventRowItem = memo(({
  event,
  plant
}: {
  event: PlantEvent;
  plant?: Plant;
}) => {
  const iconEmoji = 
    event.event_type === 'rega' ? '💧' : 
    event.event_type === 'adubacao' ? '✨' : 
    event.event_type === 'poda' ? '✂️' : '🌿';

  return (
    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 flex items-center justify-between text-xs hover:border-emerald-700/40 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-6 h-6 rounded-md bg-emerald-900/60 flex items-center justify-center text-xs shrink-0">
          {iconEmoji}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-emerald-200 truncate">
            {plant?.name || 'Planta'}
          </div>
          <div className="text-[10px] text-emerald-400/60 capitalize">
            {event.event_type} • {event.event_date}
          </div>
        </div>
      </div>

      <span className="text-[10px] text-emerald-400/80 font-mono shrink-0 ml-2">
        Feito
      </span>
    </div>
  );
});
EventRowItem.displayName = 'EventRowItem';

export const ProximosEventosWidget: React.FC<ProximosEventosWidgetProps> = memo(({
  onOpenNewEvent
}) => {
  const { plants, plantEvents, setActiveTab } = useApp();

  const plantMap = React.useMemo(() => {
    const map = new Map<string, Plant>();
    plants.forEach(p => map.set(p.id, p));
    return map;
  }, [plants]);

  const recentEvents = React.useMemo(() => {
    return [...plantEvents]
      .sort((a, b) => b.event_date.localeCompare(a.event_date))
      .slice(0, 5);
  }, [plantEvents]);

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-800/30 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 flex items-center justify-center text-cyan-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white">
              Histórico de Regas e Cuidados
            </h3>
            <span className="text-[10px] text-emerald-400/60 font-mono">
              {plantEvents.length} cuidados concluídos
            </span>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('calendario')}
          className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium"
        >
          Ver Agenda
        </button>
      </div>

      <div className="space-y-2">
        {recentEvents.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-xs text-emerald-400/60">Nenhum cuidado recente registrado.</p>
          </div>
        ) : (
          recentEvents.map((ev) => (
            <EventRowItem
              key={ev.id}
              event={ev}
              plant={plantMap.get(ev.plant_id)}
            />
          ))
        )}
      </div>

      <button
        onClick={() => onOpenNewEvent()}
        className="w-full py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Registrar Novo Cuidado</span>
      </button>
    </div>
  );
});
ProximosEventosWidget.displayName = 'ProximosEventosWidget';
