import React, { useState, useRef } from 'react';
import { PhotoDiagnosisResult, PlantContextData } from '../../types/genetics.ts';
import { geminiGeneticsService } from '../../services/geminiGeneticsService.ts';
import { 
  Camera, 
  UploadCloud, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ShieldAlert, 
  ChevronRight,
  Info
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
      <div className="w-full max-w-xl bg-[#0a1b14] border border-emerald-600/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-emerald-950/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-900/80 flex items-center justify-center text-emerald-400 border border-emerald-700/50">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Diagnóstico Fitossanitário por Foto
              </h3>
              <span className="text-[11px] text-emerald-400/80 font-mono">
                Análise com Gemini 3.8 Flash • Foco em Deficiências, Pragas & pH
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Upload Area / Image Preview */}
          {!photoBase64 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-800/60 hover:border-emerald-500 rounded-3xl p-8 text-center cursor-pointer transition-all bg-black/30 hover:bg-black/50 space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/80 flex items-center justify-center text-emerald-400 border border-emerald-800/50 shadow-md">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-white">
                  Selecione ou fotografe a folha afetada
                </p>
                <p className="text-[11px] text-emerald-400/70 max-w-sm mx-auto">
                  Dica: use luz branca neutra e enquadre a folha ou topo com foco nítido para maior precisão diagnóstica.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black border border-emerald-800/60 shadow-lg">
                <img
                  src={photoBase64}
                  alt="Planta para diagnóstico"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-xl bg-black/80 hover:bg-black text-rose-300 text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Trocar Foto</span>
                </button>
              </div>

              {/* Action button to analyze if not analyzed yet */}
              {!result && (
                <button
                  onClick={handleRunDiagnosis}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-emerald-950" />
                      <span>Analisando padrões foliares com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-950" />
                      <span>Iniciar Diagnóstico Fitossanitário</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-rose-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-300">
              
              {/* Needs better photo alert if lighting was insufficient */}
              {result.precisa_mais_fotos && (
                <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-600/50 text-amber-200 space-y-1">
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
              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-900/40 space-y-1.5">
                <span className="font-bold text-white text-xs block">
                  Descrição Visual Observada
                </span>
                <p className="text-emerald-200/90 leading-relaxed text-[11px]">
                  {result.descricao_visual}
                </p>

                {/* Identified Symptoms Pills */}
                {result.sinais_identificados && result.sinais_identificados.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {result.sinais_identificados.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-800/40 text-[10px] text-emerald-300 font-mono"
                      >
                        🔍 {symptom}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Possible Causes List */}
              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">
                  Possíveis Causas Identificadas
                </span>
                <div className="space-y-2">
                  {result.possiveis_causas.map((cause, idx) => {
                    const isHealthy = cause.tipo === 'saudavel';
                    const isHigh = cause.gravidade === 'alta';
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border ${
                          isHealthy
                            ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-200'
                            : isHigh
                            ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                            : 'bg-[#091712] border-emerald-900/40 text-emerald-200'
                        } space-y-1`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">
                            {cause.titulo}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono uppercase font-bold ${
                            isHealthy
                              ? 'bg-emerald-900/60 text-emerald-300'
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
              <div className="p-4 rounded-2xl bg-[#081812] border border-emerald-700/40 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Próximos Passos Recomendados (Ordem Agronômica)</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-emerald-100 leading-relaxed">
                  {result.proximos_passos.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                      <span>{step.replace(/^\d+[\.\-\)]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ask AI in Chat Button */}
              {onAskAIWithPhoto && photoBase64 && (
                <button
                  onClick={() => onAskAIWithPhoto(result, photoBase64)}
                  className="w-full py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Abrir no Chat com a IA para debater este diagnóstico</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#06120d] border-t border-emerald-950 flex items-center justify-between text-[11px] text-emerald-400/70 font-mono">
          <span>Minha Plantinha • Diagnóstico Seguro</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 font-medium hover:text-white cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
