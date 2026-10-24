import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { aiService, AiChatMessage, AiUsageStatus } from '../services/aiService.ts';
import { compressImage, formatBytes } from '../utils/imageCompressor.ts';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  X, 
  Trash2, 
  Sprout, 
  CloudSun, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowLeft,
  ChevronRight,
  Info,
  RotateCcw
} from 'lucide-react';

interface IaHortaViewProps {
  onBack?: () => void;
  preselectedPlantId?: string;
}

const QUICK_PROMPTS = [
  'Por que as folhas mais velhas estão amarelando?',
  'Como ajustar a rega com a umidade alta de hoje?',
  'Receita caseira orgânica para combater cochonilha',
  'Como adubar folhagens usando húmus e bokashi?'
];

export const IaHortaView: React.FC<IaHortaViewProps> = ({ onBack, preselectedPlantId }) => {
  const { 
    plants, 
    diaryEntries, 
    plantEvents, 
    weatherData, 
    setActiveTab 
  } = useApp();

  const [messages, setMessages] = useState<AiChatMessage[]>(() => aiService.getHortaHistory());
  const [inputText, setInputText] = useState('');
  const [selectedPlantId, setSelectedPlantId] = useState<string>(() => {
    if (preselectedPlantId && plants.some(p => p.id === preselectedPlantId)) {
      return preselectedPlantId;
    }
    return plants[0]?.id || '';
  });

  const [attachedPhoto, setAttachedPhoto] = useState<{
    base64: string;
    preview: string;
    sizeFormatted: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [usageStatus, setUsageStatus] = useState<AiUsageStatus | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar status de uso ao montar
  useEffect(() => {
    aiService.getUsageStatus()
      .then(status => setUsageStatus(status))
      .catch(err => console.warn('Não foi possível obter status de cota:', err));
  }, []);

  // Rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const selectedPlant = plants.find(p => p.id === selectedPlantId) || null;

  // Filtrar histórico recente da planta selecionada
  const recentPlantDiary = selectedPlant 
    ? diaryEntries.filter(d => d.plant_id === selectedPlant.id).slice(0, 4)
    : [];
  
  const recentPlantEvents = selectedPlant
    ? plantEvents.filter(e => e.plant_id === selectedPlant.id).slice(0, 5)
    : [];

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione apenas arquivos de imagem (JPEG, PNG ou WEBP).');
      return;
    }

    try {
      setIsCompressingPhoto(true);
      setErrorMessage(null);
      const compressed = await compressImage(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.82,
      });

      setAttachedPhoto({
        base64: compressed.dataUrl,
        preview: compressed.dataUrl,
        sizeFormatted: formatBytes(compressed.sizeBytes),
      });
    } catch (err: any) {
      setErrorMessage('Falha ao processar a foto. Tente uma foto menor.');
    } finally {
      setIsCompressingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);

    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      photoUrl: attachedPhoto?.preview,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    aiService.saveHortaHistory(newMessages);
    setInputText('');
    const photoPayload = attachedPhoto?.base64;
    setAttachedPhoto(null);
    setIsLoading(true);

    try {
      const response = await aiService.sendHortaQuery({
        message: textToSend,
        history: messages,
        selectedPlant,
        recentDiary: recentPlantDiary,
        recentEvents: recentPlantEvents,
        weatherData,
        photoBase64: photoPayload,
      });

      const assistantMessage: AiChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        tokens: {
          promptTokens: response.usage.promptTokens,
          candidateTokens: response.usage.candidateTokens,
          totalTokens: response.usage.totalTokens,
          costUSD: response.usage.costUSD,
        },
      };

      const updatedHistory = [...newMessages, assistantMessage];
      setMessages(updatedHistory);
      aiService.saveHortaHistory(updatedHistory);
      if (response.status) {
        setUsageStatus(response.status);
      }
    } catch (err: any) {
      console.error('Erro na consulta à IA Horta:', err);
      setErrorMessage(err.message || 'Falha ao consultar a IA Horta. Tente novamente.');
      if (err.quotaStatus) {
        setUsageStatus(err.quotaStatus);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Deseja limpar todo o histórico de conversas com a IA Horta?')) {
      aiService.clearHortaHistory();
      setMessages([]);
    }
  };

  return (
    <div 
      data-theme="horta" 
      data-tema="horta"
      className="space-y-4 max-w-5xl mx-auto pb-12 flex flex-col min-h-[calc(100vh-140px)]"
    >
      
      {/* 1. Header Bar with Back button and Quota Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>IA Horta • Consultoria Botânica</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
              Real • Gemini
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif tracking-tight">
            Diagnóstico e Orientação de Jardinagem
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Análise fitopatológica, prevenção de pragas, adubação orgânica e manejo ambiental.
          </p>
        </div>

        {/* Quota Badge */}
        {usageStatus && (
          <div className="flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3.5 py-2 rounded-xl text-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-[var(--text-muted)]">Cota Diária:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {usageStatus.usedToday} / {usageStatus.dailyLimit}
                </span>
              </div>
              <div className="w-28 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all rounded-full ${
                    usageStatus.remainingToday === 0 ? 'bg-amber-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (usageStatus.usedToday / usageStatus.dailyLimit) * 100)}%` }}
                />
              </div>
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Limpar histórico deste chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Disclaimer Legal/Informativo Obrigatório */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-start gap-3 shadow-xs">
        <Info className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
          <span className="font-semibold text-[var(--text-primary)]">Aviso Botânico: </span>
          As respostas são informativas e geradas por Inteligência Artificial (Gemini). Nenhuma foto permite diagnóstico 100% categórico. Sempre verifique umidade do solo e drenagem antes de intervenções drásticas.
        </div>
      </div>

      {/* 3. Context Selector Bar */}
      <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
            <label htmlFor="plant-context-select" className="text-xs font-semibold text-[var(--text-primary)]">
              Planta em Foco para a Análise:
            </label>
          </div>

          <select
            id="plant-context-select"
            value={selectedPlantId}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
          >
            <option value="">🌿 Nenhuma planta específica (Pergunta Geral)</option>
            {plants.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} {p.species ? `(${p.species})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Context Tags preview */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
          <span className="font-medium text-[var(--text-secondary)]">Contexto enviado à IA:</span>
          {selectedPlant ? (
            <>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--accent-hover)] font-medium">
                🌱 {selectedPlant.name}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                💧 Rega a cada {selectedPlant.watering_frequency_days || 3} dias
              </span>
            </>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
              Geral da Horta
            </span>
          )}

          {weatherData && (
            <span className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-1">
              <CloudSun className="w-3 h-3 text-amber-400" />
              <span>{weatherData.current.temperature}°C • {weatherData.current.relative_humidity}% UR ({weatherData.city})</span>
            </span>
          )}
        </div>
      </div>

      {/* 4. Chat Messages Scroll Area */}
      <div className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-5 overflow-y-auto space-y-4 min-h-[350px] max-h-[550px] shadow-inner">
        {messages.length === 0 ? (
          <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)] font-serif">
                Como posso ajudar sua horta hoje?
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                Descreva manchas nas folhas, dúvidas sobre regas ou anexe uma foto aproximada de brotos e folhas para análise fitossanitária.
              </p>
            </div>

            {/* Quick Suggestions */}
            <div className="pt-2 flex flex-col gap-2 text-left">
              <span className="text-[11px] font-mono uppercase font-bold text-[var(--text-muted)]">
                Sugestões rápidas:
              </span>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="min-h-[44px] text-xs px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{prompt}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)]" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] rounded-br-sm'
                    : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-bl-sm'
                }`}
              >
                {/* Photo attached */}
                {msg.photoUrl && (
                  <div className="rounded-xl overflow-hidden mb-2 max-w-xs border border-black/20">
                    <img 
                      src={msg.photoUrl} 
                      alt="Folha ou planta anexada" 
                      className="w-full h-auto object-cover max-h-56" 
                    />
                  </div>
                )}

                {/* Text Content */}
                <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                  {msg.content}
                </div>

                {/* Footer with token cost and time */}
                <div className="flex items-center justify-between gap-3 pt-2 text-[10px] opacity-75 border-t border-current/15 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.tokens && (
                    <span>
                      {msg.tokens.totalTokens} tokens • ${(msg.tokens.costUSD).toFixed(5)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] max-w-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Consultando agrônomo Gemini e analisando sintomas...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Error message or Quota Warning */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="p-1 text-red-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Photo Attachment Preview Bar */}
      {attachedPhoto && (
        <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src={attachedPhoto.preview} 
              alt="Foto para envio" 
              className="w-12 h-12 object-cover rounded-lg border border-[var(--border-subtle)]" 
            />
            <div>
              <span className="text-xs font-semibold text-[var(--text-primary)] block">Foto pronta para envio</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Comprimida para {attachedPhoto.sizeFormatted}
              </span>
            </div>
          </div>
          <button
            onClick={() => setAttachedPhoto(null)}
            className="p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Remover foto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6. Message Input & Controls Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-2 focus-within:border-[var(--accent-primary)] shadow-sm"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoSelect}
          accept="image/*"
          className="hidden"
          id="horta-photo-file-input"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isCompressingPhoto}
          className="p-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:opacity-50"
          title="Anexar foto de folha ou problema"
        >
          {isCompressingPhoto ? (
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          ) : (
            <Paperclip className="w-4 h-4" />
          )}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            selectedPlant 
              ? `Pergunte sobre ${selectedPlant.name} (ex: pontas secas, brotos)...` 
              : 'Pergunte sobre rega, pragas, adubação ou sintomas...'
          }
          disabled={isLoading}
          className="flex-1 min-h-[44px] bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] px-2 focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || (!inputText.trim() && !attachedPhoto)}
          className="min-h-[44px] px-4 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>

    </div>
  );
};
