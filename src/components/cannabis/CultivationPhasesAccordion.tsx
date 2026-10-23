import React, { useState } from 'react';
import { CultivationPhasePlan } from '../../types/genetics.ts';
import { CannabisGrowthStage } from '../../types/index.ts';
import { 
  ChevronDown, 
  ChevronUp, 
  Droplets, 
  Scissors, 
  AlertOctagon, 
  Sprout
} from 'lucide-react';

interface CultivationPhasesAccordionProps {
  phases: CultivationPhasePlan[];
  currentPlantStage?: CannabisGrowthStage;
}

const PHASE_STAGE_MAP: Record<string, CannabisGrowthStage> = {
  germinacao: 'germinacao',
  plantula: 'plantula',
  vegetativo: 'vegetativo',
  pre_floracao: 'pre_floracao',
  floracao: 'floracao',
  flush: 'flush',
  secagem: 'secagem',
  cura: 'cura',
};

export const CultivationPhasesAccordion: React.FC<CultivationPhasesAccordionProps> = ({
  phases,
  currentPlantStage,
}) => {
  // Default open phase: open the one that matches currentPlantStage or the first one
  const initialOpenIndex = phases.findIndex(
    p => p.fase_id === currentPlantStage || PHASE_STAGE_MAP[p.fase_id] === currentPlantStage
  );
  
  const [openIndex, setOpenIndex] = useState<number>(
    initialOpenIndex >= 0 ? initialOpenIndex : 0
  );

  const togglePhase = (idx: number) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="font-bold text-base text-[var(--text-primary)] font-serif flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[var(--accent-hover)]" />
            <span>Plano de Cultivo por Fase</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Diretrizes agronômicas passo a passo da germinação à cura para esta genética
          </p>
        </div>
        <span className="text-xs font-mono text-[var(--accent-hover)]">
          8 Fases Guiadas
        </span>
      </div>

      <div className="space-y-2.5">
        {phases.map((phase, idx) => {
          const isOpen = openIndex === idx;
          const isCurrentStage = currentPlantStage && (phase.fase_id === currentPlantStage || PHASE_STAGE_MAP[phase.fase_id] === currentPlantStage);

          return (
            <div
              key={phase.fase_id || idx}
              className={`rounded-2xl transition-all border overflow-hidden ${
                isCurrentStage
                  ? 'bg-[var(--bg-surface)] border-[var(--border-strong)] shadow-sm ring-1 ring-[var(--accent-primary)]/40'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => togglePhase(idx)}
                className="w-full min-h-[44px] p-4 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                    isCurrentStage
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                  }`}>
                    {idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--text-primary)] font-serif">
                        {phase.fase_nome}
                      </span>
                      {isCurrentStage && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-[var(--accent-text)]">
                          Fase Atual
                        </span>
                      )}
                    </div>
                    
                    <span className="text-[11px] text-[var(--text-muted)] font-mono block">
                      {phase.horas_luz} • {phase.temperatura_c} • {phase.umidade_ur}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-xs font-mono hidden sm:inline text-[var(--text-muted)]">
                    {isOpen ? 'Recolher' : 'Detalhes'}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                  
                  {/* Climate & Water Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-3">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">Fotoperíodo</span>
                      <span className="font-bold text-[var(--text-primary)] text-xs">{phase.horas_luz}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">Temp. Ideal</span>
                      <span className="font-bold text-[var(--accent-secondary)] text-xs font-mono">{phase.temperatura_c}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">Umidade (UR)</span>
                      <span className="font-bold text-[var(--text-secondary)] text-xs font-mono">{phase.umidade_ur}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">VPD Recomendado</span>
                      <span className="font-bold text-[var(--accent-hover)] text-xs font-mono">{phase.vpd_kpa}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] col-span-2 sm:col-span-1">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">pH / EC da Calda</span>
                      <span className="font-bold text-[var(--text-primary)] text-xs font-mono">pH {phase.ph_rega}</span>
                    </div>
                  </div>

                  {/* Detailed Directives */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    
                    {/* Watering & Nutrients */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                      <span className="font-semibold text-[var(--accent-hover)] flex items-center gap-1.5 text-xs">
                        <Droplets className="w-3.5 h-3.5 text-[var(--accent-hover)]" />
                        Rega & Nutrição Específica
                      </span>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {phase.frequencia_rega}
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pt-1">
                        <strong className="text-[var(--text-primary)]">Nutrientes:</strong> {phase.nutrientes_cuidados}
                      </p>
                    </div>

                    {/* Pruning & Training */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                      <span className="font-semibold text-[var(--accent-hover)] flex items-center gap-1.5 text-xs">
                        <Scissors className="w-3.5 h-3.5 text-[var(--accent-hover)]" />
                        Podas & Treinamentos Indicados
                      </span>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {phase.podas_treinamentos}
                      </p>
                    </div>

                  </div>

                  {/* Common Pitfalls / Mistakes */}
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-start gap-2.5">
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-rose-300 uppercase block font-mono">
                        Erros Comuns Desta Fase para Evitar:
                      </span>
                      <p className="text-[11px] text-rose-200/90 leading-relaxed">
                        {phase.erros_comuns}
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
