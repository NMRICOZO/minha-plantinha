import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GeneticsSheet, PlantContextData } from '../../types/genetics.ts';
import { geminiGeneticsService } from '../../services/geminiGeneticsService.ts';
import { 
  Send, 
  X, 
  Trash2, 
  Dna, 
  Image as ImageIcon,
  Bot,
  User
} from 'lucide-react';

interface GeneticsChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  geneticsSheet?: GeneticsSheet;
  plantContext?: PlantContextData;
  initialQuery?: string;
  initialPhotoUrl?: string;
}

const QUICK_SUGGESTIONS = [
  'Como está minha fase atual?',
  'Qual o pH e EC ideal para a rega?',
  'Por que as folhas de baixo estão amarelando?',
  'Como aplicar LST nesta genética?',
  'Quando devo iniciar o flush final?',
];

export const GeneticsChatDrawer: React.FC<GeneticsChatDrawerProps> = ({
  isOpen,
  onClose,
  geneticsSheet,
  plantContext,
  initialQuery,
  initialPhotoUrl,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialGreeting: ChatMessage = {
      id: 'greeting',
      role: 'assistant',
      content: `Olá! Sou seu assistente agronômico especializado. Posso orientar cada detalhe sobre ${
        geneticsSheet ? `a genética **${geneticsSheet.nome}**` : 'seu cultivo'
      }${plantContext ? ` e o espécime **${plantContext.plant_name}**` : ''}. Como posso ajudar hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    return [initialGreeting];
  });

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(initialPhotoUrl || null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSend(initialQuery, initialPhotoUrl || undefined);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string, photoToSend?: string) => {
    const text = (textToSend || input).trim();
    const photo = photoToSend || attachedPhoto;

    if (!text && !photo) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text || 'Por favor, analise a imagem anexada.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoUrl: photo || undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachedPhoto(null);
    setIsStreaming(true);

    const assistantId = `assistant-${Date.now()}`;
    const placeholderAssistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...newMessages, placeholderAssistantMessage]);

    try {
      let accumulated = '';
      await geminiGeneticsService.streamChat(
        newMessages,
        geneticsSheet,
        plantContext,
        (chunk: string) => {
          accumulated += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: accumulated } : msg
            )
          );
        }
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  'Desculpe, ocorreu uma oscilação na resposta técnica. Por favor, tente reformular sua dúvida.',
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'greeting-reset',
        role: 'assistant',
        content: 'Histórico limpo. Como posso ajudar agora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleAttachPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center text-[var(--accent-text)] shadow-sm">
              <Bot className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[var(--text-primary)] font-serif">
                  Assistente de Cultivo & IA
                </h3>
                <span className="w-2 h-2 rounded-full bg-[var(--accent-hover)] animate-pulse" />
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                {geneticsSheet?.nome ? `Genética: ${geneticsSheet.nome}` : 'Consultoria Fitotécnica'}
                {plantContext?.plant_name ? ` • ${plantContext.plant_name}` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              aria-label="Limpar histórico do chat"
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Limpar histórico"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Fechar chat com o assistente"
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loaded Context Indicator Pill */}
        <div className="px-4 py-2 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <Dna className="w-3.5 h-3.5 shrink-0 text-[var(--accent-hover)]" />
            <span className="truncate">
              Ficha & Contexto da Planta ativos na conversa
            </span>
          </div>
          {plantContext && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] capitalize shrink-0">
              {plantContext.stage}
            </span>
          )}
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-hover)] shrink-0 self-end mb-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm ${
                    isUser
                      ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] rounded-br-none'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-bl-none'
                  }`}
                >
                  {/* Attached photo in message */}
                  {msg.photoUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden max-h-48 bg-black border border-white/10">
                      <img
                        src={msg.photoUrl}
                        alt="Anexo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                    {msg.content}
                    {isStreaming && msg.id.startsWith('assistant') && !msg.content && (
                      <span className="inline-block animate-pulse text-[var(--accent-hover)]">
                        Pensando...
                      </span>
                    )}
                  </div>

                  <span
                    className={`block text-[9px] mt-1.5 font-mono ${
                      isUser ? 'text-white/80 text-right' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] shrink-0 self-end mb-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] overflow-x-auto flex items-center gap-1.5 text-xs">
          <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0">Sugestões:</span>
          {QUICK_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              disabled={isStreaming}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] space-y-2">
          {/* Photo attachment preview */}
          {attachedPhoto && (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs">
              <img
                src={attachedPhoto}
                alt="Foto anexada"
                className="w-10 h-10 object-cover rounded-lg"
              />
              <span className="text-[var(--text-secondary)] text-[11px] truncate flex-1">
                Foto anexada para análise
              </span>
              <button
                onClick={() => setAttachedPhoto(null)}
                className="min-w-[44px] min-h-[44px] rounded-lg text-rose-300 hover:text-white flex items-center justify-center cursor-pointer"
                aria-label="Remover anexo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAttachPhoto}
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Anexar foto da planta"
              aria-label="Anexar foto"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre pH, rega, podas ou sintomas..."
              disabled={isStreaming}
              className="flex-1 min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isStreaming || (!input.trim() && !attachedPhoto)}
              className="min-w-[44px] min-h-[44px] rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] flex items-center justify-center transition-transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 font-bold"
              title="Enviar mensagem"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
