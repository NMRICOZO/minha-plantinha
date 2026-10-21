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
          className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 px-3.5 py-2 rounded-xl border border-emerald-800/40 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Biblioteca</span>
        </button>

        {/* Reader Card */}
        <article className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-800/40 space-y-6">
          
          {/* Metadata pill & time */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/40 pb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
              {readingGuide.category.replace('_', ' ')}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingGuide.reading_time_minutes} min de leitura estimada</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif leading-tight">
              {readingGuide.title}
            </h1>
            <p className="text-sm sm:text-base text-emerald-200/80 leading-relaxed font-light">
              {readingGuide.subtitle}
            </p>
          </div>

          {/* Article Body */}
          <div className="space-y-4 text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans pt-2">
            {readingGuide.body.map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Practical Tips Box */}
          {readingGuide.tips && readingGuide.tips.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-[#0e241b] border border-emerald-700/50 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Recomendações Práticas do Especialista</span>
              </div>
              <ul className="space-y-2.5">
                {readingGuide.tips.map((tip, i) => (
                  <li key={i} className="text-xs sm:text-sm text-emerald-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Footer & Tags */}
          <div className="pt-6 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {readingGuide.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="text-[11px] text-emerald-500/70 italic">
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
          <Library className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
            Biblioteca de Conteúdos Educativos
          </h1>
        </div>
        <p className="text-xs text-emerald-300/70 mt-1">
          Acervo botânico estruturado por categorias: fundamentos, diagnóstico, glossário e técnicas
        </p>
      </div>

      {/* Database Governance Notice (ETAPA 17 TAREFA 5) */}
      <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 flex items-start gap-2.5 text-xs text-emerald-300/80">
        <BookmarkCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Governança de Conteúdo:</strong> Novos artigos e guias botânicos são administrados diretamente no banco de dados Supabase (tabela <code className="font-mono text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded">educational_content</code>), com leitura pública protegida por RLS e sem permissão de escrita pelo cliente.
        </p>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3 bg-[#0a1812] p-4 rounded-2xl border border-emerald-900/40">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-emerald-500/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por assunto, praga, técnica de rega ou termo botânico..."
            className="w-full bg-[#07130e] border border-emerald-800/40 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-emerald-600/60 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-emerald-950 font-bold shadow-sm'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/50'
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
          <div className="glass-card p-8 rounded-2xl border border-emerald-900/40 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-emerald-500/40 mx-auto" />
            <h4 className="font-bold text-white text-sm">Nenhum artigo encontrado</h4>
            <p className="text-xs text-emerald-400/60">
              Tente buscar por termos mais genéricos como "rega", "luz" ou "poda".
            </p>
          </div>
        ) : (
          filteredGuides.map(guide => (
            <div
              key={guide.id}
              onClick={() => setReadingGuide(guide)}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-900/40 hover:border-emerald-600/50 transition-all cursor-pointer group flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800/40">
                    {guide.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-emerald-400/60 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {guide.reading_time_minutes} min
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-white font-serif group-hover:text-emerald-300 transition-colors">
                  {guide.title}
                </h3>

                <p className="text-xs text-emerald-200/80 leading-relaxed line-clamp-2">
                  {guide.subtitle}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {guide.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] text-emerald-400/60 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="self-center p-2 rounded-xl bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-emerald-950 transition-colors shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
