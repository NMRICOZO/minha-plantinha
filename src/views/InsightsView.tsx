import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  calculateRealInsights, 
  calculatePlantSpecificInsights,
  calculateMonthlyDistribution,
  MonthlyCount 
} from '../utils/plantCalculations.ts';
import { 
  BarChart3, 
  ShieldCheck, 
  AlertCircle, 
  Sprout, 
  BookOpen, 
  Camera, 
  Sparkles, 
  Droplets, 
  Calendar, 
  Award,
  Clock,
  Filter,
  TrendingUp,
  Info
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { plants, diaryEntries, plantEvents, setSelectedPlantId, setActiveTab } = useApp();
  const [selectedPlantFilter, setSelectedPlantFilter] = useState<string>('all');

  const globalInsights = calculateRealInsights(plants, diaryEntries, plantEvents);
  const globalMonthlyDistribution = calculateMonthlyDistribution(diaryEntries, 6);

  const selectedPlant = plants.find(p => p.id === selectedPlantFilter);
  const plantInsights = selectedPlant 
    ? calculatePlantSpecificInsights(selectedPlant, diaryEntries, plantEvents) 
    : null;

  // Find max monthly count for chart scaling
  const activeMonthlyData: MonthlyCount[] = plantInsights 
    ? plantInsights.monthlyDistribution 
    : globalMonthlyDistribution;
  const maxMonthlyCount = Math.max(...activeMonthlyData.map(d => d.count), 1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
              Insights Botânicos & Métricas Reais
            </h1>
          </div>
          <p className="text-xs text-emerald-300/70 mt-1">
            Estatísticas 100% derivadas dos seus dados reais — nunca inventadas ou estimadas
          </p>
        </div>

        {/* Filter by Plant or Overview */}
        <div className="flex items-center gap-2 bg-[#091510] p-1.5 rounded-xl border border-emerald-900/50 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-emerald-400 ml-1.5 shrink-0" />
          <select
            value={selectedPlantFilter}
            onChange={(e) => setSelectedPlantFilter(e.target.value)}
            className="bg-transparent text-xs text-emerald-200 font-medium focus:outline-none cursor-pointer pr-2"
          >
            <option value="all" className="bg-[#08100d] text-white">
              🌿 Visão Geral de Todas ({plants.length} plantas)
            </option>
            {plants.map(p => (
              <option key={p.id} value={p.id} className="bg-[#08100d] text-white">
                🌱 {p.name} {p.status === 'archived' ? '(Arquivada)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Strict Data Integrity Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-3 text-xs text-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300">Regra de Integridade Absoluta:</span>
          <p className="text-emerald-400/80 text-[11px] mt-0.5 leading-relaxed">
            Nenhum número aqui é aproximado ou estimado. Se não houver histórico suficiente para calcular médias confiáveis (como menos de 7 dias de dados), o app exibe explicitamente o aviso em vez de projetar valores irreais.
          </p>
        </div>
      </div>

      {/* VIEW: SPECIFIC PLANT SELECTED */}
      {plantInsights && selectedPlant && (
        <div className="space-y-6">
          
          {/* Plant header card */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-emerald-700/50">
                {selectedPlant.cover_photo_url ? (
                  <img 
                    src={selectedPlant.cover_photo_url} 
                    alt={selectedPlant.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-500">
                    <Sprout className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-serif">{selectedPlant.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${
                    selectedPlant.status === 'active' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {selectedPlant.status === 'active' ? 'Ativa' : 'Arquivada'}
                  </span>
                </div>
                {selectedPlant.species && (
                  <p className="text-xs text-emerald-300/70 italic font-serif mt-0.5">
                    {selectedPlant.species}
                  </p>
                )}
                <p className="text-[11px] text-emerald-400/80 font-mono mt-1">
                  Chegou em {selectedPlant.acquired_date} ({plantInsights.trackingFormatted})
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPlantId(selectedPlant.id);
                setActiveTab('plantas');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 text-xs font-semibold cursor-pointer transition-colors"
            >
              Abrir Ficha da Planta →
            </button>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider">Total de Notas</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {plantInsights.totalEntries}
              </div>
              <span className="text-[11px] text-emerald-400/70">{plantInsights.totalPhotos} fotos anexadas</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider">Ações de Cuidado</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {plantInsights.totalEvents}
              </div>
              <span className="text-[11px] text-emerald-400/70">regas, podas e adubos</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider">Média Semanal</span>
              {plantInsights.frequencyPerWeek !== null ? (
                <>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {plantInsights.frequencyPerWeek}
                  </div>
                  <span className="text-[11px] text-emerald-400/70">registros / semana</span>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-amber-300 mt-2 font-mono">Indisponível</div>
                  <span className="text-[10px] text-amber-400/70">Mínimo 7 dias necessários</span>
                </>
              )}
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider">Última Atualização</span>
              {plantInsights.lastUpdateDate ? (
                <>
                  <div className="text-lg sm:text-xl font-bold text-white font-mono pt-1">
                    {plantInsights.daysSinceLastUpdate === 0 
                      ? 'Hoje' 
                      : plantInsights.daysSinceLastUpdate === 1 
                      ? 'Ontem' 
                      : `${plantInsights.daysSinceLastUpdate} dias atrás`}
                  </div>
                  <span className="text-[11px] text-emerald-400/70 font-mono">{plantInsights.lastUpdateDate}</span>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-zinc-400 mt-2">Sem registros</div>
                  <span className="text-[10px] text-zinc-500">Nenhum evento lançado</span>
                </>
              )}
            </div>

          </div>

          {/* Monthly Bar Chart */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Evolução Cronológica de Registros (Últimos 6 Meses)
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400/70 font-mono">
                {plantInsights.totalEntries} registros no total
              </span>
            </div>

            {/* Light CSS Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-40 border-b border-emerald-900/50 pb-2">
                {plantInsights.monthlyDistribution.map((item) => {
                  const heightPercent = maxMonthlyCount > 0 ? Math.round((item.count / maxMonthlyCount) * 100) : 0;
                  return (
                    <div key={item.monthKey} className="flex flex-col items-center h-full justify-end group">
                      {/* Bar Value Indicator */}
                      <span className="text-[10px] font-mono text-emerald-300 font-bold mb-1 opacity-80 group-hover:opacity-100">
                        {item.count > 0 ? item.count : '-'}
                      </span>

                      {/* Visual Bar */}
                      <div className="w-full max-w-[40px] bg-emerald-950/70 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5 border border-emerald-900/40 group-hover:border-emerald-600/60 transition-colors">
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            item.count > 0 
                              ? 'bg-gradient-to-t from-emerald-700 to-emerald-400 shadow-sm' 
                              : 'bg-transparent'
                          }`}
                          style={{ height: `${Math.max(heightPercent, item.count > 0 ? 8 : 0)}%` }}
                        />
                      </div>

                      {/* Month Label */}
                      <span className="text-[10px] font-mono text-emerald-400/70 mt-2 text-center">
                        {item.monthLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-emerald-400/60 italic text-center">
              * Gráfico gerado estritamente a partir das datas reais de registros no diário.
            </p>
          </div>

        </div>
      )}

      {/* VIEW: OVERVIEW (ALL PLANTS) */}
      {!selectedPlant && (
        <div className="space-y-6">
          
          {/* Core Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider">Plantas Ativas</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{globalInsights.activePlants}</div>
              <span className="text-[11px] text-emerald-400/70">de {globalInsights.totalPlants} cadastradas</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider">Notas no Diário</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{globalInsights.totalDiaryEntries}</div>
              <span className="text-[11px] text-emerald-400/70">média de {globalInsights.averageEntriesPerPlant}/planta</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider">Fotos Salvas</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{globalInsights.totalPhotos}</div>
              <span className="text-[11px] text-emerald-400/70">evidências visuais</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-900/40 space-y-1">
              <span className="text-[10px] text-emerald-400/70 uppercase font-bold tracking-wider">Ações de Cuidado</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{globalInsights.totalEvents}</div>
              <span className="text-[11px] text-emerald-400/70">regas, podas e adubos</span>
            </div>

          </div>

          {/* Aggregate Monthly Bar Chart */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Atividade Geral de Registros por Mês (Coleção Completa)
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400/70 font-mono">
                {globalInsights.totalDiaryEntries} registros acumulados
              </span>
            </div>

            {/* Light CSS Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-40 border-b border-emerald-900/50 pb-2">
                {globalMonthlyDistribution.map((item) => {
                  const heightPercent = maxMonthlyCount > 0 ? Math.round((item.count / maxMonthlyCount) * 100) : 0;
                  return (
                    <div key={item.monthKey} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono text-emerald-300 font-bold mb-1 opacity-80 group-hover:opacity-100">
                        {item.count > 0 ? item.count : '-'}
                      </span>

                      <div className="w-full max-w-[40px] bg-emerald-950/70 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5 border border-emerald-900/40 group-hover:border-emerald-600/60 transition-colors">
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            item.count > 0 
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm' 
                              : 'bg-transparent'
                          }`}
                          style={{ height: `${Math.max(heightPercent, item.count > 0 ? 8 : 0)}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400/70 mt-2 text-center">
                        {item.monthLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Highlights: Most Documented & Oldest Plant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Most Documented */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-800/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Planta Mais Documentada</span>
              </div>

              {globalInsights.mostDocumentedPlant ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-emerald-700/50">
                    <img 
                      src={globalInsights.mostDocumentedPlant.plant.cover_photo_url || ''} 
                      alt="Capa" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-base">
                      {globalInsights.mostDocumentedPlant.plant.name}
                    </h4>
                    <p className="text-xs text-emerald-300 font-mono mt-0.5">
                      {globalInsights.mostDocumentedPlant.entryCount} notas no diário • {globalInsights.mostDocumentedPlant.photoCount} fotos
                    </p>
                    <button
                      onClick={() => {
                        setSelectedPlantFilter(globalInsights.mostDocumentedPlant!.plant.id);
                      }}
                      className="mt-2 text-[11px] text-emerald-400 hover:underline cursor-pointer font-medium"
                    >
                      Filtrar métricas desta planta →
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-400/60">Sem dados suficientes ainda.</p>
              )}
            </div>

            {/* Oldest Plant */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-800/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Mais Antiga na Coleção</span>
              </div>

              {globalInsights.oldestPlant ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-emerald-700/50">
                    <img 
                      src={globalInsights.oldestPlant.plant.cover_photo_url || ''} 
                      alt="Capa" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-base">
                      {globalInsights.oldestPlant.plant.name}
                    </h4>
                    <p className="text-xs text-emerald-300 font-mono mt-0.5">
                      {globalInsights.oldestPlant.formattedAge} acompanhada ({globalInsights.oldestPlant.days} dias)
                    </p>
                    <p className="text-[11px] text-emerald-400/70 font-mono mt-0.5">
                      Chegou em {globalInsights.oldestPlant.plant.acquired_date}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-400/60">Sem dados suficientes ainda.</p>
              )}
            </div>

          </div>

          {/* Event Breakdown */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-white">
              Distribuição Real dos Cuidados Realizados
            </h3>

            <div className="space-y-3">
              {(['rega', 'adubacao', 'poda', 'replantio', 'tratamento_pragas', 'outro'] as const).map(type => {
                const count = globalInsights.eventsByType[type] || 0;
                const percentage = globalInsights.totalEvents > 0 ? Math.round((count / globalInsights.totalEvents) * 100) : 0;
                const label = type === 'rega' ? 'Regas' : type === 'adubacao' ? 'Adubações' : type === 'poda' ? 'Podas' : type === 'replantio' ? 'Replantios' : type === 'tratamento_pragas' ? 'Tratamentos contra Pragas' : 'Outros Cuidados';
                
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-emerald-200 capitalize">{label}</span>
                      <span className="font-mono text-emerald-300">{count} vezes ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-emerald-950/80 overflow-hidden border border-emerald-900/50">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plants Needing Attention */}
          {globalInsights.plantsNeedingAttention.length > 0 ? (
            <div className="glass-panel p-5 rounded-2xl border border-amber-800/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Plantas Sem Atualização Recente (&gt; 14 dias)</span>
              </div>
              <p className="text-xs text-amber-200/80">
                Estas plantas não recebem uma foto ou nota no diário há duas semanas ou mais. Registrar fotos frequentes enriquece o comparador visual antes/depois.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {globalInsights.plantsNeedingAttention.map(({ plant, daysWithoutUpdate }) => (
                  <div 
                    key={plant.id}
                    onClick={() => {
                      setSelectedPlantId(plant.id);
                      setActiveTab('plantas');
                    }}
                    className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 hover:border-amber-500/50 transition-colors flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-white">{plant.name}</div>
                      <div className="text-[10px] text-amber-400/80 font-mono">{daysWithoutUpdate} dias sem atualização</div>
                    </div>
                    <span className="text-[11px] text-emerald-400 underline font-medium">Registrar</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Todas as suas plantas ativas estão com diário atualizado nos últimos 14 dias. Excelente dedicação!</span>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
