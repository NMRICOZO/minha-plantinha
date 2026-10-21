import React, { useState, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Navigation } from './components/Navigation.tsx';
import { DashboardView } from './views/DashboardView.tsx'; // Keep direct import for instantaneous LCP
import { Plant } from './types/index.ts';
import { AuthView } from './views/AuthView.tsx';
import { InstallPrompt } from './components/InstallPrompt.tsx';

// Code-splitting non-initial views and heavy modals via React.lazy to reduce initial JS execution and accelerate LCP
const PlantsView = lazy(() => import('./views/PlantsView.tsx').then(m => ({ default: m.PlantsView })));
const CannabisView = lazy(() => import('./views/CannabisView.tsx').then(m => ({ default: m.CannabisView })));
const DiaryGalleryView = lazy(() => import('./views/DiaryGalleryView.tsx').then(m => ({ default: m.DiaryGalleryView })));
const CalendarView = lazy(() => import('./views/CalendarView.tsx').then(m => ({ default: m.CalendarView })));
const InsightsView = lazy(() => import('./views/InsightsView.tsx').then(m => ({ default: m.InsightsView })));
const LibraryView = lazy(() => import('./views/LibraryView.tsx').then(m => ({ default: m.LibraryView })));
const SettingsView = lazy(() => import('./views/SettingsView.tsx').then(m => ({ default: m.SettingsView })));
const DesignPreviewView = lazy(() => import('./views/DesignPreviewView.tsx').then(m => ({ default: m.DesignPreviewView })));

const WelcomeWalkthroughModal = lazy(() => import('./components/WelcomeWalkthroughModal.tsx').then(m => ({ default: m.WelcomeWalkthroughModal })));
const PlantModal = lazy(() => import('./components/PlantModal.tsx').then(m => ({ default: m.PlantModal })));
const NewDiaryEntryModal = lazy(() => import('./components/NewDiaryEntryModal.tsx').then(m => ({ default: m.NewDiaryEntryModal })));
const NewEventModal = lazy(() => import('./components/NewEventModal.tsx').then(m => ({ default: m.NewEventModal })));
const PhotoLightbox = lazy(() => import('./components/PhotoLightbox.tsx').then(m => ({ default: m.PhotoLightbox })));

// Lightweight transition skeleton for secondary views
const TabLoadingSkeleton = () => (
  <div className="space-y-4 max-w-5xl mx-auto animate-pulse py-4">
    <div className="h-8 w-48 bg-emerald-950/80 rounded-xl" />
    <div className="h-4 w-72 bg-emerald-950/50 rounded-lg" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
      <div className="h-48 bg-emerald-950/40 rounded-2xl border border-emerald-900/30" />
      <div className="h-48 bg-emerald-950/40 rounded-2xl border border-emerald-900/30" />
      <div className="h-48 bg-emerald-950/40 rounded-2xl border border-emerald-900/30" />
    </div>
  </div>
);

