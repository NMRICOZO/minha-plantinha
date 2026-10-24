import React from 'react';
import { X, ShieldCheck, FileText, Scale, AlertTriangle, Printer } from 'lucide-react';

export type LegalDocType = 'termos' | 'privacidade' | 'cannabis_aviso';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'termos',
}) => {
  const [activeDoc, setActiveDoc] = React.useState<LegalDocType>(initialDoc);

  React.useEffect(() => {
    setActiveDoc(initialDoc);
  }, [initialDoc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-serif">
                Documentos Legais & Diretrizes
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                Texto-Modelo • Versão Beta
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Imprimir documento"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 pt-2 gap-2 overflow-x-auto text-xs font-semibold select-none">
          <button
            onClick={() => setActiveDoc('termos')}
            className={`min-h-[44px] px-3.5 py-2 rounded-t-xl border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeDoc === 'termos'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Termos de Uso</span>
          </button>

          <button
            onClick={() => setActiveDoc('privacidade')}
            className={`min-h-[44px] px-3.5 py-2 rounded-t-xl border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeDoc === 'privacidade'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Política de Privacidade</span>
          </button>

          <button
            onClick={() => setActiveDoc('cannabis_aviso')}
            className={`min-h-[44px] px-3.5 py-2 rounded-t-xl border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeDoc === 'cannabis_aviso'
                ? 'border-amber-400 text-amber-300 bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Aviso Cannabis Medicinal</span>
          </button>
        </div>

        {/* Mandatory Legal Review Banner */}
        <div className="p-3 bg-amber-950/40 border-b border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-mono text-[11px] leading-relaxed">
            [REVISAR COM PROFISSIONAL JURÍDICO/MÉDICO ANTES DO LANÇAMENTO PÚBLICO DEFINITIVO]
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-[var(--text-secondary)] leading-relaxed space-y-5">
          
          {/* 1. TERMOS DE USO */}
          {activeDoc === 'termos' && (
            <div className="space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-2">
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif">
                  Termos e Condições de Uso da Plataforma
                </h3>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  Última atualização: Versão Beta Fechada (Outubro de 2026)
                </span>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  1. Objeto do Aplicativo
                </h4>
                <p>
                  O aplicativo <strong>Minha Plantinha</strong> é uma ferramenta tecnológica de diário visual botânico, monitoramento de rotinas de rega e consultoria informativa assistida por inteligência artificial para jardinagem tradicional e horticultura pessoal.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  2. Natureza Informativa e Não Vinculante das Orientações
                </h4>
                <p>
                  Todas as orientações, diagnósticos visuais e respostas geradas pela plataforma — incluindo os módulos <em>IA Horta</em> e <em>IA Cannabis</em> — possuem caráter estritamente educativo, botânico e informativo. Nenhuma resposta constitui laudo agronômico presencial oficial, prescrição fitossanitária ou garantia de rendimento vegetal.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  3. Responsabilidade do Usuário Cultivador
                </h4>
                <p>
                  O usuário é o único e exclusivo responsável pela veracidade dos dados inseridos, pelo armazenamento e manuseio de insumos agrícolas, fertilizantes e produtos orgânicos, bem como pela observância irrestrita da legislação local e regulamentações pertinentes.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  4. Limites de Uso e Política de Consumo Justo
                </h4>
                <p>
                  Para preservar a estabilidade da infraestrutura e mitigar custos computacionais, a plataforma estabelece limites diários e mensais de consultas de inteligência artificial de acordo com o plano do usuário (Plano Gratuito: 10 consultas/dia; Plano Apoiador: 50 consultas/dia). O uso automatizado, scripts abusivos ou tentativas de engenharia reversa nas rotas de API ensejarão o bloqueio imediato do acesso.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  5. Versão Beta Fechada e Isenção de Garantias
                </h4>
                <p>
                  Este software é fornecido "no estado em que se encontra" (<em>as is</em>) em fase beta. O usuário é encorajado a manter cópias de segurança (backups exportados em formato JSON) de seus registros botânicos periodicamente.
                </p>
              </section>
            </div>
          )}

          {/* 2. POLÍTICA DE PRIVACIDADE */}
          {activeDoc === 'privacidade' && (
            <div className="space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-2">
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif">
                  Política de Privacidade & Proteção de Dados
                </h3>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  Conformidade com os princípios da LGPD (Lei nº 13.709/2018)
                </span>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  1. Princípio da Minimização e Soberania Local dos Dados
                </h4>
                <p>
                  No Minha Plantinha, seus dados botânicos, fotos das suas plantas, anotações de diário e medições de fertirrigação são armazenados <strong>diretamente no navegador do usuário</strong> via tecnologia <em>IndexedDB</em> e <em>LocalStorage</em>.
                </p>
                <p>
                  Não comercializamos, não compartilhamos com anunciantes e não utilizamos suas fotos pessoais para alimentar bancos de dados públicos sem seu consentimento expresso.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  2. Dados Processados nas Consultas de IA
                </h4>
                <p>
                  Quando você realiza uma consulta à <em>IA Horta</em> ou <em>IA Cannabis</em>, apenas os dados contextuais estritamente necessários para formular a resposta (nome da planta, histórico recente de regas, previsão climática local aproximada e a imagem comprimida anexada) são transmitidos via conexão criptografada (HTTPS) ao nosso servidor para processamento via API Google Gemini. Nenhuma chave de API ou credencial sensível reside no navegador do cliente.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  3. Dados Meteorológicos (Open-Meteo)
                </h4>
                <p>
                  As previsões climáticas utilizam coordenadas geográficas aproximadas da cidade configurada. O serviço Open-Meteo é aberto, não armazena logs de IP associados a perfis individuais e não exige rastreadores invasivos de terceiros.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  4. Direitos do Titular (Exportação e Exclusão Total)
                </h4>
                <p>
                  Você possui o direito inalienável de exportar integralmente todos os seus registros botânicos em arquivo JSON estruturado a qualquer momento através da aba <em>Ajustes &gt; Exportar Dados</em>. De igual modo, a exclusão definitiva de todos os registros e fotos locais pode ser realizada em 2 etapas com limpeza irrevogável da base IndexedDB.
                </p>
              </section>
            </div>
          )}

          {/* 3. AVISO LEGAL CANNABIS MEDICINAL */}
          {activeDoc === 'cannabis_aviso' && (
            <div className="space-y-4">
              <div className="border-b border-amber-500/40 pb-2">
                <h3 className="text-base font-bold text-amber-300 font-serif">
                  Aviso Legal, Sanitário & Agronômico sobre Cannabis Medicinal
                </h3>
                <span className="text-[10px] text-amber-400 font-mono">
                  Regulamentação Brasileira • Diretrizes Éticas e Legais Estritas
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-100 text-xs space-y-1.5">
                <span className="font-bold block text-amber-200 uppercase font-mono tracking-wider">
                  ⚠️ Vedações Médicas e Sanitárias Expressas:
                </span>
                <ul className="list-disc list-inside space-y-1 text-amber-200/90 text-[11px]">
                  <li>O aplicativo Minha Plantinha <strong>NÃO realiza prescrição de medicamentos</strong> ou extratos fitoterápicos.</li>
                  <li><strong>NÃO indica dosagens terapêuticas</strong> (mg de canabinoides/dia) para seres humanos.</li>
                  <li><strong>NÃO substitui consultas médicas</strong>, diagnósticos clínicos ou acompanhamento multidisciplinar de saúde.</li>
                  <li>Qualquer decisão terapêutica humana deve ser tomada exclusivamente em conjunto com seu médico prescritor legalmente habilitado.</li>
                </ul>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  1. Finalidade Agronômica e Botânica Exclusiva
                </h4>
                <p>
                  O módulo de Cannabis Medicinal tem finalidade exclusivamente fitotécnica e botânica. Seu propósito é auxiliar cultivadores autorizados e associações de pacientes a monitorar o balanço de nutrientes (pH/EC), fotoperíodo de floração, controle de umidade relativa (evitando proliferação de fungos como Botrytis) e a preservação fitossanitária de seus espécimes vegetais.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  2. Observância Estrita da Legislação Vigente
                </h4>
                <p>
                  No Brasil, o cultivo doméstico de Cannabis sativa L. com finalidade terapêutica e medicinal demanda autorização judicial expressa (Salvo-Conduto / Habeas Corpus preventivo) ou credenciamento junto a órgãos sanitários regulamentares (Anvisa).
                </p>
                <p>
                  A plataforma <strong>repudia expressamente o comércio ilegal</strong>, o tráfico de entorpecentes ou qualquer destinação não terapêutica. O uso da plataforma não outorga imunidade jurídica nem constitui salvo-conduto.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider font-mono">
                  3. Incertezas da Análise Foliar Computacional
                </h4>
                <p>
                  Nenhuma imagem fotográfica isolada permite diagnóstico fitopatológico definitivo. Em cultivo orgânico ou mineral, carências de micronutrientes (como Cálcio e Magnésio) são comumente causadas por bloqueio de absorção decorrente de pH descalibrado, e não pela falta do elemento no substrato. Recomenda-se sempre a aferição instrumental física com medidores calibrados antes de qualquer intervenção com fertilizantes.
                </p>
              </section>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            Documento {activeDoc === 'termos' ? '1 de 3' : activeDoc === 'privacidade' ? '2 de 3' : '3 de 3'}
          </span>
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs cursor-pointer shadow-sm transition-transform active:scale-95"
          >
            Entendido e Ciente
          </button>
        </div>

      </div>
    </div>
  );
};
