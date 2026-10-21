import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('minha_plantinha_pwa_dismissed') === 'true';
  });

  useEffect(() => {
    // Check if already installed / standalone
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Check iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !/crios|fxios/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt (Android / Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register service worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.debug('SW registration skipped or error:', err);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('minha_plantinha_pwa_dismissed', 'true');
  };

  // Do not show if already installed in standalone mode, or dismissed
  if (isStandalone || isDismissed) {
    return null;
  }

  // Show only if Android prompt is available or iOS device detected
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-gradient-to-r from-[#071711] to-[#0c241a] border border-emerald-600/50 shadow-2xl rounded-2xl p-4 text-emerald-100 flex items-start gap-3 backdrop-blur-md">
        
        <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>Instalar Minha Plantinha</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h4>
            <button
              onClick={handleDismiss}
              className="text-emerald-400/60 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isIOS ? (
            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              No Safari iOS: toque em <strong className="text-white">Compartilhar</strong> (ícone <Share className="w-3 h-3 inline mx-0.5 text-emerald-300" />) e depois em <strong className="text-white">"Adicionar à Tela de Início"</strong> para salvar e receber alertas meteorológicos.
            </p>
          ) : (
            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              Adicione à tela de início para abrir em tela cheia, consultar suas plantas offline e receber alertas climáticos rápidos.
            </p>
          )}

          {deferredPrompt && (
            <div className="pt-1">
              <button
                onClick={handleInstallClick}
                className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar Agora</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
