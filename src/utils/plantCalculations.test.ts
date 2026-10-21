import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateDaysBetween, 
  calculatePlantAge, 
  calculatePlantMilestones, 
  calculateRealInsights,
  calculatePlantSpecificInsights,
  calculateMonthlyDistribution
} from './plantCalculations.ts';
import type { Plant, DiaryEntry, PlantEvent } from '../types/index.ts';

test('calculateDaysBetween calculates accurate day differences', () => {
  assert.equal(calculateDaysBetween('2026-01-01', '2026-01-10'), 9);
  assert.equal(calculateDaysBetween('2026-05-01', '2026-05-01'), 0);
  assert.equal(calculateDaysBetween('2025-12-30', '2026-01-01'), 2);
});

test('calculatePlantAge formats readable botanical age in Portuguese', () => {
  const age0 = calculatePlantAge('2026-10-17', '2026-10-17');
  assert.equal(age0.formatted, 'Chegou hoje');
  assert.equal(age0.days, 0);

  const age14 = calculatePlantAge('2026-10-03', '2026-10-17');
  assert.equal(age14.days, 14);
  assert.equal(age14.weeks, 2);

  const ageYear = calculatePlantAge('2025-10-17', '2026-10-17');
  assert.equal(ageYear.years, 1);
  assert.match(ageYear.formatted, /1 ano/);
});

test('calculatePlantMilestones accurately measures photo spans and counts', () => {
  const dummyPlant: Plant = {
    id: 'p1',
    user_id: 'u1',
    name: 'Monstera Deliciosa',
    acquired_date: '2026-08-01',
    status: 'active',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z'
  };

  const dummyEntries: DiaryEntry[] = [
    {
      id: 'e1',
      plant_id: 'p1',
      user_id: 'u1',
      entry_date: '2026-08-05',
      content: 'Primeira folha nova brotando!',
      photos: [
        { id: 'ph1', entry_id: 'e1', user_id: 'u1', storage_path: '/img1.jpg', display_order: 0, created_at: '2026-08-05T12:00:00Z' }
      ],
      tags: [],
      created_at: '2026-08-05T12:00:00Z'
    },
    {
      id: 'e2',
      plant_id: 'p1',
      user_id: 'u1',
      entry_date: '2026-09-15',
      content: 'Folha completamente aberta com fenestrações.',
      photos: [
        { id: 'ph2', entry_id: 'e2', user_id: 'u1', storage_path: '/img2.jpg', display_order: 0, created_at: '2026-09-15T12:00:00Z' }
      ],
      tags: [],
      created_at: '2026-09-15T12:00:00Z'
    }
  ];

  const milestones = calculatePlantMilestones(dummyPlant, dummyEntries);
  assert.equal(milestones.totalEntries, 2);
  assert.equal(milestones.totalPhotos, 2);
  assert.equal(milestones.firstPhotoDate, '2026-08-05');
  assert.equal(milestones.latestPhotoDate, '2026-09-15');
  assert.equal(milestones.growthDaysSpan, 41);
});

test('calculateRealInsights calculates strict factual counts without extrapolating', () => {
  const plants: Plant[] = [
    {
      id: 'p1',
      user_id: 'u1',
      name: 'Ficus Lyrata',
      acquired_date: '2026-01-01',
      status: 'active',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'p2',
      user_id: 'u1',
      name: 'Zamioculca',
      acquired_date: '2026-05-01',
      status: 'archived',
      created_at: '2026-05-01T00:00:00Z',
      updated_at: '2026-05-01T00:00:00Z'
    }
  ];

  const entries: DiaryEntry[] = [
    {
      id: 'e1',
      plant_id: 'p1',
      user_id: 'u1',
      entry_date: '2026-09-01',
      content: 'Cresceu bastante',
      photos: [{ id: 'ph1', entry_id: 'e1', user_id: 'u1', storage_path: '/ficus.jpg', display_order: 0, created_at: '' }],
      tags: [],
      created_at: ''
    }
  ];

  const events: PlantEvent[] = [
    { id: 'ev1', plant_id: 'p1', user_id: 'u1', event_type: 'rega', event_date: '2026-10-10', created_at: '' },
    { id: 'ev2', plant_id: 'p1', user_id: 'u1', event_type: 'rega', event_date: '2026-10-15', created_at: '' },
    { id: 'ev3', plant_id: 'p1', user_id: 'u1', event_type: 'adubacao', event_date: '2026-10-12', created_at: '' }
  ];

  const insights = calculateRealInsights(plants, entries, events, '2026-10-17');

  assert.equal(insights.totalPlants, 2);
  assert.equal(insights.activePlants, 1);
  assert.equal(insights.archivedPlants, 1);
  assert.equal(insights.totalPhotos, 1);
  assert.equal(insights.totalEvents, 3);
  assert.equal(insights.eventsByType.rega, 2);
  assert.equal(insights.eventsByType.adubacao, 1);
  assert.equal(insights.mostFrequentEventType, 'rega');
  assert.equal(insights.oldestPlant?.plant.name, 'Ficus Lyrata');
  assert.equal(insights.mostDocumentedPlant?.plant.name, 'Ficus Lyrata');
  // Check attention: last entry was Sep 1, today is Oct 17 (> 14 days)
  assert.equal(insights.plantsNeedingAttention.length, 1);
  assert.equal(insights.plantsNeedingAttention[0].plant.name, 'Ficus Lyrata');
});

test('calculatePlantSpecificInsights and calculateMonthlyDistribution return accurate factual data', () => {
  const plant: Plant = {
    id: 'p1',
    user_id: 'u1',
    name: 'Jiboia Prateada',
    acquired_date: '2026-06-01',
    status: 'active',
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z'
  };

  const entries: DiaryEntry[] = [
    {
      id: 'e1',
      plant_id: 'p1',
      user_id: 'u1',
      entry_date: '2026-09-10',
      content: 'Registro 1',
      photos: [{ id: 'ph1', entry_id: 'e1', user_id: 'u1', storage_path: '/p1.jpg', display_order: 0, created_at: '' }],
      tags: [],
      created_at: ''
    },
    {
      id: 'e2',
      plant_id: 'p1',
      user_id: 'u1',
      entry_date: '2026-10-01',
      content: 'Registro 2',
      photos: [],
      tags: [],
      created_at: ''
    }
  ];

  const events: PlantEvent[] = [
    { id: 'ev1', plant_id: 'p1', user_id: 'u1', event_type: 'rega', event_date: '2026-10-15', created_at: '' }
  ];

  const specific = calculatePlantSpecificInsights(plant, entries, events, '2026-10-17');

  assert.equal(specific.totalEntries, 2);
  assert.equal(specific.totalPhotos, 1);
  assert.equal(specific.totalEvents, 1);
  assert.equal(specific.lastUpdateDate, '2026-10-15');
  assert.equal(specific.daysSinceLastUpdate, 2);
  assert.equal(specific.hasEnoughDataForFrequency, true);
  assert.ok(specific.frequencyPerWeek !== null && specific.frequencyPerWeek > 0);

  const monthly = calculateMonthlyDistribution(entries, 6, '2026-10-17');
  assert.equal(monthly.length, 6);
  // Last month is 2026-10 with 1 entry, previous is 2026-09 with 1 entry
  const oct = monthly.find(m => m.monthKey === '2026-10');
  const sep = monthly.find(m => m.monthKey === '2026-09');
  assert.equal(oct?.count, 1);
  assert.equal(sep?.count, 1);
});

