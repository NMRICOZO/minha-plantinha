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
  Eye, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Layers,
  Palette
} from 'lucide-react';

export const DesignPreviewView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedTheme, setSelectedTheme] = useState<'horta' | 'cannabis'>('horta');
  const [activeTabSample, setActiveTabSample] = useState<'visao_geral' | 'fases' | 'cuidados'>('visao_geral');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-150">
      
      {/* Top Banner & Theme Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary">Guia de Estilo (Ambiente Interno)</Badge>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">Tokens Centralizados</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif">
            Design System & Componentes Base
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Alterne o atributo <code className="bg-black/40 px-1.5 py-0.5 rounded text-[11px] text-[var(--accent-hover)] font-mono">data-theme</code> para inspecionar a adaptação em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Selector Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
            <button
              onClick={() => setSelectedTheme('horta')}
              aria-label="Selecionar Tema Horta Tradicional"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTheme === 'horta'
                  ? 'bg-[#c2593f] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              🍅 Horta Tradicional
            </button>
            <button
              onClick={() => setSelectedTheme('cannabis')}
              aria-label="Selecionar Tema Cannabis Medicinal"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTheme === 'cannabis'
                  ? 'bg-[#10b981] text-[#040907] font-bold shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              🍁 Cannabis Medicinal
            </button>
          </div>

          <Button variant="secondary" size="sm" onClick={onBack}>
            ← Voltar ao App
          </Button>
        </div>
      </div>

      {/* THEMED CONTAINER: Everything inside responds to data-theme */}
      <div 
        data-theme={selectedTheme} 
        className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-10 transition-colors duration-250 shadow-md"
      >
        
        {/* Section 1: Palette Swatches with Hex Codes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif flex items-center gap-2">
              <Palette className="w-5 h-5 text-[var(--accent-hover)]" />
              <span>1. Paleta de Cores Ativa ({selectedTheme === 'horta' ? 'Horta Tradicional' : 'Cannabis Medicinal'})</span>
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-mono">Tokens Semânticos</span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {selectedTheme === 'horta' 
              ? 'Tons de areia, linho, argila mineral e terracota queimado com contraste mínimo WCAG AA em todas as superfícies.' 
              : 'Verdes botânicos profundos, esmeralda viva, detalhes âmbar de resina e contraste óptico para cultivo técnico.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
              <div 
                className="w-full h-12 rounded-lg border border-[var(--border-strong)]" 
                style={{ backgroundColor: 'var(--bg-primary)' }} 
              />
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                {selectedTheme === 'horta' ? '#141311' : '#060e0a'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">Fundo Primário</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
              <div 
                className="w-full h-12 rounded-lg border border-[var(--border-strong)]" 
                style={{ backgroundColor: 'var(--bg-secondary)' }} 
              />
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                {selectedTheme === 'horta' ? '#1a1916' : '#091611'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">Fundo Elevado</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
              <div 
                className="w-full h-12 rounded-lg border border-[var(--border-strong)]" 
                style={{ backgroundColor: 'var(--bg-surface)' }} 
              />
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                {selectedTheme === 'horta' ? '#22201c' : '#0d2018'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">Card / Superfície</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
              <div 
                className="w-full h-12 rounded-lg" 
                style={{ backgroundColor: 'var(--accent-primary)' }} 
              />
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                {selectedTheme === 'horta' ? '#c2593f' : '#10b981'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">Destaque Primário</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
              <div 
                className="w-full h-12 rounded-lg" 
                style={{ backgroundColor: 'var(--accent-hover)' }} 
              />
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                {selectedTheme === 'horta' ? '#de7355' : '#34d399'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">Acento Solar / Hover</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
              <div 
                className="w-full h-12 rounded-lg" 
                style={{ backgroundColor: 'var(--color-alert)' }} 
              />
              <span className="text-xs font-mono font-bold text-[var(--text-primary)] block">
                {selectedTheme === 'horta' ? '#d97706' : '#f59e0b'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">Âmbar Alerta / Tricoma</span>
            </div>
          </div>
        </section>

        {/* Section 2: Shared Typography Hierarchy */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--accent-hover)]" />
            <span>2. Hierarquia Tipográfica Compartilhada</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Apenas 2 fontes estruturais: <strong>Playfair Display</strong> para títulos botânicos e <strong>Plus Jakarta Sans</strong> para leitura técnica e formulários.
          </p>

          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
            <div>
              <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Título Botânico Editorial (Playfair Display Bold 700)</span>
              <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)] tracking-tight">
                {selectedTheme === 'horta' ? 'Tomateiro Cereja Selvagem' : 'Gorilla Glue #4 (GG4)'}
              </h3>
            </div>

            <div>
              <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Nome Científico / Linhagem (Playfair Display Italic 400)</span>
              <p className="text-sm font-serif italic text-[var(--text-secondary)]">
                {selectedTheme === 'horta' ? 'Solanum lycopersicum var. cerasiforme' : 'Sour Dubb × Chem Sis × Chocolate Diesel'}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Texto Corrido de Cuidados (Plus Jakarta Sans Regular 400)</span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                O equilíbrio entre oxigenação radicular e retenção hídrica no substrato determina o vigor inicial da brotação. Monitorar as pontas das folhas antes de cada ciclo de fertilização mineral.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">Métricas Agronômicas & Leituras de Sensor (font-mono Medium 500)</span>
              <p className="text-xs font-mono font-medium text-[var(--accent-hover)]">
                Dia 42 • pH 6.2 • EC 1.4 mS/cm • 24.5°C • 62% UR • VPD 1.1 kPa
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Standardized Base Components (Buttons, Cards, Inputs, Tabs, Badges) */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--accent-hover)]" />
            <span>3. Componentes Base Padronizados</span>
          </h2>

          {/* Buttons */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)] block">Botões (Button.tsx)</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Botão Primário</Button>
              <Button variant="secondary">Botão Secundário</Button>
              <Button variant="outline">Contorno</Button>
              <Button variant="ghost">Fantasma</Button>
              <Button variant="destructive">Excluir</Button>
              <Button variant="primary" size="sm">Pequeno (sm)</Button>
              <Button variant="primary" size="lg">Grande (lg)</Button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)] block">Etiquetas / Badges (Badge.tsx)</span>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="primary">Ativa</Badge>
              <Badge variant="secondary">Outdoor / Sol</Badge>
              <Badge variant="alert">Rega Pendente</Badge>
              <Badge variant="neutral">Colheita em 14d</Badge>
              <Badge variant="outline">Orgânico</Badge>
            </div>
          </div>

          {/* Tabs Navigation Standard */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)] block">Abas de Navegação</span>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit">
              {[
                { id: 'visao_geral', label: 'Visão Geral' },
                { id: 'fases', label: 'Fases do Cultivo' },
                { id: 'cuidados', label: 'Histórico & Regas' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabSample(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTabSample === tab.id
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome da Espécie ou Strain"
              placeholder="Ex: Manjericão Roxo ou OG Kush"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="Exibido na visualização principal e no diário"
            />
            <Input
              label="Campo com Validação Ativa"
              placeholder="Digite algo"
              value="Dado com erro de exemplo"
              readOnly
              error="Verifique o formato antes de prosseguir"
            />
          </div>

          {/* Standardized Card Sample */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)] block">Card Padrão (Card.tsx)</span>
            <Card className="max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="primary">Semana 4</Badge>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">+28 dias</span>
                </div>
                <CardTitle>{selectedTheme === 'horta' ? 'Alecrim Silvestre' : 'Northern Lights'}</CardTitle>
                <CardDescription>
                  {selectedTheme === 'horta' 
                    ? 'Regado com água solarizada há 2 dias. Brotação vigorosa.' 
                    : 'Fotoperíodo 18/6h. Desenvolvimento saudável de ramos secundários.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Ambiente:</span>
                    <span className="font-medium text-[var(--text-primary)]">Indoor / Substrato</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Próxima Ação:</span>
                    <span className="font-medium text-[var(--accent-hover)]">Adubação rica em P/K</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <span className="font-mono text-[var(--text-muted)]">12 notas • 4 fotos</span>
                <Button size="sm" variant="primary">Ver Detalhes →</Button>
              </CardFooter>
            </Card>
          </div>

        </section>

      </div>

    </div>
  );
};
