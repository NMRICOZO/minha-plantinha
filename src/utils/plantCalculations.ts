import type { Plant, DiaryEntry, PlantEvent, EventType } from '../types/index.ts';

/**
 * Calculates calendar days between two ISO date strings (YYYY-MM-DD).
 */
export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates humanized age of a plant in Portuguese based on acquisition date.
 */
export function calculatePlantAge(acquiredDateStr: string, currentDateStr?: string): {
  days: number;
  weeks: number;
  months: number;
  years: number;
  formatted: string;
} {
  const nowStr = currentDateStr || new Date().toISOString().split('T')[0];
  const days = Math.max(0, calculateDaysBetween(acquiredDateStr, nowStr));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.4375);
  const years = Math.floor(days / 365);

  let formatted = '';
  if (days === 0) {
    formatted = 'Chegou hoje';
  } else if (days === 1) {
    formatted = '1 dia';
  } else if (days < 30) {
    formatted = `${days} dias (${weeks} sem)`;
  } else if (years < 1) {
    const remDays = Math.floor(days % 30.4375);
    formatted = remDays > 0 ? `${months} ${months === 1 ? 'mês' : 'meses'} e ${remDays}d` : `${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else {
    const remMonths = Math.floor((days % 365) / 30.4375);
    formatted = remMonths > 0 
      ? `${years} ${years === 1 ? 'ano' : 'anos'} e ${remMonths}m` 
      : `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }

  return { days, weeks, months, years, formatted };
}

/**
 * Calculates days since last specific event or diary entry for a plant.
 */
export function calculateLastActionDays(
  plantId: string, 
  events: PlantEvent[], 
  diaryEntries: DiaryEntry[],
  eventType?: EventType
): {
  lastEventDate: string | null;
  daysSinceLastEvent: number | null;
  lastDiaryDate: string | null;
  daysSinceLastDiary: number | null;
} {
  const todayStr = new Date().toISOString().split('T')[0];

  // Find relevant events
  const plantEvents = events.filter(e => e.plant_id === plantId && (!eventType || e.event_type === eventType));
  const sortedEvents = [...plantEvents].sort((a, b) => b.event_date.localeCompare(a.event_date));
  const lastEvent = sortedEvents[0] || null;

  // Find diary entries
  const plantEntries = diaryEntries.filter(e => e.plant_id === plantId);
  const sortedEntries = [...plantEntries].sort((a, b) => b.entry_date.localeCompare(a.entry_date));
  const lastDiary = sortedEntries[0] || null;

  return {
    lastEventDate: lastEvent ? lastEvent.event_date : null,
    daysSinceLastEvent: lastEvent ? Math.max(0, calculateDaysBetween(lastEvent.event_date, todayStr)) : null,
    lastDiaryDate: lastDiary ? lastDiary.entry_date : null,
    daysSinceLastDiary: lastDiary ? Math.max(0, calculateDaysBetween(lastDiary.entry_date, todayStr)) : null,
  };
}

export interface PlantMilestone {
  daysTracked: number;
  totalPhotos: number;
  totalEntries: number;
  firstPhotoDate: string | null;
  latestPhotoDate: string | null;
  growthDaysSpan: number;
}

/**
 * Auto-calculates photo and growth progression milestone data for a plant.
 */
export function calculatePlantMilestones(plant: Plant, entries: DiaryEntry[]): PlantMilestone {
  const plantEntries = entries.filter(e => e.plant_id === plant.id);
  const allPhotos = plantEntries.flatMap(e => e.photos.map(p => ({ ...p, entry_date: e.entry_date })));
  
  const sortedPhotos = allPhotos.sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  const firstPhoto = sortedPhotos[0] || null;
  const latestPhoto = sortedPhotos[sortedPhotos.length - 1] || null;

  const todayStr = new Date().toISOString().split('T')[0];
  const daysTracked = calculateDaysBetween(plant.acquired_date, todayStr);
  
  const growthDaysSpan = (firstPhoto && latestPhoto) 
    ? calculateDaysBetween(firstPhoto.entry_date, latestPhoto.entry_date) 
    : 0;

  return {
    daysTracked: Math.max(0, daysTracked),
    totalPhotos: allPhotos.length,
    totalEntries: plantEntries.length,
    firstPhotoDate: firstPhoto ? firstPhoto.entry_date : null,
    latestPhotoDate: latestPhoto ? latestPhoto.entry_date : null,
    growthDaysSpan: Math.max(0, growthDaysSpan)
  };
}

