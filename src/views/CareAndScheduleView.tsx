import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Calendar as CalendarIcon, 
  Bug, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  Plus, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Droplets,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { CalendarView } from './CalendarView.tsx';
import { LibraryView } from './LibraryView.tsx';
import { InsightsView } from './InsightsView.tsx';

interface CareAndScheduleViewProps {
  onOpenNewEvent: (plantId?: string, defaultDate?: string) => void;
  onOpenNewDiary: (plantId?: string) => void;
  initialSubTab?: 'agenda' | 'pragas' | 'biblioteca' | 'metricas';
}

// Practical catalog of botanical pests and organic treatment protocol
interface PestGuideItem {
  id: string;
  name: string;
  scientificName: string;
  severity: 'moderada' | 'alta' | 'critica';
  symptoms: string[];
  organicTreatment: string[];
  prevention: string;
  targetMedium: 'folhas' | 'solo_substrato' | 'brotos_novos';
}

const COMMON_PESTS: PestGuideItem[] = [
  {
    id: 'pest-1',
    name: 'Cochonilha Branca (Farinhenta)',
    scientificName: 'Pseudococcidae',
    severity: 'alta',
    symptoms: [
      'Massas brancas cotonosas nas axilas das folhas e caules',
      'Líquido pegajoso (honeydew) nas folhas inferiores',
      'Amarelecimento e queda prematura de folhas novas'
    ],
    organicTreatment: [
      'Remover focos visíveis com cotonete embebido em álcool 70%',
      'Pulverizar solução de óleo de neem (1%) com sabão neutro ao entardecer',
      'Repetir a aplicação a cada 5 dias por 3 semanas consecutivas'
    ],
    prevention: 'Evitar excesso de nitrogênio e manter boa circulação de ar.',
    targetMedium: 'folhas'
  },
  {
    id: 'pest-2',
    name: 'Ácaro-Rajado (Spider Mites)',
    scientificName: 'Tetranychus urticae',
    severity: 'critica',
    symptoms: [
      'Pontilhado clorótico (pequenos pontos amarelos/bronze) na face superior',
      'Finas teias de aranha sob as folhas e ápices vegetativos',
      'Folhas opacas com textura áspera e ressecada'
    ],
    organicTreatment: [
      'Lavar a planta no chuveiro com jato moderado de água em temperatura ambiente',
      'Aumentar a umidade relativa do ar (ácaros proliferam em ar quente e seco)',
      'Aplicar acaricida biológico, enxofre solúvel ou óleo de neem prensado a frio'
    ],
    prevention: 'Manter a umidade do ar acima de 55% e inspecionar o verso das folhas com lupa.',
    targetMedium: 'folhas'
  },
  {
    id: 'pest-3',
    name: 'Mosca-dos-Fungos (Fungus Gnats)',
    scientificName: 'Bradysia spp.',
    severity: 'moderada',
    symptoms: [
      'Pequenos mosquitos pretos sobrevoando a superfície do vaso',
      'Larvas microscópicas transparentes alimentando-se de radículas jovens',
      'Lentidão no crescimento da planta por dano radicular'
    ],
    organicTreatment: [
      'Deixar os primeiros 3 a 5 cm do substrato secarem completamente entre as regas',
      'Polvilhar terra de diatomáceas na superfície seca do substrato',
      'Instalar armadilhas adesivas amarelas próximas ao nível do solo'
    ],
    prevention: 'Nunca deixar água empoçada nos pratos coletores e utilizar substratos bem aerados.',
    targetMedium: 'solo_substrato'
  },
  {
    id: 'pest-4',
    name: 'Pulgões (Afídeos)',
    scientificName: 'Aphididae',
    severity: 'moderada',
    symptoms: [
      'Pequenos insetos verdes, amarelos ou pretos aglomerados em brotos tenros',
      'Folhas jovens nascendo deformadas ou enrugadas',
      'Presença de formigas atraídas pela secreção doce açucarada'
    ],
    organicTreatment: [
      'Jato mecânico de água para derrubar as colônias',
      'Pulverização de calda de sabão de potássio ou sabão de coco a 2%',
      'Uso de macerado de fumo ou óleo mineral leve'
    ],
    prevention: 'Preservar inimigos naturais como joaninhas e crisopídeos.',
    targetMedium: 'brotos_novos'
  },
  {
    id: 'pest-5',
    name: 'Oídio (Fungo Branco Pulverulento)',
    scientificName: 'Erysiphales',
    severity: 'alta',
    symptoms: [
      'Pó branco aveludado na superfície de folhas maduras',
      'Necrose foliar se a infecção não for contida rapidamente',
      'Comum em ambientes sombreados e com ventilação deficiente'
    ],
    organicTreatment: [
      'Pulverizar solução de leite cru a 10% (1 parte de leite para 9 de água sob sol da manhã)',
      'Bicarbonato de sódio a 0,5% com algumas gotas de detergente neutro',
      'Remoção cuidadosa de folhas severamente atingidas para descarte'
    ],
    prevention: 'Garantir boa ventilação e espaçamento entre os vasos.',
    targetMedium: 'folhas'
  }
];

