import React from 'react';
import { GeneticsSheet } from '../../types/genetics.ts';
import { 
  Dna, 
  Sparkles, 
  Layers, 
  Gauge, 
  AlertTriangle, 
  Bookmark, 
  Check, 
  Wind, 
  Bug, 
  CloudRain,
  Flame,
  RotateCcw
} from 'lucide-react';

interface GeneticsSheetCardProps {
  sheet: GeneticsSheet;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onApplyToPlant?: () => void;
  onResetSearch?: () => void;
  plantName?: string;
}

export const GeneticsSheetCard: React.FC<GeneticsSheetCardProps> = ({
  sheet,
  isFavorite = false,
  onToggleFavorite,
  onApplyToPlant,
  onResetSearch,
  plantName,
}) => {
  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'alta':
        return {
          label: 'Confiança Alta',
          bg: 'bg-[var(--accent-primary)]/15 text-[var(--accent-hover)] border-[var(--border-strong)]',
        };
      case 'media':
        return {
          label: 'Confiança Média',
          bg: 'bg-amber-950/60 text-amber-300 border-amber-600/40',
        };
      case 'baixa':
      default:
        return {
          label: 'Confiança Baixa (Dados Estimados)',
          bg: 'bg-rose-950/60 text-rose-300 border-rose-600/40',
        };
    }
  };

  const confidenceBadge = getConfidenceBadge(sheet.confianca);

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] overflow-hidden shadow-sm relative bg-[var(--bg-surface)]">
      
      {/* Top Banner with Strain Name and Actions */}
      <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--bg-secondary)] text-[var(--accent-hover)] border border-[var(--border-subtle)] flex items-center gap-1">
              <Dna className="w-3 h-3 text-[var(--accent-hover)]" />
              Ficha Técnica
            </span>

            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${confidenceBadge.bg}`}>
              {confidenceBadge.label}
            </span>

            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] uppercase">
              {sheet.fotoperiodo_ou_auto === 'automatica' ? 'Autoflorescente' : 'Fotoperíodo'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
            {sheet.nome}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
            {sheet.breeder && (
              <span>
                Breeder: <strong className="text-[var(--text-secondary)]">{sheet.breeder}</strong>
              </span>
            )}
            {sheet.linhagem && (
              <span className="font-mono text-[11px] text-[var(--accent-hover)]">
                Linhagem: {sheet.linhagem}
              </span>
            )}
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-sm'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              aria-label="Alternar favoritos"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          )}

          {onResetSearch && (
            <button
              onClick={onResetSearch}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] text-xs border border-[var(--border-subtle)] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Pesquisar outra genética"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nova Busca</span>
            </button>
          )}
        </div>
      </div>

      {/* Uncertainty Notice (when confidence is low or strain is rare) */}
      {sheet.observacao_incerteza && (
        <div className="px-5 py-3 bg-amber-950/20 border-b border-amber-900/40 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Observação agronômica:</strong> {sheet.observacao_incerteza}
          </p>
        </div>
      )}

      {/* Vital Metrics Grid */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Core Characteristic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Proporção Genética</span>
            <span className="font-bold text-[var(--text-primary)] text-sm">
              {sheet.proporcao_indica_sativa_ruderalis}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Tempo de Floração</span>
            <span className="font-bold text-[var(--accent-secondary)] text-sm font-mono">
              {sheet.tempo_floracao_dias}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Ciclo Total Estimado</span>
            <span className="font-bold text-[var(--accent-hover)] text-sm font-mono">
              {sheet.ciclo_total_dias}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase block font-mono">Nível de Manejo</span>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    level <= sheet.nivel_dificuldade
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]'
                      : 'bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {level}
                </div>
              ))}
              <span className="ml-1 text-[11px] text-[var(--text-secondary)] font-mono">
                {sheet.nivel_dificuldade === 1
                  ? 'Iniciante'
                  : sheet.nivel_dificuldade <= 3
                  ? 'Médio'
                  : 'Avançado'}
              </span>
            </div>
          </div>

        </div>

        {/* Height, Yield and Cannabinoids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          
          {/* Cannabinoid Profile */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-1.5 text-[var(--accent-secondary)] font-semibold font-serif">
              <Flame className="w-4 h-4" />
              <span>Canabinoides Médios</span>
            </div>
            <div className="flex items-center justify-between font-mono pt-1 text-sm">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">THC</span>
                <span className="font-bold text-[var(--accent-hover)]">{sheet.faixa_thc_cbd.thc}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[var(--text-muted)] block">CBD</span>
                <span className="font-bold text-[var(--text-primary)]">{sheet.faixa_thc_cbd.cbd}</span>
              </div>
            </div>
          </div>

          {/* Plant Height */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-1.5 text-[var(--accent-hover)] font-semibold font-serif">
              <Layers className="w-4 h-4" />
              <span>Altura Esperada</span>
            </div>
            <div className="flex items-center justify-between font-mono pt-1 text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Final da Vega</span>
                <span className="font-bold text-[var(--text-primary)]">{sheet.altura_esperada.vega}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[var(--text-muted)] block">Altura Final</span>
                <span className="font-bold text-[var(--text-primary)]">{sheet.altura_esperada.final}</span>
              </div>
            </div>
          </div>

          {/* Yield */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-1.5 text-[var(--accent-hover)] font-semibold font-serif">
              <Gauge className="w-4 h-4" />
              <span>Produção Estimada</span>
            </div>
            <div className="flex items-center justify-between font-mono pt-1 text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Indoor</span>
                <span className="font-bold text-[var(--text-secondary)]">{sheet.producao_estimada.indoor}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[var(--text-muted)] block">Outdoor</span>
                <span className="font-bold text-[var(--text-secondary)]">{sheet.producao_estimada.outdoor}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Terpenes & Aroma Flavor Profile */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 font-serif">
              <Sparkles className="w-4 h-4 text-[var(--accent-secondary)]" />
              Terpenos Dominantes & Bouquet Aromático
            </span>
          </div>

          {/* Terpenes Pills */}
          <div className="flex flex-wrap gap-1.5">
            {sheet.terpenos_dominantes.map((terpene, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-mono font-medium"
              >
                🌿 {terpene}
              </span>
            ))}
          </div>

          <p className="text-xs text-[var(--text-muted)] italic leading-relaxed pt-1">
            "{sheet.perfil_aroma_sabor}"
          </p>
        </div>

        {/* Plant Tolerances Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--accent-secondary)] font-medium">
              <Wind className="w-4 h-4" />
              <span>Clima & Temperatura</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {sheet.tolerancias.clima}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
            <div className="flex items-center gap-1.5 text-rose-300 font-medium">
              <Bug className="w-4 h-4" />
              <span>Resistência a Pragas</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {sheet.tolerancias.pragas}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
            <div className="flex items-center gap-1.5 text-teal-300 font-medium">
              <CloudRain className="w-4 h-4" />
              <span>Resistência a Mofo</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {sheet.tolerancias.mofo}
            </p>
          </div>
        </div>

      </div>

      {/* Card Footer: Apply metrics to active plant */}
      {onApplyToPlant && (
        <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[var(--text-muted)]">
            {plantName ? (
              <>
                Deseja sincronizar as métricas de pH e EC ideais na planta <strong className="text-[var(--text-primary)]">"{plantName}"</strong>?
              </>
            ) : (
              'Sincronize as faixas de pH, EC e clima recomendadas com seu espécime.'
            )}
          </span>

          <button
            onClick={onApplyToPlant}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Salvar Ficha na Planta</span>
          </button>
        </div>
      )}

    </div>
  );
};
