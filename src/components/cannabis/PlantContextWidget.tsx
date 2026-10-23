import React, { useState, useEffect } from 'react';
import { CannabisPlant } from '../../types/index.ts';
import { GeneticsSheet, PlantContextData, PlantContextAdvice } from '../../types/genetics.ts';
import { geminiGeneticsService } from '../../services/geminiGeneticsService.ts';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Check, 
  ChevronRight,
  Camera
} from 'lucide-react';

interface PlantContextWidgetProps {
  plant: CannabisPlant;
  geneticsSheet?: GeneticsSheet;
  onSyncTargets: (targets: { ph?: number; ec?: number; temp?: number; rh?: number }) => void;
  onOpenPhotoDiagnosis: () => void;
  onAskAI: (query?: string) => void;
}

export const PlantContextWidget: React.FC<PlantContextWidgetProps> = ({
  plant,
  geneticsSheet,
  onSyncTargets,
  onOpenPhotoDiagnosis,
  onAskAI,
}) => {
  const [advice, setAdvice] = useState<PlantContextAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  // Calculate days in stage and total
  const daysInStage = React.useMemo(() => {
    const start = new Date(plant.stage_start_date).getTime();
    return Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
  }, [plant.stage_start_date]);

  const totalDays = React.useMemo(() => {
    const germ = new Date(plant.germination_date).getTime();
    return Math.max(1, Math.floor((Date.now() - germ) / (1000 * 60 * 60 * 24)));
  }, [plant.germination_date]);

  useEffect(() => {
    let isMounted = true;
    const fetchAdvice = async () => {
      setIsLoading(true);
      const contextData: PlantContextData = {
        plant_id: plant.id,
        plant_name: plant.name,
        strain: plant.strain,
        stage: plant.stage,
        medium: plant.medium,
        photoperiod: plant.photoperiod,
        days_in_stage: daysInStage,
        total_days: totalDays,
        pot_size_liters: plant.pot_size_liters,
        environment: 'indoor',
      };

      try {
        const res = await geminiGeneticsService.getPlantAdvice(contextData, geneticsSheet);
        if (isMounted) setAdvice(res);
      } catch (err) {
        console.warn('Erro ao carregar orientações:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAdvice();
    return () => {
      isMounted = false;
    };
  }, [plant.id, plant.stage, daysInStage, totalDays, geneticsSheet?.nome]);

  const handleSync = () => {
    if (!advice?.alvos_recomendados) return;
    onSyncTargets({
      ph: advice.alvos_recomendados.ph,
      ec: advice.alvos_recomendados.ec,
      temp: advice.alvos_recomendados.temp,
      rh: advice.alvos_recomendados.rh,
    });
    setIsSynced(true);
    setTimeout(() => setIsSynced(false), 3000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] space-y-5 bg-[var(--bg-surface)] shadow-sm">
      
      {/* Header with Plant Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-hover)] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-hover)] font-bold">
              Contexto do Espécime Ativo
            </span>
          </div>

          <h3 className="font-bold text-lg text-[var(--text-primary)] font-serif flex items-center gap-2">
            <span>{plant.name}</span>
            <span className="text-xs font-normal text-[var(--accent-hover)] italic font-sans">
              ({plant.strain})
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-secondary)] mt-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] capitalize">
              Fase: {plant.stage.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              Dia {daysInStage} nesta fase ({totalDays}d total)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] capitalize">
              {plant.medium.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Action button to sync recommended targets */}
        {advice?.alvos_recomendados && (
          <button
            onClick={handleSync}
            disabled={isSynced}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center ${
              isSynced
                ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
            title="Ajustar metas de pH, EC, Temp e UR no perfil deste espécime"
          >
            {isSynced ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Metas Sincronizadas!</span>
              </>
            ) : (
              <>
                <Sliders className="w-4 h-4 text-[var(--accent-hover)]" />
                <span>Sincronizar Metas Ideais</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Recommended Targets Bar */}
      {advice?.alvos_recomendados && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">pH Recomendado</span>
            <strong className="text-[var(--text-primary)] font-mono text-sm">{advice.alvos_recomendados.ph}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">EC Ideal</span>
            <strong className="text-[var(--accent-hover)] font-mono text-sm">{advice.alvos_recomendados.ec} mS</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">Temp Ideal</span>
            <strong className="text-[var(--accent-secondary)] font-mono text-sm">{advice.alvos_recomendados.temp}°C</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">Umidade UR</span>
            <strong className="text-[var(--text-secondary)] font-mono text-sm">{advice.alvos_recomendados.rh}%</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] col-span-2 sm:col-span-1">
            <span className="text-[9px] text-[var(--text-muted)] uppercase block font-mono">VPD Recomendado</span>
            <strong className="text-[var(--accent-hover)] font-mono text-sm">{advice.alvos_recomendados.vpd}</strong>
          </div>
        </div>
      )}

      {/* Two Column Directives: O Que Fazer Agora & Alertas Próxima Semana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* O que fazer agora */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold text-sm font-serif">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-hover)]" />
            <span>O Que Fazer Agora (2 a 3 dias)</span>
          </div>

          {isLoading ? (
            <div className="space-y-2 py-2">
              <div className="h-4 bg-[var(--bg-surface-hover)] rounded animate-pulse w-3/4" />
              <div className="h-4 bg-[var(--bg-surface-hover)] rounded animate-pulse w-full" />
              <div className="h-4 bg-[var(--bg-surface-hover)] rounded animate-pulse w-5/6" />
            </div>
          ) : (
            <ul className="space-y-2 text-[var(--text-secondary)] leading-relaxed">
              {advice?.o_que_fazer_agora.map((action, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hover)] shrink-0 mt-1.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Alertas da Próxima Semana */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-amber-900/40 space-y-2.5">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm font-serif">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Alertas da Próxima Semana</span>
          </div>

          {isLoading ? (
            <div className="space-y-2 py-2">
              <div className="h-4 bg-[var(--bg-surface-hover)] rounded animate-pulse w-4/5" />
              <div className="h-4 bg-[var(--bg-surface-hover)] rounded animate-pulse w-2/3" />
            </div>
          ) : (
            <ul className="space-y-2 text-amber-200/90 leading-relaxed">
              {advice?.alertas_proxima_semana.map((alert, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Bottom Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <button
          onClick={onOpenPhotoDiagnosis}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Camera className="w-4 h-4 text-[var(--accent-hover)]" />
          <span>Diagnosticar Saúde por Foto</span>
        </button>

        <button
          onClick={() => onAskAI(`Como devo proceder no estágio atual (${plant.stage}) para a ${plant.strain}?`)}
          className="min-h-[44px] px-3 py-2 text-[var(--accent-hover)] hover:underline font-medium flex items-center gap-1 cursor-pointer"
        >
          <span>Perguntar ao assistente sobre este espécime</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
