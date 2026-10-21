import React, { useState } from 'react';
import { Button } from '../components/ui/Button.tsx';
import { Badge } from '../components/ui/Badge.tsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Skeleton } from '../components/ui/Skeleton.tsx';
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Wind, 
  Leaf, 
  TreePine, 
  Compass, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DesignPreviewView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-950/30 border border-amber-800/50">
        <div>
          <Badge variant="amber" className="mb-1">Página de Validação Visual (Etapa 02)</Badge>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif">
            Design System & Componentes Base
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Esta visualização (/design-preview) é temporária para validação dos tokens do Tailwind v4 e deve ser removida antes da Etapa 22.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onBack}>
          ← Voltar ao App
        </Button>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <span>1. Paleta de Cores Botânica (@theme)</span>
        </h2>
        <p className="text-xs text-emerald-400/70">
          Tons profundos inspirados na vegetação de florestas úmidas com contraste WCAG AA validado.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-[#08100d] border border-white/10 space-y-1.5">
            <div className="w-full h-12 rounded-lg bg-[#08100d] border border-white/20" />
            <span className="text-xs font-mono font-bold text-white block">#08100d</span>
            <span className="text-[10px] text-emerald-400/60 block">Fundo Principal</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0b1712] border border-white/10 space-y-1.5">
            <div className="w-full h-12 rounded-lg bg-[#0b1712] border border-white/20" />
            <span className="text-xs font-mono font-bold text-white block">#0b1712</span>
            <span className="text-[10px] text-emerald-400/60 block">Fundo Elevado</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0e2219] border border-white/10 space-y-1.5">
            <div className="w-full h-12 rounded-lg bg-[#0e2219] border border-white/20" />
            <span className="text-xs font-mono font-bold text-white block">#0e2219</span>
            <span className="text-[10px] text-emerald-400/60 block">Cards & Superfícies</span>
          </div>

          <div className="p-3 rounded-xl bg-[#059669] border border-white/10 space-y-1.5">
            <div className="w-full h-12 rounded-lg bg-[#059669]" />
            <span className="text-xs font-mono font-bold text-white block">#059669</span>
            <span className="text-[10px] text-emerald-200 block">Primário Botânico</span>
          </div>

          <div className="p-3 rounded-xl bg-[#10b981] border border-white/10 space-y-1.5">
            <div className="w-full h-12 rounded-lg bg-[#10b981]" />
            <span className="text-xs font-mono font-bold text-emerald-950 block">#10b981</span>
            <span className="text-[10px] text-emerald-950 block">Destaques / Active</span>
          </div>

          <div className="p-3 rounded-xl bg-[#d97706] border border-white/10 space-y-1.5">
            <div className="w-full h-12 rounded-lg bg-[#d97706]" />
            <span className="text-xs font-mono font-bold text-white block">#d97706</span>
            <span className="text-[10px] text-amber-200 block">Alerta / Terra</span>
          </div>
        </div>
      </section>

      {/* 2. Typography Hierarchy */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-400" />
          <span>2. Hierarquia Tipográfica</span>
        </h2>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 space-y-4">
          <div>
            <span className="text-[10px] text-emerald-400/60 uppercase font-mono">H1 / Título Botânico (Playfair Display)</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">Monstera Deliciosa (Costela-de-Adão)</h1>
          </div>

          <div>
            <span className="text-[10px] text-emerald-400/60 uppercase font-mono">H2 / Subtítulo da Seção</span>
            <h2 className="text-xl font-bold text-emerald-200 font-serif">Evolução e Linha do Tempo Visual</h2>
          </div>

          <div>
            <span className="text-[10px] text-emerald-400/60 uppercase font-mono">Body / Texto Corrido (Plus Jakarta Sans)</span>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              As folhas jovens iniciam com lâmina foliar inteira. Conforme a planta recebe luminosidade indireta adequada, as novas brotações surgem com fenestrações e recortes característicos da espécie.
            </p>
          </div>

          <div>
            <span className="text-[10px] text-emerald-400/60 uppercase font-mono">Metadados & Números (Font Mono)</span>
            <p className="text-xs font-mono text-emerald-400">
              IDADE: 6 meses e 5 dias • REGA: a cada 7 dias • FENESTRAÇÕES: 12
            </p>
          </div>
        </div>
      </section>

      {/* 3. Buttons Showcase */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>3. Botões Customizados (Button)</span>
        </h2>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Botão Primário</Button>
            <Button variant="secondary">Botão Secundário</Button>
            <Button variant="outline">Botão Outline</Button>
            <Button variant="ghost">Botão Ghost</Button>
            <Button variant="destructive">Destrutivo</Button>
            <Button variant="primary" isLoading>Carregando</Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="primary" size="sm">Pequeno (sm)</Button>
            <Button variant="primary" size="md">Padrão (md)</Button>
            <Button variant="primary" size="lg">Grande (lg)</Button>
            <Button variant="secondary" size="icon" title="Ícone">
              <Sprout className="w-4 h-4 text-emerald-400" />
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Badges */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>4. Badges de Status & Tags</span>
        </h2>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 flex flex-wrap gap-2.5">
          <Badge variant="botanical">#nova_folha</Badge>
          <Badge variant="amber">Alerta Moderado</Badge>
          <Badge variant="cyan">💧 Rega Hoje</Badge>
          <Badge variant="rose">Crítico: Vento Forte</Badge>
          <Badge variant="neutral">Ativa na Coleção</Badge>
          <Badge variant="outline">+42 dias de evolução</Badge>
        </div>
      </section>

      {/* 5. Inputs & Form Elements */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          <span>5. Campos de Formulário (Input)</span>
        </h2>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nome da Planta"
            placeholder="Ex: Ficus Lyrata"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            helperText="Nome coloquial ou de afeto que você dá à planta"
          />

          <Input
            label="Campo com Validação Ativa"
            placeholder="Digite algo com erro"
            value="Entrada inválida"
            readOnly
            error="O campo não atende aos critérios mínimos"
          />
        </div>
      </section>

      {/* 6. Skeletons (Loading States) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <TreePine className="w-5 h-5 text-emerald-400" />
          <span>6. Skeletons de Carregamento (Shimmer Botânico)</span>
        </h2>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="w-12 h-12 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </section>

      {/* 7. Icon Library Guidelines */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <span>7. Diretrizes da Biblioteca de Ícones (Lucide React)</span>
        </h2>

        <div className="glass-card p-5 rounded-2xl border border-emerald-900/40 space-y-3 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-emerald-200">
            <strong>Regra Estrita de Identidade:</strong> Não utilizar ícones genéricos de tecnologia ou negócios (foguetes, lâmpadas incandescentes clássicas, engrenagens robóticas). Todas as representações visuais devem dialogar com o universo botânico:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-2 text-emerald-200">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Plantas & Brotações</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Rega & Umidade</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Luminosidade</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Ventilação</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
