import React, { useState, useMemo, memo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Plant, PlantEvent, DiaryEntry } from '../types/index.ts';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  BookOpen, 
  Calendar as CalendarIcon
} from 'lucide-react';

interface CalendarViewProps {
  onOpenNewEvent: (plantId?: string, defaultDate?: string) => void;
  onOpenNewDiary: (plantId?: string) => void;
}

// 1. Memoized Calendar Event Item Row
const CalendarEventRow = memo(({
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
    <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-base shrink-0">
          {iconEmoji}
        </span>
        <div>
          <div className="font-bold text-[var(--text-primary)]">{plant?.name || 'Planta'}</div>
          <div className="text-[11px] text-[var(--text-secondary)] capitalize">
            {event.event_type} {event.notes ? `• ${event.notes}` : ''}
          </div>
        </div>
      </div>

      <span className="text-[10px] text-[var(--accent-primary)] font-mono">Concluído</span>
    </div>
  );
});
CalendarEventRow.displayName = 'CalendarEventRow';

// 2. Memoized Calendar Diary Item Row
const CalendarDiaryRow = memo(({
  entry,
  plant
}: {
  entry: DiaryEntry;
  plant?: Plant;
}) => (
  <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2 text-xs">
    <div className="flex items-center justify-between">
      <span className="font-bold text-[var(--accent-primary)] flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
        {plant?.name || 'Planta'} (Registro no Diário)
      </span>
      <span className="text-[11px] text-[var(--text-muted)] font-mono">{entry.entry_time}</span>
    </div>
    <p className="text-[var(--text-secondary)] leading-relaxed">{entry.content}</p>
  </div>
));
CalendarDiaryRow.displayName = 'CalendarDiaryRow';

export const CalendarView: React.FC<CalendarViewProps> = ({
  onOpenNewEvent
}) => {
  const { plants, diaryEntries, plantEvents } = useApp();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  const plantMap = useMemo(() => {
    const map = new Map<string, Plant>();
    plants.forEach(p => map.set(p.id, p));
    return map;
  }, [plants]);

  // Find events & entries for selected date
  const eventsForSelectedDay = useMemo(() => {
    return plantEvents.filter(e => e.event_date === selectedDateStr);
  }, [plantEvents, selectedDateStr]);

  const diaryForSelectedDay = useMemo(() => {
    return diaryEntries.filter(e => e.entry_date === selectedDateStr);
  }, [diaryEntries, selectedDateStr]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
            Calendário de Cuidados
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Acompanhe o cronograma de regas, adubações e notas do diário
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenNewEvent(undefined, selectedDateStr)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Adicionar Cuidado</span>
          </button>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-[var(--bg-surface)] rounded-2xl p-4 sm:p-6 border border-[var(--border-subtle)] space-y-4 shadow-sm">
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] capitalize font-serif flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[var(--accent-primary)]" />
            <span>{monthName}</span>
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-xs font-medium cursor-pointer min-h-[44px]"
            >
              Hoje
            </button>
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs">
          {/* Weekday labels */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dayName, idx) => (
            <div key={idx} className="font-bold text-[var(--text-muted)] py-1 text-[11px]">
              {dayName}
            </div>
          ))}

          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-14 sm:h-20 rounded-xl bg-[var(--bg-primary)]/40 border border-transparent" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDateStr === dayStr;
            const isToday = new Date().toISOString().split('T')[0] === dayStr;

            const dayEvents = plantEvents.filter(e => e.event_date === dayStr);
            const dayDiary = diaryEntries.filter(e => e.entry_date === dayStr);
            const hasActivity = dayEvents.length > 0 || dayDiary.length > 0;

            return (
              <div
                key={dayStr}
                onClick={() => setSelectedDateStr(dayStr)}
                className={`h-14 sm:h-20 rounded-xl p-1.5 text-left flex flex-col justify-between border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] shadow-sm ring-1 ring-[var(--accent-primary)]'
                    : isToday
                    ? 'bg-[var(--bg-primary)] border-2 border-[var(--accent-secondary)]'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-semibold ${
                    isSelected ? 'text-[var(--accent-primary)] font-bold' : isToday ? 'text-[var(--accent-secondary)] font-bold' : 'text-[var(--text-primary)]'
                  }`}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)]" />
                  )}
                </div>

                {/* Day Activity Indicators */}
                {hasActivity && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {dayEvents.some(e => e.event_type === 'rega') && (
                      <span className="w-2 h-2 rounded-full bg-cyan-500" title="Rega" />
                    )}
                    {dayEvents.some(e => e.event_type === 'adubacao') && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Adubação" />
                    )}
                    {dayEvents.some(e => e.event_type === 'poda') && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" title="Poda" />
                    )}
                    {dayDiary.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" title="Diário" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Selected Day Details Panel */}
      <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-base font-serif">
              Acontecimentos de {selectedDateStr}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {eventsForSelectedDay.length} cuidados realizados • {diaryForSelectedDay.length} notas no diário
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenNewEvent(undefined, selectedDateStr)}
              className="px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Cuidado</span>
            </button>
          </div>
        </div>

        {eventsForSelectedDay.length === 0 && diaryForSelectedDay.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--text-muted)]">
            Nenhum registro ou cuidado anotado para este dia.
          </div>
        ) : (
          <div className="space-y-3">
            
            {/* Events */}
            {eventsForSelectedDay.map(ev => (
              <CalendarEventRow
                key={ev.id}
                event={ev}
                plant={plantMap.get(ev.plant_id)}
              />
            ))}

            {/* Diary entries */}
            {diaryForSelectedDay.map(entry => (
              <CalendarDiaryRow
                key={entry.id}
                entry={entry}
                plant={plantMap.get(entry.plant_id)}
              />
            ))}

          </div>
        )}
      </div>

    </div>
  );
};
