import React, { useState } from 'react';
import { educationalGuides } from '../data/initialData.ts';
import { EducationalGuide, EducationalCategory } from '../types/index.ts';
import { 
  Library, 
  Search, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Lightbulb, 
  Tag as TagIcon,
  CheckCircle2,
  ArrowLeft,
  Share2,
  BookmarkCheck,
  ShieldAlert
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingGuide, setReadingGuide] = useState<EducationalGuide | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'Todos os Conteúdos' },
    { id: 'cuidados_gerais', label: '🌿 Cuidados Gerais' },
    { id: 'observacao_vegetal', label: '🔍 Observação Vegetal' },
    { id: 'saude_vegetal', label: '🩺 Saúde Vegetal' },
    { id: 'manutencao', label: '✂️ Manutenção' },
    { id: 'glossario', label: '📖 Glossário' },
    { id: 'perguntas_frequentes', label: '❓ FAQ & Dúvidas' },
    { id: 'rega', label: '💧 Rega' },
    { id: 'iluminacao', label: '☀️ Iluminação' },
    { id: 'substrato', label: '🌱 Substrato' },
    { id: 'pragas', label: '🐛 Pragas' },
    { id: 'propagacao', label: '🌿 Propagação' },
  ];

  const filteredGuides = educationalGuides.filter(g => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      g.title.toLowerCase().includes(q) || 
      g.subtitle.toLowerCase().includes(q) ||
      g.tags.some(t => t.toLowerCase().includes(q)) ||
      g.body.some(p => p.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  // READER VIEW FOR AN INDIVIDUAL ARTICLE (ETAPA 17 TAREFA 3)
  if (readingGuide) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
        
        {/* Back navigation button */}
        <button
          onClick={() => setReadingGuide(null)}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-hover)] bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] transition-colors cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Biblioteca</span>
        </button>

        {/* Reader Card */}
        <article className="bg-[var(--bg-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--border-subtle)] space-y-6 shadow-sm">
          
          {/* Metadata pill & time */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
              {readingGuide.category.replace('_', ' ')}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{readingGuide.reading_time_minutes} min de leitura estimada</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-serif leading-tight">
              {readingGuide.title}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              {readingGuide.subtitle}
            </p>
          </div>

          {/* Article Body */}
          <div className="space-y-4 text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-sans pt-2">
            {readingGuide.body.map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Practical Tips Box */}
          {readingGuide.tips && readingGuide.tips.length > 0 && (
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Recomendações Práticas do Especialista</span>
              </div>
              <ul className="space-y-2.5">
                {readingGuide.tips.map((tip, i) => (
                  <li key={i} className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Footer & Tags */}
          <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {readingGuide.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="text-[11px] text-[var(--text-muted)] italic">
              Minha Plantinha • Acervo Educativo
            </div>
          </div>

        </article>

      </div>
    );
  }

  // DEFAULT VIEW: LISTING & SEARCH
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Library className="w-5 h-5 text-[var(--accent-primary)]" />
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
            Biblioteca de Conteúdos Educativos
          </h1>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Acervo botânico estruturado por categorias: fundamentos, diagnóstico, glossário e técnicas
        </p>
      </div>

      {/* Database Governance Notice (ETAPA 17 TAREFA 5) */}
      <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)] shadow-sm">
        <BookmarkCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Governança de Conteúdo:</strong> Novos artigos e guias botânicos são administrados diretamente no banco de dados Supabase (tabela <code className="font-mono text-[var(--accent-primary)] bg-[var(--bg-primary)] px-1 py-0.5 rounded">educational_content</code>), com leitura pública protegida por RLS e sem permissão de escrita pelo cliente.
        </p>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3 bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por assunto, praga, técnica de rega ou termo botânico..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] min-h-[44px]"
          />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer min-h-[44px] ${
                selectedCategory === cat.id
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold shadow-sm'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Guides List */}
      <div className="space-y-3">
        {filteredGuides.length === 0 ? (
          <div className="bg-[var(--bg-surface)] p-8 rounded-2xl border border-[var(--border-subtle)] text-center space-y-2 shadow-sm">
            <BookOpen className="w-8 h-8 text-[var(--accent-primary)] mx-auto" />
            <h4 className="font-bold text-[var(--text-primary)] text-sm">Nenhum artigo encontrado</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Tente buscar por termos mais genéricos como "rega", "luz" ou "poda".
            </p>
          </div>
        ) : (
          filteredGuides.map(guide => (
            <div
              key={guide.id}
              onClick={() => setReadingGuide(guide)}
              className="bg-[var(--bg-surface)] rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all cursor-pointer group flex items-start justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                    {guide.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[var(--accent-primary)]" />
                    {guide.reading_time_minutes} min
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] font-serif group-hover:text-[var(--accent-primary)] transition-colors">
                  {guide.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {guide.subtitle}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {guide.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] text-[var(--text-muted)] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="self-center p-2 rounded-xl bg-[var(--bg-primary)] text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--accent-text)] transition-colors shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