export interface RealInsightsData {
  totalPlants: number;
  activePlants: number;
  archivedPlants: number;
  deceasedPlants: number;
  giftedPlants: number;
  totalDiaryEntries: number;
  totalPhotos: number;
  totalEvents: number;
  averageEntriesPerPlant: number;
  mostDocumentedPlant: {
    plant: Plant;
    entryCount: number;
    photoCount: number;
  } | null;
  oldestPlant: {
    plant: Plant;
    days: number;
    formattedAge: string;
  } | null;
  newestPlant: {
    plant: Plant;
    acquiredDate: string;
  } | null;
  eventsByType: Record<EventType, number>;
  mostFrequentEventType: EventType | null;
  plantsNeedingAttention: Array<{
    plant: Plant;
    reason: string;
    daysWithoutUpdate: number;
  }>;
  hasEnoughDataForComparisons: boolean;
}

/**
 * Pure function computing REAL botanical insights without ever generating fake or extrapolated statistics.
 */
export function calculateRealInsights(
  plants: Plant[],
  entries: DiaryEntry[],
  events: PlantEvent[],
  todayStr?: string
): RealInsightsData {
  const nowStr = todayStr || new Date().toISOString().split('T')[0];
  const totalPlants = plants.length;
  const activePlants = plants.filter(p => p.status === 'active').length;
  const archivedPlants = plants.filter(p => p.status === 'archived').length;
  const deceasedPlants = plants.filter(p => p.status === 'deceased').length;
  const giftedPlants = plants.filter(p => p.status === 'gifted').length;

  const totalDiaryEntries = entries.length;
  const totalPhotos = entries.reduce((acc, e) => acc + (e.photos ? e.photos.length : 0), 0);
  const totalEvents = events.length;

  const averageEntriesPerPlant = activePlants > 0 ? Number((totalDiaryEntries / activePlants).toFixed(1)) : 0;

  // Most documented plant
  let mostDocumentedPlant: RealInsightsData['mostDocumentedPlant'] = null;
  if (plants.length > 0) {
    let maxEntries = -1;
    for (const plant of plants) {
      const pEntries = entries.filter(e => e.plant_id === plant.id);
      const pPhotos = pEntries.reduce((acc, e) => acc + (e.photos ? e.photos.length : 0), 0);
      if (pEntries.length > maxEntries) {
        maxEntries = pEntries.length;
        mostDocumentedPlant = {
          plant,
          entryCount: pEntries.length,
          photoCount: pPhotos
        };
      }
    }
  }

  // Oldest & newest plants
  let oldestPlant: RealInsightsData['oldestPlant'] = null;
  let newestPlant: RealInsightsData['newestPlant'] = null;
  if (plants.length > 0) {
    const sortedByDate = [...plants].sort((a, b) => a.acquired_date.localeCompare(b.acquired_date));
    const oldest = sortedByDate[0];
    const newest = sortedByDate[sortedByDate.length - 1];
    
    const oldestAge = calculatePlantAge(oldest.acquired_date, nowStr);
    oldestPlant = {
      plant: oldest,
      days: oldestAge.days,
      formattedAge: oldestAge.formatted
    };
    newestPlant = {
      plant: newest,
      acquiredDate: newest.acquired_date
    };
  }

  // Events by type
  const eventsByType: Record<EventType, number> = {
    rega: 0,
    adubacao: 0,
    replantio: 0,
    poda: 0,
    tratamento_pragas: 0,
    outro: 0,
  };
  events.forEach(e => {
    if (eventsByType[e.event_type] !== undefined) {
      eventsByType[e.event_type]++;
    } else {
      eventsByType.outro++;
    }
  });

  let mostFrequentEventType: EventType | null = null;
  let maxEventCount = 0;
  (Object.keys(eventsByType) as EventType[]).forEach(type => {
    if (eventsByType[type] > maxEventCount) {
      maxEventCount = eventsByType[type];
      mostFrequentEventType = type;
    }
  });

  // Plants needing attention (active plants with > 14 days without diary entry or overdue watering)
  const plantsNeedingAttention: RealInsightsData['plantsNeedingAttention'] = [];
  plants.filter(p => p.status === 'active').forEach(plant => {
    const pEntries = entries.filter(e => e.plant_id === plant.id).sort((a, b) => b.entry_date.localeCompare(a.entry_date));
    const lastEntryDate = pEntries[0]?.entry_date || plant.acquired_date;
    const daysSince = calculateDaysBetween(lastEntryDate, nowStr);

    if (daysSince >= 14) {
      plantsNeedingAttention.push({
        plant,
        reason: `${daysSince} dias sem atualização no diário`,
        daysWithoutUpdate: daysSince
      });
    }
  });

  return {
    totalPlants,
    activePlants,
    archivedPlants,
    deceasedPlants,
    giftedPlants,
    totalDiaryEntries,
    totalPhotos,
    totalEvents,
    averageEntriesPerPlant,
    mostDocumentedPlant,
    oldestPlant,
    newestPlant,
    eventsByType,
    mostFrequentEventType,
    plantsNeedingAttention,
    hasEnoughDataForComparisons: totalPlants >= 2 && totalDiaryEntries >= 3
  };
}