export const CareAndScheduleView: React.FC<CareAndScheduleViewProps> = ({
  onOpenNewEvent,
  onOpenNewDiary,
  initialSubTab = 'agenda'
}) => {
  const { plants, setActiveTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'agenda' | 'pragas' | 'biblioteca' | 'metricas'>(initialSubTab);
  const [pestSearch, setPestSearch] = useState('');
  const [selectedPest, setSelectedPest] = useState<PestGuideItem | null>(null);

  const filteredPests = useMemo(() => {
    if (!pestSearch.trim()) return COMMON_PESTS;
    const q = pestSearch.toLowerCase();
    return COMMON_PESTS.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.scientificName.toLowerCase().includes(q) ||
      p.symptoms.some(s => s.toLowerCase().includes(q))
    );
  }, [pestSearch]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* 1. Header & Navigation Subtabs (44px min height touch targets) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] font-mono">
              Gestão Fitossanitária & Rotina
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-mono">
              Central Integrada
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
            Cuidados & Agenda
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Cronograma de regas, identificação de pragas, guias botânicos e métricas de evolução.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenNewEvent()}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Registrar Cuidado</span>
          </button>
        </div>
      </div>

      {/* 2. Subtabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('agenda')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'agenda'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Agenda & Calendário</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pragas')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'pragas'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Pragas & Sintomas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('biblioteca')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'biblioteca'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Biblioteca de Cuidados</span>
        </button>

        <button
          onClick={() => setActiveSubTab('metricas')}
          className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'metricas'
              ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas & Histórico</span>
        </button>
      </div>

      {/* 3. Subtab Content */}
      {activeSubTab === 'agenda' && (
        <CalendarView
          onOpenNewEvent={onOpenNewEvent}
          onOpenNewDiary={onOpenNewDiary}
        />
      )}

      {activeSubTab === 'pragas' && (
        <div className="space-y-6">
          
          {/* AI Horta Real Assistant Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[var(--text-primary)] font-serif">
                    IA Horta • Diagnóstico Visual de Folhas
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Real • Gemini
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xl">
                  Análise fitopatológica de manchas, clorose e pragas com recomendações práticas e dosagens orgânicas personalizadas.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('ia_horta')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] text-xs font-semibold shrink-0 cursor-pointer transition-transform active:scale-95 shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Abrir IA Horta</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={pestSearch}
              onChange={(e) => setPestSearch(e.target.value)}
              placeholder="Buscar por praga, sintoma (ex: pontinhos brancos, teia, pegajoso)..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {/* Pests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPests.map((pest) => (
              <div
                key={pest.id}
                className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] font-serif">
                        {pest.name}
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] italic font-mono">
                        {pest.scientificName}
                      </p>
                    </div>

                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${
                      pest.severity === 'critica'
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : pest.severity === 'alta'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-teal-500/15 text-teal-400 border-teal-500/30'
                    }`}>
                      Severidade: {pest.severity}
                    </span>
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-1.5 mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
                      Sintomas Visíveis:
                    </span>
                    <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                      {pest.symptoms.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Organic Treatment */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-hover)] font-mono block">
                      Tratamento Orgânico Recomendado:
                    </span>
                    <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                      {pest.organicTreatment.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Local: {pest.targetMedium.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => onOpenNewEvent(undefined)}
                    className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Registrar Tratamento</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPests.length === 0 && (
            <div className="p-12 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
              Nenhuma praga ou sintoma correspondeu à sua busca.
            </div>
          )}

        </div>
      )}

      {activeSubTab === 'biblioteca' && (
        <LibraryView />
      )}

      {activeSubTab === 'metricas' && (
        <InsightsView />
      )}

    </div>
  );
};

export default CareAndScheduleView;
