import React, { useState, useEffect } from 'react';
import { CannabisPlant } from '../../types/index.ts';
import { GeneticsSheet, PlantContextData } from '../../types/genetics.ts';
import { geminiGeneticsService } from '../../services/geminiGeneticsService.ts';
import { GeneticsSheetCard } from './GeneticsSheetCard.tsx';
import { CultivationPhasesAccordion } from './CultivationPhasesAccordion.tsx';
import { PlantContextWidget } from './PlantContextWidget.tsx';
import { PhotoDiagnosisModal } from './PhotoDiagnosisModal.tsx';
import { GeneticsChatDrawer } from './GeneticsChatDrawer.tsx';
import { 
  Dna, 
  Search, 
  Sparkles, 
  Bookmark, 
  Camera, 
  MessageSquare, 
  Sprout, 
  AlertTriangle, 
  Check, 
  Layers,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface GeneticsAssistantTabProps {
  plants: CannabisPlant[];
  onUpdatePlantTargets?: (plantId: string, targets: { ph?: number; ec?: number; temp?: number; rh?: number }) => void;
  onOpenGlobalChat?: () => void;
}

const QUICK_STRAINS = [
  { name: 'Gorilla Glue #4', breeder: 'GG Strains' },
  { name: 'OG Kush', breeder: 'Cali Elite' },
  { name: 'Northern Lights', breeder: 'Sensi Seeds' },
  { name: 'Amnesia Haze', breeder: 'Super Strains' },
  { name: 'Gelato 33', breeder: 'Cookie Fam' },
];

export const GeneticsAssistantTab: React.FC<GeneticsAssistantTabProps> = ({
  plants,
  onUpdatePlantTargets,
}) => {
  const [strainInput, setStrainInput] = useState('');
  const [breederInput, setBreederInput] = useState('');
  const [selectedPlantId, setSelectedPlantId] = useState<string>(plants[0]?.id || '');
  
  const [currentSheet, setCurrentSheet] = useState<GeneticsSheet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);
  const [chatInitialPhoto, setChatInitialPhoto] = useState<string | undefined>(undefined);

  // Favorites
  const [favorites, setFavorites] = useState<GeneticsSheet[]>(() => geminiGeneticsService.getFavorites());

  // Currently selected plant object
  const activePlant = plants.find((p) => p.id === selectedPlantId);

  // If user selects a plant, pre-fill strain input if empty
  const handleSelectPlant = (plantId: string) => {
    setSelectedPlantId(plantId);
    const plant = plants.find((p) => p.id === plantId);
    if (plant && !currentSheet) {
      setStrainInput(plant.strain);
    }
  };

  // Perform search / generate sheet
  const handleSearch = async (strainToSearch?: string, breederToSearch?: string) => {
    const strain = (strainToSearch || strainInput).trim();
    const breeder = (breederToSearch !== undefined ? breederToSearch : breederInput).trim();

    if (!strain) {
      setError('Por favor, informe o nome da strain ou genética de cannabis.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sheet = await geminiGeneticsService.getGeneticsSheet(
        strain,
        breeder || undefined,
        activePlant?.medium || 'solo_organico',
        'indoor'
      );
      setCurrentSheet(sheet);
    } catch (err: any) {
      setError(err?.message || 'Falha ao consultar genética. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!currentSheet) return;
    geminiGeneticsService.toggleFavorite(currentSheet);
    setFavorites(geminiGeneticsService.getFavorites());
  };

  const handleApplyToPlant = (targets?: { ph?: number; ec?: number; temp?: number; rh?: number }) => {
    if (!activePlant || !onUpdatePlantTargets) return;
    if (targets) {
      onUpdatePlantTargets(activePlant.id, targets);
    } else if (currentSheet) {
      // Find matching phase or default
      const currentPhase = currentSheet.plano_fases?.find(
        (p) => p.fase_id === activePlant.stage
      );
      const phVal = currentPhase?.ph_rega ? parseFloat(currentPhase.ph_rega) : 6.2;
      const ecVal = currentPhase?.ec_ppm ? parseFloat(currentPhase.ec_ppm) : 1.4;
      onUpdatePlantTargets(activePlant.id, {
        ph: isNaN(phVal) ? 6.2 : phVal,
        ec: isNaN(ecVal) ? 1.4 : ecVal,
        temp: 24,
        rh: 55,
      });
    }
    alert(`As métricas da genética "${currentSheet?.nome || activePlant.strain}" foram salvas no espécime "${activePlant.name}"!`);
  };

  const plantContextData: PlantContextData | undefined = activePlant
    ? {
        plant_id: activePlant.id,
        plant_name: activePlant.name,
        strain: activePlant.strain,
        stage: activePlant.stage,
        medium: activePlant.medium,
        photoperiod: activePlant.photoperiod,
        days_in_stage: Math.max(1, Math.floor((Date.now() - new Date(activePlant.stage_start_date).getTime()) / (1000 * 60 * 60 * 24))),
        total_days: Math.max(1, Math.floor((Date.now() - new Date(activePlant.germination_date).getTime()) / (1000 * 60 * 60 * 24))),
        pot_size_liters: activePlant.pot_size_liters,
        environment: 'indoor',
      }
    : undefined;

  return (
    <div className="space-y-6">
      
      {/* 1. Genetics Search / Generator Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0d261c] via-[#091a13] to-[#06110d] space-y-4 shadow-xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-700/50">
                <Dna className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Inteligência Genética & Cultivo • Gemini 3.8 Flash
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              Assistente de Genética & Variedades
            </h2>
            <p className="text-xs text-emerald-300/80 mt-1 max-w-xl leading-relaxed">
              Consulte a linhagem, perfil de canabinoides, terpenos e o plano de cultivo exato para qualquer strain de Cannabis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-black/40 hover:bg-emerald-950/70 text-emerald-300 text-xs border border-emerald-800/50 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diagnóstico por Foto</span>
            </button>

            <button
              onClick={() => {
                setChatInitialQuery(undefined);
                setIsChatOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-transform active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Conversar com a IA</span>
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="pt-2 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            
            {/* Strain Name Input */}
            <div className="sm:col-span-5 relative">
              <input
                value={strainInput}
                onChange={(e) => setStrainInput(e.target.value)}
                placeholder="Nome da strain (Ex: Gorilla Glue, OG Kush, Haze...)"
                className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Breeder Input */}
            <div className="sm:col-span-4 relative">
              <input
                value={breederInput}
                onChange={(e) => setBreederInput(e.target.value)}
                placeholder="Breeder / Banco (Opcional)"
                className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Search Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Consultando Genética...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Gerar Ficha Técnica</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Plant Link Selector (if user has cannabis plants) */}
          {plants.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-emerald-400/70 font-mono text-[11px]">
                Vincular ao espécime do seu jardim:
              </span>
              <select
                value={selectedPlantId}
                onChange={(e) => handleSelectPlant(e.target.value)}
                className="bg-[#07140f] border border-emerald-800/50 rounded-xl px-2.5 py-1 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="">Nenhum (Consulta Avulsa)</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    🌱 {p.name} ({p.strain} • {p.stage})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Strain Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
            <span className="text-emerald-400/60 font-mono text-[10px] shrink-0">Sugestões rápidas:</span>
            {QUICK_STRAINS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setStrainInput(q.name);
                  setBreederInput(q.breeder);
                  handleSearch(q.name, q.breeder);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/30 text-[11px] whitespace-nowrap cursor-pointer transition-colors shrink-0"
              >
                {q.name}
              </button>
            ))}
          </div>

        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

      </div>

      {/* 2. Plant Context Widget (if a plant is linked) */}
      {activePlant && (
        <PlantContextWidget
          plant={activePlant}
          geneticsSheet={currentSheet || undefined}
          onSyncTargets={handleApplyToPlant}
          onOpenPhotoDiagnosis={() => setIsPhotoModalOpen(true)}
          onAskAI={(query) => {
            setChatInitialQuery(query);
            setIsChatOpen(true);
          }}
        />
      )}

      {/* 3. Generated Genetics Sheet Card */}
      {currentSheet && (
        <GeneticsSheetCard
          sheet={currentSheet}
          isFavorite={geminiGeneticsService.isFavorite(currentSheet.nome)}
          onToggleFavorite={handleToggleFavorite}
          onApplyToPlant={activePlant ? () => handleApplyToPlant() : undefined}
          onResetSearch={() => {
            setCurrentSheet(null);
            setStrainInput('');
            setBreederInput('');
          }}
          plantName={activePlant?.name}
        />
      )}

      {/* 4. Cultivation Phases Accordion (if sheet is loaded) */}
      {currentSheet?.plano_fases && currentSheet.plano_fases.length > 0 && (
        <CultivationPhasesAccordion
          phases={currentSheet.plano_fases}
          currentPlantStage={activePlant?.stage}
        />
      )}

      {/* 5. Favorites List (if user has bookmarked sheets and no current sheet is open) */}
      {!currentSheet && favorites.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white font-serif flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Genéticas Salvas nos Favoritos</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {favorites.map((fav, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentSheet(fav);
                  setStrainInput(fav.nome);
                  setBreederInput(fav.breeder || '');
                }}
                className="p-4 rounded-2xl bg-[#081510] border border-emerald-900/50 hover:border-emerald-600/50 transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {fav.nome}
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {fav.tempo_floracao_dias}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80 line-clamp-1 font-serif italic">
                  {fav.breeder || 'Breeder clássico'} • {fav.proporcao_indica_sativa_ruderalis}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Discreto Aviso Legal (Requisito 6) */}
      <div className="p-4 rounded-2xl bg-black/40 border border-emerald-950 text-center space-y-1">
        <p className="text-[11px] text-emerald-400/70 font-mono">
          ⚖️ <strong>Aviso legal:</strong> Cultivo sujeito à legislação local. No Brasil, o cultivo pessoal para fins medicinais exige autorização judicial prévia (Habeas Corpus) ou filiação a associação autorizada. Conteúdo de caráter estritamente educativo e de redução de danos botânicos.
        </p>
      </div>

      {/* 7. Modals: Photo Diagnosis and Chat Drawer */}
      <PhotoDiagnosisModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        plantContext={plantContextData}
        onAskAIWithPhoto={(diag, photoUrl) => {
          setIsPhotoModalOpen(false);
          setChatInitialPhoto(photoUrl);
          setChatInitialQuery(
            `Analisei a foto da minha planta. Os sinais detectados foram: ${diag.sinais_identificados?.join(', ') || 'manchas'}. Como posso tratar?`
          );
          setIsChatOpen(true);
        }}
      />

      <GeneticsChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        geneticsSheet={currentSheet || undefined}
        plantContext={plantContextData}
        initialQuery={chatInitialQuery}
        initialPhotoUrl={chatInitialPhoto}
      />

      {/* 8. Floating Action Button "Conversar com a IA" on the Cannabis view */}
      {!isChatOpen && (
        <button
          onClick={() => {
            setChatInitialQuery(undefined);
            setIsChatOpen(true);
          }}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-2xl shadow-emerald-950 border border-emerald-300/40 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Abrir chat com o assistente agronômico"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>Conversar com a IA</span>
        </button>
      )}

    </div>
  );
};
