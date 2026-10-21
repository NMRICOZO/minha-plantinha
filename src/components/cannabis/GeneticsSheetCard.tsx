import React from 'react';
import { GeneticsSheet } from '../../types/genetics.ts';
import { 
  Dna, 
  Sparkles, 
  Clock, 
  Layers, 
  Gauge, 
  ShieldCheck, 
  AlertTriangle, 
  Star, 
  Bookmark, 
  Check, 
  Wind, 
  Bug, 
  CloudRain,
  Flame,
  Droplets,
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
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40',
        };
      case 'media':
        return {
          label: 'Confiança Média',
          bg: 'bg-amber-950/80 text-amber-300 border-amber-600/40',
        };
      case 'baixa':
      default:
        return {
          label: 'Confiança Baixa (Dados Estimados)',
          bg: 'bg-rose-950/80 text-rose-300 border-rose-600/40',
        };
    }
  };

  const confidenceBadge = getConfidenceBadge(sheet.confianca);

  return (
    <div className="glass-card rounded-3xl border border-emerald-500/30 overflow-hidden shadow-2xl relative bg-gradient-to-b from-[#0a1c14] to-[#06120d]">
      
      {/* Top Banner with Strain Name and Actions */}
      <div className="p-5 sm:p-6 border-b border-emerald-900/50 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 flex items-center gap-1">
              <Dna className="w-3 h-3 text-emerald-400" />
              Ficha Técnica
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${confidenceBadge.bg}`}>
              {confidenceBadge.label}
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/60 text-cyan-300 border border-white/10 uppercase">
              {sheet.fotoperiodo_ou_auto === 'automatica' ? 'Autoflorescente' : 'Fotoperíodo'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            {sheet.nome}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-300/80">
            {sheet.breeder && (
              <span>
                Breeder: <strong className="text-emerald-200">{sheet.breeder}</strong>
              </span>
            )}
            {sheet.linhagem && (
              <span className="font-mono text-[11px] text-emerald-400/90">
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
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-md'
                  : 'bg-black/40 border-emerald-900/60 text-emerald-400 hover:text-white'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          )}

          {onResetSearch && (
            <button
              onClick={onResetSearch}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-emerald-950/60 text-emerald-300 text-xs border border-emerald-900/50 flex items-center gap-1 transition-colors cursor-pointer"
              title="Pesquisar outra genética"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nova Busca</span>
            </button>
          )}
        </div>
      </div>

      {/* Uncertainty Notice (when confidence is low or strain is rare) */}
      {sheet.observacao_incerteza && (
        <div className="px-5 py-3 bg-amber-950/30 border-b border-amber-900/40 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Observação botânica:</strong> {sheet.observacao_incerteza}
          </p>
        </div>
      )}

      {/* Vital Metrics Grid */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Core Characteristic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-900/40 space-y-1">
            <span className="text-[10px] text-emerald-400/60 uppercase block font-mono">Proporção Genética</span>
            <span className="font-bold text-white text-sm">
              {sheet.proporcao_indica_sativa_ruderalis}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-900/40 space-y-1">
            <span className="text-[10px] text-emerald-400/60 uppercase block font-mono">Tempo de Floração</span>
            <span className="font-bold text-fuchsia-300 text-sm font-mono">
              {sheet.tempo_floracao_dias}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-900/40 space-y-1">
            <span className="text-[10px] text-emerald-400/60 uppercase block font-mono">Ciclo Total Estimado</span>
            <span className="font-bold text-emerald-300 text-sm font-mono">
              {sheet.ciclo_total_dias}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-900/40 space-y-1">
            <span className="text-[10px] text-emerald-400/60 uppercase block font-mono">Nível de Dificuldade</span>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    level <= sheet.nivel_dificuldade
                      ? 'bg-emerald-500 text-emerald-950 shadow-sm'
                      : 'bg-emerald-950/60 text-emerald-800 border border-emerald-900'
                  }`}
                >
                  {level}
                </div>
              ))}
              <span className="ml-1 text-[11px] text-emerald-300 font-mono">
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
          <div className="p-4 rounded-2xl bg-[#091712] border border-emerald-900/50 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Flame className="w-4 h-4" />
              <span>Canabinoides Médios</span>
            </div>
            <div className="flex items-center justify-between font-mono pt-1 text-sm">
              <div>
                <span className="text-[10px] text-emerald-400/60 block">THC</span>
                <span className="font-bold text-emerald-300">{sheet.faixa_thc_cbd.thc}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400/60 block">CBD</span>
                <span className="font-bold text-cyan-300">{sheet.faixa_thc_cbd.cbd}</span>
              </div>
            </div>
          </div>

          {/* Plant Height */}
          <div className="p-4 rounded-2xl bg-[#091712] border border-emerald-900/50 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Layers className="w-4 h-4" />
              <span>Altura Esperada</span>
            </div>
            <div className="flex items-center justify-between font-mono pt-1 text-xs">
              <div>
                <span className="text-[10px] text-emerald-400/60 block">Final da Vega</span>
                <span className="font-bold text-white">{sheet.altura_esperada.vega}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400/60 block">Altura Final</span>
                <span className="font-bold text-white">{sheet.altura_esperada.final}</span>
              </div>
            </div>
          </div>

          {/* Yield */}
          <div className="p-4 rounded-2xl bg-[#091712] border border-emerald-900/50 space-y-2">
            <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
              <Gauge className="w-4 h-4" />
              <span>Produção Estimada</span>
            </div>
            <div className="flex items-center justify-between font-mono pt-1 text-xs">
              <div>
                <span className="text-[10px] text-emerald-400/60 block">Indoor</span>
                <span className="font-bold text-teal-200">{sheet.producao_estimada.indoor}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400/60 block">Outdoor</span>
                <span className="font-bold text-teal-200">{sheet.producao_estimada.outdoor}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Terpenes & Aroma Flavor Profile */}
        <div className="p-4 rounded-2xl bg-black/40 border border-emerald-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Terpenos Dominantes & Bouquet Aromático
            </span>
          </div>

          {/* Terpenes Pills */}
          <div className="flex flex-wrap gap-1.5">
            {sheet.terpenos_dominantes.map((terpene, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-mono font-medium"
              >
                🌿 {terpene}
              </span>
            ))}
          </div>

          <p className="text-xs text-emerald-200/90 italic leading-relaxed pt-1">
            "{sheet.perfil_aroma_sabor}"
          </p>
        </div>

        {/* Plant Tolerances Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-[#081510] border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Wind className="w-3.5 h-3.5" />
              <span>Clima & Temperatura</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              {sheet.tolerancias.clima}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#081510] border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-rose-300 font-medium">
              <Bug className="w-3.5 h-3.5" />
              <span>Resistência a Pragas</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              {sheet.tolerancias.pragas}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#081510] border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
              <CloudRain className="w-3.5 h-3.5" />
              <span>Resistência a Mofo</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              {sheet.tolerancias.mofo}
            </p>
          </div>
        </div>

      </div>

      {/* Card Footer: Apply metrics to active plant */}
      {onApplyToPlant && (
        <div className="p-4 bg-[#05100c] border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-emerald-300/80">
            {plantName ? (
              <>
                Deseja sincronizar as métricas de pH e EC ideais na planta <strong>"{plantName}"</strong>?
              </>
            ) : (
              'Sincronize as faixas de pH, EC e clima recomendadas com seu espécime.'
            )}
          </span>

          <button
            onClick={onApplyToPlant}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Salvar Ficha na Planta</span>
          </button>
        </div>
      )}

    </div>
  );
};