function MainApp() {
  const { 
    activeTab, 
    setSelectedPlantId, 
    openComparison, 
    addPlant, 
    updatePlant, 
    toastMessage,
    isAuthenticated,
    isDesignPreviewOpen,
    setIsDesignPreviewOpen,
    isWelcomeOpen,
    setIsWelcomeOpen
  } = useApp();

  // Modal states
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [diaryPlantId, setDiaryPlantId] = useState<string | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventPlantId, setEventPlantId] = useState<string | null>(null);
  const [eventDefaultDate, setEventDefaultDate] = useState<string | undefined>(undefined);

  // Lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string | null;
    caption?: string;
    plantName?: string;
  }>({ url: null });

  const handleOpenNewPlant = (plantToEdit?: Plant) => {
    setEditingPlant(plantToEdit || null);
    setIsPlantModalOpen(true);
  };

  const handleOpenNewDiary = (plantId?: string) => {
    setDiaryPlantId(plantId || null);
    setIsDiaryModalOpen(true);
  };

  const handleOpenNewEvent = (plantId?: string, defaultDate?: string) => {
    setEventPlantId(plantId || null);
    setEventDefaultDate(defaultDate);
    setIsEventModalOpen(true);
  };

  const handleSelectPhoto = (url: string, caption?: string, plantName?: string) => {
    setLightboxPhoto({ url, caption, plantName });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08100d] text-[#e3ece7] flex flex-col justify-center">
        <AuthView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08100d] text-[#e3ece7] flex flex-col">
      {/* Header */}
      <Header
        onOpenNewPlant={() => handleOpenNewPlant()}
        onOpenNewDiary={() => handleOpenNewDiary()}
        onOpenNewEvent={() => handleOpenNewEvent()}
      />

      {/* PWA Install Prompt (mobile & desktop) */}
      <InstallPrompt />

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Navigation Sidebar (Desktop) and Bottom Bar (Mobile) */}
        {!isDesignPreviewOpen && <Navigation />}

        {/* Content Area with Code-Splitting Suspense */}
        <main className="flex-1 px-4 sm:px-6 py-6 pb-24 lg:pb-12 overflow-y-auto">
          {isDesignPreviewOpen ? (
            <Suspense fallback={<TabLoadingSkeleton />}>
              <DesignPreviewView onBack={() => setIsDesignPreviewOpen(false)} />
            </Suspense>
          ) : (
            <>
              {/* Dashboard is mounted directly without async delay to guarantee fast LCP */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  onOpenNewPlant={() => handleOpenNewPlant()}
                  onOpenNewDiary={(plantId) => handleOpenNewDiary(plantId)}
                  onOpenNewEvent={(plantId) => handleOpenNewEvent(plantId)}
                  onSelectPhoto={handleSelectPhoto}
                />
              )}

              {activeTab === 'plantas' && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <PlantsView
                    onOpenNewPlant={handleOpenNewPlant}
                    onOpenNewDiary={(plantId) => handleOpenNewDiary(plantId)}
                    onOpenNewEvent={(plantId) => handleOpenNewEvent(plantId)}
                    onSelectPhoto={handleSelectPhoto}
                  />
                </Suspense>
              )}

              {activeTab === 'cannabis' && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <CannabisView
                    onSelectPhoto={handleSelectPhoto}
                  />
                </Suspense>
              )}

              {activeTab === 'diario' && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <DiaryGalleryView
                    onOpenNewDiary={(plantId) => handleOpenNewDiary(plantId)}
                    onSelectPhoto={handleSelectPhoto}
                  />
                </Suspense>
              )}

              {activeTab === 'calendario' && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <CalendarView
                    onOpenNewEvent={(plantId, date) => handleOpenNewEvent(plantId, date)}
                    onOpenNewDiary={(plantId) => handleOpenNewDiary(plantId)}
                  />
                </Suspense>
              )}

              {activeTab === 'insights' && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <InsightsView />
                </Suspense>
              )}

              {activeTab === 'biblioteca' && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <LibraryView />
                </Suspense>
              )}

              {activeTab === 'configuracoes' && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <SettingsView />
                </Suspense>
              )}
            </>
          )}
        </main>
      </div>

      {/* Lazy-Loaded Global Modals (mounted on-demand) */}
      {isPlantModalOpen && (
        <Suspense fallback={null}>
          <PlantModal
            isOpen={isPlantModalOpen}
            initialPlant={editingPlant}
            onClose={() => {
              setIsPlantModalOpen(false);
              setEditingPlant(null);
            }}
            onSave={(data) => {
              if (editingPlant) {
                updatePlant(editingPlant.id, data);
              } else {
                addPlant(data);
              }
            }}
          />
        </Suspense>
      )}

      {isDiaryModalOpen && (
        <Suspense fallback={null}>
          <NewDiaryEntryModal
            isOpen={isDiaryModalOpen}
            preselectedPlantId={diaryPlantId}
            onClose={() => {
              setIsDiaryModalOpen(false);
              setDiaryPlantId(null);
            }}
          />
        </Suspense>
      )}

      {isEventModalOpen && (
        <Suspense fallback={null}>
          <NewEventModal
            isOpen={isEventModalOpen}
            preselectedPlantId={eventPlantId}
            defaultDate={eventDefaultDate}
            onClose={() => {
              setIsEventModalOpen(false);
              setEventPlantId(null);
              setEventDefaultDate(undefined);
            }}
          />
        </Suspense>
      )}

      {lightboxPhoto.url && (
        <Suspense fallback={null}>
          <PhotoLightbox
            photoUrl={lightboxPhoto.url}
            caption={lightboxPhoto.caption}
            plantName={lightboxPhoto.plantName}
            onClose={() => setLightboxPhoto({ url: null })}
            onOpenComparison={(photoUrl) => {
              const foundPlant = diaryPlantId;
              if (foundPlant) {
                openComparison(foundPlant, photoUrl);
              }
            }}
          />
        </Suspense>
      )}

      {/* Welcome & Personalization Walkthrough Modal (iOS Safari style) */}
      {isWelcomeOpen && (
        <Suspense fallback={null}>
          <WelcomeWalkthroughModal
            isOpen={isWelcomeOpen}
            onClose={() => setIsWelcomeOpen(false)}
          />
        </Suspense>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-[#0e241b] text-emerald-100 border border-emerald-600/50 shadow-2xl px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
