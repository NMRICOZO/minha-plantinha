import React, { useState } from 'react';
import { X, MessageSquare, Star, Send, CheckCircle2, AlertCircle, Heart } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [type, setType] = useState<'sugestao' | 'defeito' | 'elogio' | 'outro'>('sugestao');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Por favor, escreva sua mensagem ou sugestão.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          rating,
          message: message.trim(),
          email: email.trim() || undefined,
          userId: 'default_user',
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao enviar feedback ao servidor.');
      }

      // Salva cópia local
      try {
        const stored = JSON.parse(localStorage.getItem('minha_plantinha_local_feedback') || '[]');
        stored.push({ type, rating, message, date: new Date().toISOString() });
        localStorage.setItem('minha_plantinha_local_feedback', JSON.stringify(stored.slice(-20)));
      } catch (e) {
        console.warn('Erro ao salvar cópia local de feedback:', e);
      }

      setIsSuccess(true);
      if (onSuccessToast) {
        onSuccessToast('Feedback enviado com sucesso! Muito obrigado.');
      }

      setTimeout(() => {
        setIsSuccess(false);
        setMessage('');
        setEmail('');
        onClose();
      }, 1800);
    } catch (err: any) {
      console.error('Erro ao enviar feedback:', err);
      // Fallback: mesmo se o backend falhar por rede, salva no local storage para não perder
      try {
        const stored = JSON.parse(localStorage.getItem('minha_plantinha_local_feedback') || '[]');
        stored.push({ type, rating, message, date: new Date().toISOString() });
        localStorage.setItem('minha_plantinha_local_feedback', JSON.stringify(stored.slice(-20)));
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMessage('');
          onClose();
        }, 1800);
      } catch {
        setErrorMsg('Não foi possível enviar o feedback no momento. Tente novamente mais tarde.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 id="feedback-title" className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-serif">
                Canal de Feedback • Beta Fechada
              </h2>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Sua opinião guia o desenvolvimento do Minha Plantinha
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] font-serif">
              Muito obrigado pela sua colaboração!
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
              Seu relato foi gravado e será analisado diretamente pela equipe de engenharia para o próximo ciclo de melhorias.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)] block">
                Tipo de Feedback
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'sugestao', label: 'Sugestão' },
                  { id: 'defeito', label: 'Defeito / Bug' },
                  { id: 'elogio', label: 'Elogio' },
                  { id: 'outro', label: 'Outro' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                      type === item.id
                        ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-hover)] font-bold'
                        : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)] block">
                Como está sendo sua experiência geral com o aplicativo?
              </label>
              <div className="flex items-center gap-1.5 pt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] text-amber-400 cursor-pointer transition-transform active:scale-90"
                    title={`${star} de 5 estrelas`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-stone-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-[var(--text-muted)] ml-2">
                  {rating} de 5
                </span>
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <label htmlFor="feedback-message" className="text-xs font-semibold text-[var(--text-primary)] block">
                Sua Mensagem ou Descrição Detalhada *
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Conte o que achou da navegação, das fotos, do clima, da IA ou relate qualquer falha encontrada..."
                rows={4}
                required
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] leading-relaxed resize-none"
              />
            </div>

            {/* Optional Email */}
            <div className="space-y-1.5">
              <label htmlFor="feedback-email" className="text-xs font-semibold text-[var(--text-primary)] block">
                E-mail para Retorno (Opcional)
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full min-h-[44px] px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] text-xs font-bold transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Feedback'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
