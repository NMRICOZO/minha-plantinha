import React, { useState, useRef } from 'react';
import { PhotoDiagnosisResult, PlantContextData } from '../../types/genetics.ts';
import { geminiGeneticsService } from '../../services/geminiGeneticsService.ts';
import { 
  Camera, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ShieldAlert, 
  ChevronRight
} from 'lucide-react';

interface PhotoDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantContext?: PlantContextData;
  onAskAIWithPhoto?: (diagnosis: PhotoDiagnosisResult, photoUrl: string) => void;
}

export const PhotoDiagnosisModal: React.FC<PhotoDiagnosisModalProps> = ({
  isOpen,
  onClose,
  plantContext,
  onAskAIWithPhoto,
}) => {
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PhotoDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido (JPEG, PNG ou WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunDiagnosis = async () => {
    if (!photoBase64) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const diag = await geminiGeneticsService.diagnosePhoto(
        photoBase64,
        'image/jpeg',
        plantContext
      );
      setResult(diag);
    } catch (err: any) {
      setError(err?.message || 'Falha ao analisar a foto. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPhotoBase64(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center text-[var(--accent-hover)] border border-[var(--border-subtle)]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] font-serif">
                Diagnóstico Fitossanitário por Foto
              </h3>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Análise com Gemini 3.8 Flash • Foco em Deficiências, Pragas & pH
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar diagnóstico por foto"
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Upload Area / Image Preview */}
          {!photoBase64 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border-strong)] hover:border-[var(--accent-hover)] rounded-2xl p-8 text-center cursor-pointer transition-all bg-[var(--bg-secondary)] space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 mx-auto rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--accent-hover)] border border-[var(--border-subtle)] shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-[var(--text-primary)] font-serif">
                  Selecione ou fotografe a folha afetada
                </p>
                <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto">
                  Dica: use luz neutra e enquadre a folha ou ramo com foco nítido para maior precisão diagnóstica.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-black border border-[var(--border-subtle)] shadow-sm">
                <img
                  src={photoBase64}
                  alt="Planta para diagnóstico"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 min-h-[44px] px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-rose-300 text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Trocar Foto</span>
                </button>
              </div>

              {/* Action button to analyze if not analyzed yet */}
              {!result && (
                <button
                  onClick={handleRunDiagnosis}
                  disabled={isAnalyzing}
                  className="w-full min-h-[44px] py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-[var(--accent-text)]" />
                      <span>Analisando padrões foliares com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[var(--accent-text)]" />
                      <span>Iniciar Diagnóstico Fitossanitário</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-300">
              
              {/* Needs better photo alert if lighting was insufficient */}
              {result.precisa_mais_fotos && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Foto com Iluminação ou Ângulo Limitado</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {result.orientacoes_foto || 'Para garantir certeza fitossanitária sem especular, recomendamos capturar uma foto sob luz branca natural aproximando das nervuras foliares.'}
                  </p>
                </div>
              )}

              {/* Visual Description */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-bold text-[var(--text-primary)] text-xs block font-serif">
                  Descrição Visual Observada
                </span>
                <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                  {result.descricao_visual}
                </p>

                {/* Identified Symptoms Pills */}
                {result.sinais_identificados && result.sinais_identificados.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {result.sinais_identificados.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] text-[var(--accent-hover)] font-mono"
                      >
                        🔍 {symptom}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Possible Causes List */}
              <div className="space-y-2">
                <span className="font-bold text-[var(--text-primary)] text-xs block font-serif">
                  Possíveis Causas Identificadas
                </span>
                <div className="space-y-2">
                  {result.possiveis_causas.map((cause, idx) => {
                    const isHealthy = cause.tipo === 'saudavel';
                    const isHigh = cause.gravidade === 'alta';
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          isHealthy
                            ? 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                            : isHigh
                            ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                            : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                        } space-y-1`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[var(--text-primary)] font-serif">
                            {cause.titulo}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono uppercase font-bold ${
                            isHealthy
                              ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-hover)]'
                              : isHigh
                              ? 'bg-rose-900/60 text-rose-300'
                              : 'bg-amber-900/60 text-amber-300'
                          }`}>
                            Gravidade: {cause.gravidade}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-90">
                          {cause.explicacao}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold text-xs font-serif">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-hover)]" />
                  <span>Próximos Passos Recomendados (Ordem Agronômica)</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {result.proximos_passos.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-[var(--accent-hover)] font-bold shrink-0">{idx + 1}.</span>
                      <span>{step.replace(/^\d+[\.\-\)]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ask AI in Chat Button */}
              {onAskAIWithPhoto && photoBase64 && (
                <button
                  onClick={() => onAskAIWithPhoto(result, photoBase64)}
                  className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Abrir no Chat com a IA para debater este diagnóstico</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
          <span>Minha Plantinha • Diagnóstico Seguro</span>
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