export interface MonthlyCount {
  monthKey: string;
  monthLabel: string;
  count: number;
}

const MONTH_NAMES_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/**
 * Calculates real monthly distribution of diary entries for the last N months.
 * No estimated data: counts real entries per calendar month.
 */
export function calculateMonthlyDistribution(
  entries: DiaryEntry[],
  monthsCount: number = 6,
  todayDateStr?: string
): MonthlyCount[] {
  const refDate = todayDateStr ? new Date(todayDateStr + 'T12:00:00') : new Date();
  const months: MonthlyCount[] = [];

  // Generate the last N months in chronological order
  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthLabel = `${MONTH_NAMES_SHORT[month]} ${String(year).slice(2)}`;

    // Count entries whose entry_date starts with monthKey
    const count = entries.filter(e => e.entry_date.startsWith(monthKey)).length;
    months.push({ monthKey, monthLabel, count });
  }

  return months;
}

export interface PlantSpecificInsights {
  plant: Plant;
  totalEntries: number;
  totalPhotos: number;
  totalEvents: number;
  totalTrackingDays: number;
  trackingFormatted: string;
  lastUpdateDate: string | null;
  daysSinceLastUpdate: number | null;
  frequencyPerWeek: number | null;
  frequencyPerMonth: number | null;
  monthlyDistribution: MonthlyCount[];
  hasEnoughDataForFrequency: boolean;
}

/**
 * Calculates strict, un-extrapolated insights for an individual plant.
 */
export function calculatePlantSpecificInsights(
  plant: Plant,
  entries: DiaryEntry[],
  events: PlantEvent[],
  todayStr?: string
): PlantSpecificInsights {
  const nowStr = todayStr || new Date().toISOString().split('T')[0];
  const pEntries = entries.filter(e => e.plant_id === plant.id);
  const pEvents = events.filter(e => e.plant_id === plant.id);

  const totalEntries = pEntries.length;
  const totalPhotos = pEntries.reduce((acc, e) => acc + (e.photos ? e.photos.length : 0), 0);
  const totalEvents = pEvents.length;

  const totalTrackingDays = Math.max(0, calculateDaysBetween(plant.acquired_date, nowStr));
  const trackingFormatted = calculatePlantAge(plant.acquired_date, nowStr).formatted;

  // Find last update date across entries and events
  const entryDates = pEntries.map(e => e.entry_date);
  const eventDates = pEvents.map(e => e.event_date);
  const allDates = [...entryDates, ...eventDates].sort((a, b) => b.localeCompare(a));
  const lastUpdateDate = allDates[0] || null;
  const daysSinceLastUpdate = lastUpdateDate ? Math.max(0, calculateDaysBetween(lastUpdateDate, nowStr)) : null;

  // Strict product rule: if tracking time < 7 days or 0 entries, do not extrapolate
  const hasEnoughDataForFrequency = totalTrackingDays >= 7 && totalEntries > 0;
  
  const frequencyPerWeek = hasEnoughDataForFrequency 
    ? Number((totalEntries / (totalTrackingDays / 7)).toFixed(2)) 
    : null;

  const frequencyPerMonth = (totalTrackingDays >= 28 && totalEntries > 0)
    ? Number((totalEntries / (totalTrackingDays / 30.4375)).toFixed(2))
    : null;

  const monthlyDistribution = calculateMonthlyDistribution(pEntries, 6, nowStr);

  return {
    plant,
    totalEntries,
    totalPhotos,
    totalEvents,
    totalTrackingDays,
    trackingFormatted,
    lastUpdateDate,
    daysSinceLastUpdate,
    frequencyPerWeek,
    frequencyPerMonth,
    monthlyDistribution,
    hasEnoughDataForFrequency
  };
}

