import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GeneticsSheet, PlantContextData } from '../../types/genetics.ts';
import { geminiGeneticsService } from '../../services/geminiGeneticsService.ts';
import { 
  Send, 
  Sparkles, 
  X, 
  Trash2, 
  Dna, 
  Sprout, 
  MessageSquare, 
  HelpCircle, 
  Paperclip, 
  Image as ImageIcon,
  Bot,
  User,
  ArrowDown
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
    // Initial friendly greeting message
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

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Handle initial query if passed
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

    const botMessageId = `assistant-${Date.now()}`;
    const placeholderBotMessage: ChatMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...newMessages, placeholderBotMessage]);

    let accumulatedText = '';

    await geminiGeneticsService.streamChat(
      newMessages,
      geneticsSheet,
      plantContext,
      (chunk) => {
        accumulatedText += chunk;
        setMessages((prev) =>
          prev.map((m) => (m.id === botMessageId ? { ...m, content: accumulatedText } : m))
        );
      },
      (finalText) => {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((m) => (m.id === botMessageId ? { ...m, content: finalText || accumulatedText } : m))
        );
      },
      (err) => {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? {
                  ...m,
                  content:
                    'Desculpe, ocorreu uma instabilidade temporária na conexão. Por gentileza, repita sua pergunta ou verifique sua conexão.',
                }
              : m
          )
        );
      }
    );
  };

  const handleClearChat = () => {
    if (window.confirm('Deseja limpar todo o histórico desta conversa?')) {
      setMessages([
        {
          id: 'greeting-reset',
          role: 'assistant',
          content: 'Histórico reiniciado. O que você gostaria de consultar agora?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Drawer Container (iOS Style modal or slide-over) */}
      <div className="w-full sm:max-w-lg h-full sm:h-[92vh] bg-[#071510] border sm:border-emerald-700/50 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Drawer Header */}
        <div className="px-4 py-3.5 border-b border-emerald-900/60 bg-[#091d15] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-emerald-950 shadow-md">
              <Bot className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white font-serif">
                  Assistente de Cultivo & IA
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-emerald-400/80 font-mono block">
                {geneticsSheet?.nome ? `Genética: ${geneticsSheet.nome}` : 'Consultoria Agronômica'}
                {plantContext?.plant_name ? ` • ${plantContext.plant_name}` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-emerald-400/60 hover:text-emerald-300 transition-colors cursor-pointer"
              title="Limpar histórico"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loaded Context Indicator Pill */}
        <div className="px-4 py-2 bg-[#05100c] border-b border-emerald-950 flex items-center justify-between text-[11px] text-emerald-400 font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <Dna className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span className="truncate">
              Ficha & Contexto da Planta ativos na conversa
            </span>
          </div>
          {plantContext && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/40 text-emerald-300 capitalize shrink-0">
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
                  <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0 self-end mb-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                      : 'bg-[#091b14] border border-emerald-900/60 text-emerald-100 rounded-bl-none'
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
                      <span className="inline-block animate-pulse text-emerald-400">
                        Pensando...
                      </span>
                    )}
                  </div>

                  <span
                    className={`block text-[9px] mt-1.5 font-mono ${
                      isUser ? 'text-emerald-100/70 text-right' : 'text-emerald-400/60'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-800 flex items-center justify-center text-white shrink-0 self-end mb-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#06120d] border-t border-emerald-950 overflow-x-auto flex items-center gap-1.5 text-xs">
          <span className="text-[10px] text-emerald-400/60 font-mono shrink-0">Sugestões:</span>
          {QUICK_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              disabled={isStreaming}
              className="px-2.5 py-1 rounded-xl bg-[#091c14] hover:bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#081812] border-t border-emerald-900/60 space-y-2">
          {/* Photo attachment preview */}
          {attachedPhoto && (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-emerald-800/40 text-xs">
              <img
                src={attachedPhoto}
                alt="Foto anexada"
                className="w-10 h-10 object-cover rounded-lg"
              />
              <span className="text-emerald-300 text-[11px] truncate flex-1">
                Foto anexada para análise
              </span>
              <button
                onClick={() => setAttachedPhoto(null)}
                className="p-1 rounded-lg text-rose-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
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
              className="p-2.5 rounded-xl bg-black/40 hover:bg-emerald-950 text-emerald-400 border border-emerald-800/50 transition-colors cursor-pointer shrink-0"
              title="Anexar foto da planta"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre pH, rega, podas ou sintomas..."
              disabled={isStreaming}
              className="flex-1 bg-black/40 border border-emerald-800/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isStreaming || (!input.trim() && !attachedPhoto)}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 transition-transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 font-bold"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
