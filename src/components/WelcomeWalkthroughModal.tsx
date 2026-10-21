import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Sprout, 
  Split, 
  CloudSun, 
  Cannabis, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Sliders, 
  MapPin, 
  ShieldCheck,
  X,
  Compass
} from 'lucide-react';

interface WelcomeWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeWalkthroughModal: React.FC<WelcomeWalkthroughModalProps> = ({
  isOpen,
  onClose
}) => {
  const { userProfile, completeOnboarding, setActiveTab } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(0);

  // Form State for User Adaptation
  const [fullName, setFullName] = useState(userProfile.full_name || '');
  const [experienceLevel, setExperienceLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>(
    userProfile.experience_level || 'iniciante'
  );
  const [growType, setGrowType] = useState<'indoor' | 'outdoor' | 'greenhouse' | 'hydro'>(
    userProfile.grow_type || 'indoor'
  );
  const [primaryFocus, setPrimaryFocus] = useState<'todas' | 'ornamentais' | 'horta' | 'cannabis'>(
    userProfile.primary_focus || 'todas'
  );
  const [weatherCity, setWeatherCity] = useState(userProfile.weather_city || 'São Paulo, SP');

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleFinish = () => {
    // Determine coordinates based on chosen city (with sensible Brazilian defaults)
    let lat = userProfile.weather_lat;
    let lng = userProfile.weather_lng;
    const lowerCity = weatherCity.toLowerCase();

    if (lowerCity.includes('rio')) {
      lat = -22.9068; lng = -43.1729;
    } else if (lowerCity.includes('curitiba')) {
      lat = -25.4284; lng = -49.2733;
    } else if (lowerCity.includes('belo')) {
      lat = -19.9167; lng = -43.9345;
    } else if (lowerCity.includes('porto alegre')) {
      lat = -30.0346; lng = -51.2177;
    } else if (lowerCity.includes('salvador')) {
      lat = -12.9714; lng = -38.5014;
    } else if (lowerCity.includes('brasília') || lowerCity.includes('brasilia')) {
      lat = -15.7975; lng = -47.8919;
    } else if (lowerCity.includes('florianópolis') || lowerCity.includes('florianopolis')) {
      lat = -27.5954; lng = -48.5480;
    }

    completeOnboarding({
      full_name: fullName.trim() || userProfile.full_name,
      experience_level: experienceLevel,
      grow_type: growType,
      primary_focus: primaryFocus,
      weather_city: weatherCity.trim() || userProfile.weather_city,
      weather_lat: lat,
      weather_lng: lng,
      show_cannabis_tab: primaryFocus === 'cannabis' || primaryFocus === 'todas',
      onboarding_completed: true
    });

    // If user primarily focuses on cannabis, take them directly to the cannabis tab
    if (primaryFocus === 'cannabis') {
      setActiveTab('cannabis');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* iOS-Style Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0a1812]/95 border border-emerald-500/25 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* iOS Frosted Header */}
        <div className="px-5 py-4 border-b border-emerald-900/50 flex items-center justify-between bg-emerald-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-emerald-950 font-bold shadow-md shadow-emerald-900/50">
              🌱
            </div>
            <div>
              <span className="text-xs font-bold text-white font-serif tracking-tight block">
                Minha Plantinha
              </span>
              <span className="text-[10px] text-emerald-400/80 font-mono">
                Guia Rápido • {currentStep + 1} de {totalSteps}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/40 flex items-center justify-center text-emerald-300 transition-colors cursor-pointer"
            title="Fechar guia"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Step 0: Welcome & Concept */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black border border-emerald-700/40 shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80" 
                  alt="Jardim exuberante"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    Diário Botânico Pessoal
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Cultive com Paixão e Método
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-emerald-200/90 leading-relaxed">
                <p>
                  O <strong>Minha Plantinha</strong> foi planejado para rodar com perfeição no navegador <strong>Safari (iOS e iPadOS)</strong> e desktop.
                </p>
                <p>
                  Aqui você acompanha o crescimento individual de cada planta, guarda fotos de cada broto e folha nova, monitora a previsão climática e previne perdas por choque térmico ou excesso de água.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center gap-2.5">
                  <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-emerald-200 font-medium">Acompanhamento Individual</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-[11px] text-emerald-200 font-medium">Privacidade Absoluta</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Photos & Comparison */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black border border-emerald-700/40 shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80" 
                  alt="Comparador de evolução"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    Linha do Tempo Visual
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Comparador Antes & Depois
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-emerald-200/90 leading-relaxed">
                <p>
                  Plantas crescem devagar e a olho nu mal percebemos a diferença. O comparador antes/depois permite deslizar fotos tiradas em datas diferentes com um slider interativo.
                </p>
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/40 space-y-1">
                  <span className="font-semibold text-emerald-300 block text-xs">💡 Dica de Ouro:</span>
                  <p className="text-[11px] text-emerald-200/80">
                    Ao registrar uma nova foto no Diário, tire no mesmo ângulo e com boa luz natural. O comparador colocará as duas lado a lado automaticamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Weather & Alerts */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black border border-emerald-700/40 shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80" 
                  alt="Previsão climática"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                    Open-Meteo Integrado
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Clima & Alertas Meteorológicos
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-emerald-200/90 leading-relaxed">
                <p>
                  O app consulta a previsão do tempo para sua cidade sem gastar chaves de API pagas.
                </p>
                <ul className="space-y-1.5 text-[11px] text-emerald-200/80">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">🌧️</span>
                    <span><strong>Alerta de Chuva Intensa:</strong> indica quando recolher vasos da chuva ou espaçar a rega.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">🌡️</span>
                    <span><strong>Oscilação Térmica:</strong> avisa quando a temperatura cair ou subir mais de 8°C no mesmo dia.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-teal-400">💨</span>
                    <span><strong>Ventos Fortes:</strong> alerta para proteger vasos suspensos e folhas delicadas.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Cannabis Cultivation Specialized */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-black border border-emerald-700/40 shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80" 
                  alt="Cultivo de Cannabis"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 font-mono flex items-center gap-1.5">
                    <Cannabis className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Aba Exclusiva</span>
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Módulo de Cultivo de Cannabis
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-emerald-200/90 leading-relaxed">
                <p>
                  Criamos uma área completa e especializada para quem cultiva cannabis medicinal ou terapêutico, com controle rigoroso de cada estágio:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                    <span className="font-semibold text-emerald-300 block">⏱️ Fotoperíodo</span>
                    <span className="text-emerald-400/80">Ciclo 18/6 (Vegetativo) e 12/12 (Floração).</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                    <span className="font-semibold text-cyan-300 block">🧪 pH & EC / PPM</span>
                    <span className="text-cyan-400/80">Controle de entrada e runoff nas regas.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                    <span className="font-semibold text-amber-300 block">🔬 Tricomas</span>
                    <span className="text-amber-400/80">Transparente, leitoso ou âmbar na colheita.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-900/50">
                    <span className="font-semibold text-purple-300 block">🌿 Treinamentos</span>
                    <span className="text-purple-400/80">LST, Topping, FIM, ScrOG e Podas.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Customization Form */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
              <div className="border-b border-emerald-900/60 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono block">
                  Configuração Inicial
                </span>
                <h3 className="text-base font-bold text-white font-serif">
                  Adapte o App para Seu Estilo de Cultivo
                </h3>
                <p className="text-xs text-emerald-300/70 mt-0.5">
                  Preencha para personalizarmos os cards, alertas e sugestões para você.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-200">
                  Como gostaria de ser chamado(a)?
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Camila Duarte, Alex..."
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Primary Focus */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-emerald-200">
                  Qual é o seu foco principal de cultivo?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'todas', label: '🌿 Coleção Mista (Todas)', desc: 'Plantas, horta e espécies especiais' },
                    { id: 'cannabis', label: '🍁 Cannabis Especializado', desc: 'Controle de fotoperíodo, pH e flores' },
                    { id: 'ornamentais', label: '🪴 Plantas de Interior', desc: 'Folhagens, Monsteras e Ficus' },
                    { id: 'horta', label: '🌱 Horta & Ervas', desc: 'Temperos, chás e pequenos vegetais' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setPrimaryFocus(f.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        primaryFocus === f.id
                          ? 'bg-emerald-900/40 border-emerald-500 text-white shadow-sm shadow-emerald-950'
                          : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300/70 hover:bg-emerald-950/40'
                      }`}
                    >
                      <span className="font-bold text-xs block">{f.label}</span>
                      <span className="text-[10px] text-emerald-400/60 block mt-0.5">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grow Type & Environment */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-emerald-200">
                  Ambiente Principal de Cultivo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  {[
                    { id: 'indoor', label: 'Indoor / Estufa' },
                    { id: 'outdoor', label: 'Jardim / Quintal' },
                    { id: 'greenhouse', label: 'Varanda / Janela' },
                    { id: 'hydro', label: 'Hidroponia' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGrowType(g.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                        growType === g.id
                          ? 'bg-emerald-600 text-emerald-950 font-bold border-emerald-400'
                          : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300 hover:text-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City for Weather */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sua Cidade (para Previsão & Alertas)</span>
                </label>
                <input
                  type="text"
                  value={weatherCity}
                  onChange={(e) => setWeatherCity(e.target.value)}
                  placeholder="Ex: São Paulo, SP ou Curitiba, PR"
                  className="w-full bg-[#07130e] border border-emerald-800/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-emerald-200">
                  Nível de Experiência
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'iniciante', label: 'Iniciante' },
                    { id: 'intermediario', label: 'Entusiasta' },
                    { id: 'avancado', label: 'Avançado' }
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setExperienceLevel(exp.id as any)}
                      className={`py-1.5 rounded-xl border text-center font-medium transition-all cursor-pointer text-xs ${
                        experienceLevel === exp.id
                          ? 'bg-emerald-700/60 border-emerald-500 text-white font-bold'
                          : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400/80 hover:text-white'
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* iOS-Style Bottom Navigation Bar */}
        <div className="p-4 sm:p-5 border-t border-emerald-900/50 bg-[#07140f] flex items-center justify-between">
          
          {/* Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentStep === idx
                    ? 'w-6 h-2 bg-emerald-400'
                    : 'w-2 h-2 bg-emerald-900/60 hover:bg-emerald-700/60'
                }`}
                title={`Ir para o passo ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(curr => Math.max(0, curr - 1))}
                className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={() => setCurrentStep(curr => Math.min(totalSteps - 1, curr + 1))}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-transform active:scale-95 cursor-pointer"
              >
                <span>Próximo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-transform active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Concluir & Começar</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
