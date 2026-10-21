import { 
  GeneticsSheet, 
  PhotoDiagnosisResult, 
  PlantContextData, 
  PlantContextAdvice,
  ChatMessage 
} from '../types/genetics.ts';

const GENETICS_CACHE_KEY = 'minha_plantinha_genetics_cache_v1';
const SAVED_FAVORITE_SHEETS_KEY = 'minha_plantinha_favorite_sheets_v1';

// Popular offline fallback presets in case of API limits or offline state
const PRESET_FALLBACK_SHEETS: Record<string, Partial<GeneticsSheet>> = {
  'gorilla glue': {
    nome: 'Gorilla Glue #4 (GG4)',
    breeder: 'GG Strains / Clone Original',
    linhagem: 'Sour Dubb x Chem Sis x Chocolate Diesel',
    proporcao_indica_sativa_ruderalis: '63% Indica / 37% Sativa / 0% Ruderalis',
    fotoperiodo_ou_auto: 'fotoperiodo',
    ciclo_total_dias: '70 a 85 dias',
    tempo_floracao_dias: '58 a 63 dias (8-9 semanas)',
    altura_esperada: { vega: '35-50 cm', final: '100-140 cm indoor' },
    nivel_dificuldade: 3,
    producao_estimada: { indoor: '500-600 g/m²', outdoor: '600-800 g/planta' },
    faixa_thc_cbd: { thc: '25% - 30%', cbd: '< 1%' },
    terpenos_dominantes: ['Cariofileno', 'Mirceno', 'Limoneno'],
    perfil_aroma_sabor: 'Diesel penetrante, terra úmida, pinho e notas achocolatadas ácidas',
    tolerancias: {
      clima: 'Prefere clima temperado a ameno; suscetível a calor extremo acima de 30°C',
      pragas: 'Moderada; monitorar ácaros',
      mofo: 'Atenção redobrada na flora avançada devido à densidade extrema dos cálices'
    },
    confianca: 'alta',
    observacao_incerteza: 'Genética amplamente documentada internacionalmente. Resina extraordinária para extrações.'
  },
  'og kush': {
    nome: 'OG Kush',
    breeder: 'Linhagem Clássica da Califórnia',
    linhagem: 'Chemdawg x Lemon Thai x Pakistani Kush',
    proporcao_indica_sativa_ruderalis: '75% Indica / 25% Sativa / 0% Ruderalis',
    fotoperiodo_ou_auto: 'fotoperiodo',
    ciclo_total_dias: '75 a 90 dias',
    tempo_floracao_dias: '56 a 63 dias (8-9 semanas)',
    altura_esperada: { vega: '30-45 cm', final: '90-130 cm indoor' },
    nivel_dificuldade: 3,
    producao_estimada: { indoor: '450-500 g/m²', outdoor: '550 g/planta' },
    faixa_thc_cbd: { thc: '20% - 24%', cbd: '< 0.5%' },
    terpenos_dominantes: ['Mirceno', 'Limoneno', 'Cariofileno'],
    perfil_aroma_sabor: 'Combustível cítrico, notas de pinho, especiarias e terra fresca',
    tolerancias: {
      clima: 'Excelente adaptação indoor com boa circulação de ar',
      pragas: 'Moderada',
      mofo: 'Média; manter umidade relativa em 40-45% nas semanas 6 a 9 de floração'
    },
    confianca: 'alta',
    observacao_incerteza: 'Base das genéticas modernas de elite dos EUA. Alta demanda de Cálcio e Magnésio.'
  },
  'northern lights': {
    nome: 'Northern Lights',
    breeder: 'Sensi Seeds / Banco Clássico',
    linhagem: 'Afghani Indica x Thai Sativa',
    proporcao_indica_sativa_ruderalis: '90% Indica / 10% Sativa / 0% Ruderalis',
    fotoperiodo_ou_auto: 'fotoperiodo',
    ciclo_total_dias: '65 a 80 dias',
    tempo_floracao_dias: '45 a 55 dias (6-8 semanas)',
    altura_esperada: { vega: '25-40 cm', final: '80-110 cm' },
    nivel_dificuldade: 1,
    producao_estimada: { indoor: '500-550 g/m²', outdoor: '600 g/planta' },
    faixa_thc_cbd: { thc: '18% - 22%', cbd: '< 1%' },
    terpenos_dominantes: ['Mirceno', 'Pineno', 'Cariofileno'],
    perfil_aroma_sabor: 'Doce, pinho suave, especiarias e sutil terroso',
    tolerancias: {
      clima: 'Altíssima tolerância a variações térmicas e erros de iniciantes',
      pragas: 'Alta resistência natural',
      mofo: 'Alta resistência'
    },
    confianca: 'alta',
    observacao_incerteza: 'Uma das genéticas mais estáveis e fáceis de cultivar no mundo, ideal para quem está começando.'
  }
};

// Default standard 8 phases template generator
export function generateDefaultPhases(strainName: string, isAuto: boolean = false): any[] {
  return [
    {
      fase_id: 'germinacao',
      fase_nome: '1. Germinação',
      horas_luz: 'Escuro total (ou 18/6 após emergir)',
      temperatura_c: '22°C - 26°C',
      umidade_ur: '70% - 85%',
      vpd_kpa: '0.4 - 0.7 kPa',
      ph_rega: '6.0 - 6.2 (Água mineral leve)',
      ec_ppm: 'EC 0.2 - 0.4 mS/cm (Zero fertilizantes)',
      frequencia_rega: 'Apenas umedecer o substrato sem encharcar; usar borrifador',
      nutrientes_cuidados: 'Apenas água pura e opcional enraizador biológico (ex: ácidos fúlvicos/micorrizas).',
      podas_treinamentos: 'Nenhuma poda. Proibido manipular a radícula sensível.',
      erros_comuns: 'Encharcar o papel toalha ou substrato afogando a semente por falta de oxigênio.'
    },
    {
      fase_id: 'plantula',
      fase_nome: '2. Plântula (Seedling)',
      horas_luz: isAuto ? '20h luz / 4h escuro' : '18h luz / 6h escuro',
      temperatura_c: '23°C - 26°C',
      umidade_ur: '65% - 75%',
      vpd_kpa: '0.6 - 0.9 kPa',
      ph_rega: '6.0 - 6.3',
      ec_ppm: 'EC 0.4 - 0.8 mS/cm (~250-400 PPM)',
      frequencia_rega: 'Pequenos volumes (100-200ml) em círculo ao redor do caule a cada 2-3 dias',
      nutrientes_cuidados: 'Dose mínima (1/4 da tabela recomendada) de nutrientes vegetativos ricos em N.',
      podas_treinamentos: 'Manter a luz a 50-60cm para evitar estiolamento (caule fino e espigado).',
      erros_comuns: 'Excesso de fertilizante queimando as folhas embrionárias (cotilédones).'
    },
    {
      fase_id: 'vegetativo',
      fase_nome: '3. Vegetativo Pleno',
      horas_luz: isAuto ? '20h luz / 4h escuro' : '18h luz / 6h escuro',
      temperatura_c: '24°C - 28°C',
      umidade_ur: '55% - 65%',
      vpd_kpa: '0.8 - 1.2 kPa',
      ph_rega: '6.2 - 6.5 (Solo) / 5.8 - 6.0 (Inerte)',
      ec_ppm: 'EC 1.2 - 1.8 mS/cm (~600-900 PPM)',
      frequencia_rega: 'Regar até sair 10-15% de escorrimento no prato; esperar o solo secar levemente',
      nutrientes_cuidados: 'Alta demanda de Nitrogênio (N) para expansão de folhas e caules, mais Cálcio e Magnésio.',
      podas_treinamentos: isAuto ? 'Apenas LST suave amarrando caules laterais' : 'LST contínuo, Topping no 4º ou 5º nó, desfolhação de folhas velhas inferiores.',
      erros_comuns: 'Regar todo dia por ansiedade; o solo precisa de ciclos de oxigenação das raízes.'
    },
    {
      fase_id: 'pre_floracao',
      fase_nome: '4. Pré-Floração (O Estirão / Stretch)',
      horas_luz: isAuto ? '20/4' : '12h luz / 12h escuro rigoroso',
      temperatura_c: '22°C - 26°C',
      umidade_ur: '50% - 60%',
      vpd_kpa: '1.0 - 1.3 kPa',
      ph_rega: '6.3 - 6.5',
      ec_ppm: 'EC 1.4 - 1.8 mS/cm',
      frequencia_rega: 'Aumenta consideravelmente pois a planta dobra de tamanho em 2 semanas',
      nutrientes_cuidados: 'Transição suave da nutrição vegetativa para floral. Começar a diminuir N e elevar P e K.',
      podas_treinamentos: 'Ajustar rede ScrOG; suspender podas drásticas após a 2ª semana de floração.',
      erros_comuns: 'Vazamentos de luz durante o período noturno (causa estresse e hermafroditismo em fotoperíodo).'
    },
    {
      fase_id: 'floracao',
      fase_nome: '5. Floração Plena',
      horas_luz: isAuto ? '20/4 ou 18/6' : '12h luz / 12h escuro ininterrupto',
      temperatura_c: '20°C - 25°C (noites mais amenas realçam terpenos)',
      umidade_ur: '40% - 50%',
      vpd_kpa: '1.2 - 1.5 kPa',
      ph_rega: '6.3 - 6.6 (Solo) / 6.0 - 6.2 (Inerte)',
      ec_ppm: 'EC 1.6 - 2.2 mS/cm (~800-1100 PPM)',
      frequencia_rega: 'Constante, monitorando sempre o peso do vaso antes de cada rega',
      nutrientes_cuidados: 'Foco total em Fósforo (P) e Potássio (K) para densidade dos botões e resina rica.',
      podas_treinamentos: 'Lollipopping (limpeza de galhos de pipoca na base) e desfolhação estratégica aos 21 dias.',
      erros_comuns: 'Umidade acima de 60% com flores densas; risco altíssimo de fungo Botrytis (mofo cinzento).'
    },
    {
      fase_id: 'flush',
      fase_nome: '6. Flush (Lavagem Final)',
      horas_luz: '12h luz / 12h escuro',
      temperatura_c: '19°C - 24°C',
      umidade_ur: '40% - 45%',
      vpd_kpa: '1.2 - 1.5 kPa',
      ph_rega: '6.2 - 6.5 (Água pura)',
      ec_ppm: 'EC < 0.4 mS/cm (Zero fertilizantes)',
      frequencia_rega: '1 a 2 semanas antes da colheita; usar água pura com pH ajustado',
      nutrientes_cuidados: 'Zero nutrientes minerais adicionados para que a planta consuma as reservas de clorofila.',
      podas_treinamentos: 'Apenas retirar folhas amarelas senescentes que se soltarem facilmente.',
      erros_comuns: 'Continuar aplicando fertilizantes até o último dia, gerando queima preta e fumo áspero.'
    },
    {
      fase_id: 'secagem',
      fase_nome: '7. Colheita & Secagem',
      horas_luz: 'Escuro absoluto 24h',
      temperatura_c: '18°C - 20°C (Regra dos 60°F / 15-18°C ideal)',
      umidade_ur: '55% - 60%',
      vpd_kpa: 'Ambiente controlado',
      ph_rega: 'N/A',
      ec_ppm: 'N/A',
      frequencia_rega: 'N/A',
      nutrientes_cuidados: 'Pendurar a planta inteira de cabeça para baixo ou ramos com espaço entre si.',
      podas_treinamentos: 'Manicura úmida suave ou manicura seca após a haste quebrar com estalo característico.',
      erros_comuns: 'Secar rápido demais em local quente com ventilador apontado direto para os botões.'
    },
    {
      fase_id: 'cura',
      fase_nome: '8. Cura em Potes & Maturação',
      horas_luz: 'Escuro absoluto (potes herméticos de vidro)',
      temperatura_c: '18°C - 22°C',
      umidade_ur: '58% - 62% (com sachê Boveda 62%)',
      vpd_kpa: 'N/A',
      ph_rega: 'N/A',
      ec_ppm: 'N/A',
      frequencia_rega: 'N/A',
      nutrientes_cuidados: 'Abrir ("arrotar") os potes 1 a 2 vezes ao dia por 10 minutos nas primeiras 2 semanas.',
      podas_treinamentos: 'Conservação de tricomas sem atrito excessivo.',
      erros_comuns: 'Fechar botões úmidos no pote selado sem higrômetro, gerando mofo após a colheita.'
    }
  ];
}

class GeminiGeneticsService {
  // Load cache from localStorage
  private getCache(): Record<string, GeneticsSheet> {
    try {
      const stored = localStorage.getItem(GENETICS_CACHE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  // Save to cache
  private saveToCache(key: string, sheet: GeneticsSheet) {
    try {
      const cache = this.getCache();
      cache[key.toLowerCase().trim()] = sheet;
      localStorage.setItem(GENETICS_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.warn('Erro ao salvar no cache local:', e);
    }
  }

  // Get Favorites list
  public getFavorites(): GeneticsSheet[] {
    try {
      const stored = localStorage.getItem(SAVED_FAVORITE_SHEETS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Toggle favorite sheet
  public toggleFavorite(sheet: GeneticsSheet): boolean {
    try {
      const favorites = this.getFavorites();
      const existingIdx = favorites.findIndex(f => f.nome.toLowerCase() === sheet.nome.toLowerCase());
      let isNowFavorited = false;
      if (existingIdx >= 0) {
        favorites.splice(existingIdx, 1);
        isNowFavorited = false;
      } else {
        favorites.unshift(sheet);
        isNowFavorited = true;
      }
      localStorage.setItem(SAVED_FAVORITE_SHEETS_KEY, JSON.stringify(favorites));
      return isNowFavorited;
    } catch {
      return false;
    }
  }

  // Check if strain is in favorites
  public isFavorite(strainName: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(f => f.nome.toLowerCase() === strainName.toLowerCase());
  }

  // 1. Fetch Genetics Sheet with Local Cache Check
  public async getGeneticsSheet(
    strainName: string, 
    breeder?: string, 
    medium?: string, 
    environment?: string,
    forceRefresh: boolean = false
  ): Promise<GeneticsSheet> {
    const normalizedKey = strainName.toLowerCase().trim();
    const cache = this.getCache();

    if (!forceRefresh && cache[normalizedKey]) {
      return cache[normalizedKey];
    }

    try {
      const response = await fetch('/api/gemini/genetics-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strainName: strainName.trim(),
          breeder: breeder?.trim() || undefined,
          medium: medium || 'solo_organico',
          environment: environment || 'indoor',
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API (${response.status}): ${await response.text()}`);
      }

      const data: GeneticsSheet = await response.json();
      
      // Ensure plano_fases is present and robust
      if (!data.plano_fases || data.plano_fases.length === 0) {
        data.plano_fases = generateDefaultPhases(data.nome, data.fotoperiodo_ou_auto === 'automatica');
      }

      data.criado_em = new Date().toISOString();
      this.saveToCache(normalizedKey, data);
      return data;
    } catch (apiError: any) {
      console.warn('Falha na chamada de IA para ficha da genética. Verificando fallback resiliente...', apiError);
      
      // Check preset fallbacks
      for (const [key, preset] of Object.entries(PRESET_FALLBACK_SHEETS)) {
        if (normalizedKey.includes(key)) {
          const fallbackSheet: GeneticsSheet = {
            id: `fb-${Date.now()}`,
            nome: preset.nome || strainName,
            breeder: preset.breeder || 'Banco Selecionado',
            linhagem: preset.linhagem || 'Linhagem preservada',
            proporcao_indica_sativa_ruderalis: preset.proporcao_indica_sativa_ruderalis || 'Híbrida 50/50',
            fotoperiodo_ou_auto: preset.fotoperiodo_ou_auto || 'fotoperiodo',
            ciclo_total_dias: preset.ciclo_total_dias || '75 a 85 dias',
            tempo_floracao_dias: preset.tempo_floracao_dias || '56 a 63 dias',
            altura_esperada: preset.altura_esperada || { vega: '35 cm', final: '110 cm' },
            nivel_dificuldade: preset.nivel_dificuldade || 2,
            producao_estimada: preset.producao_estimada || { indoor: '500 g/m²', outdoor: '600 g/planta' },
            faixa_thc_cbd: preset.faixa_thc_cbd || { thc: '20% - 24%', cbd: '< 1%' },
            terpenos_dominantes: preset.terpenos_dominantes || ['Mirceno', 'Cariofileno', 'Limoneno'],
            perfil_aroma_sabor: preset.perfil_aroma_sabor || 'Perfil aromático botânico clássico.',
            tolerancias: preset.tolerancias || { clima: 'Boa', pragas: 'Média', mofo: 'Média' },
            confianca: 'media',
            observacao_incerteza: 'Dados carregados da biblioteca botânica offline de segurança.',
            plano_fases: generateDefaultPhases(preset.nome || strainName, preset.fotoperiodo_ou_auto === 'automatica'),
            criado_em: new Date().toISOString(),
          };
          this.saveToCache(normalizedKey, fallbackSheet);
          return fallbackSheet;
        }
      }

      // Generic fallback if not found in presets
      const genericSheet: GeneticsSheet = {
        id: `generic-${Date.now()}`,
        nome: strainName,
        breeder: breeder || 'Cultivar Registrado',
        linhagem: 'Parentais Híbridos Selecionados',
        proporcao_indica_sativa_ruderalis: '50% Indica / 50% Sativa / 0% Auto',
        fotoperiodo_ou_auto: 'fotoperiodo',
        ciclo_total_dias: '75 a 90 dias',
        tempo_floracao_dias: '60 dias (8-9 semanas)',
        altura_esperada: { vega: '30-45 cm', final: '100-130 cm' },
        nivel_dificuldade: 2,
        producao_estimada: { indoor: '450-500 g/m²', outdoor: '550 g/planta' },
        faixa_thc_cbd: { thc: '18% - 22%', cbd: '< 1%' },
        terpenos_dominantes: ['Mirceno', 'Pineno', 'Cariofileno'],
        perfil_aroma_sabor: 'Aroma herbal fresco com tons terrosos e notas de pinho.',
        tolerancias: {
          clima: 'Tolerância moderada; manter temperatura em 24°C',
          pragas: 'Resistência padrão',
          mofo: 'Controlar umidade relativa abaixo de 50% na floração',
        },
        confianca: 'baixa',
        observacao_incerteza: 'Genética customizada ou conexão offline: parâmetros padrão baseados em híbridas estáveis.',
        plano_fases: generateDefaultPhases(strainName, false),
        criado_em: new Date().toISOString(),
      };
      return genericSheet;
    }
  }

  // 2. Multimodal Photo Diagnosis
  public async diagnosePhoto(
    imageBase64: string,
    mimeType: string = 'image/jpeg',
    plantContext?: PlantContextData
  ): Promise<PhotoDiagnosisResult> {
    try {
      const response = await fetch('/api/gemini/photo-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          plantContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Falha no diagnóstico (${response.status}): ${await response.text()}`);
      }

      const result: PhotoDiagnosisResult = await response.json();
      return result;
    } catch (err: any) {
      console.warn('Erro ao diagnosticar foto via API Gemini:', err);
      return {
        descricao_visual: 'Não foi possível completar o processamento remoto da foto neste momento.',
        sinais_identificados: ['Avaliação visual indisponível'],
        possiveis_causas: [
          {
            tipo: 'estresse_ambiental',
            titulo: 'Verificação Manual Recomendada',
            explicacao: 'Cheque primeiro o pH da água e do runoff. Em 80% dos casos de folhas amareladas ou manchadas em cannabis, a causa é desequilíbrio de pH ou excesso de rega (overwatering).',
            gravidade: 'moderada',
          },
        ],
        confianca: 'baixa',
        proximos_passos: [
          '1. Meça o pH da calda de rega (deve estar entre 6.0 e 6.5 para solo, ou 5.8 para inerte).',
          '2. Levante o vaso: se estiver pesado e o solo úmido, aguarde 2 a 3 dias antes de regar novamente.',
          '3. Verifique a distância da luz para evitar queima luminosa nas folhas de cima.',
        ],
        precisa_mais_fotos: true,
        orientacoes_foto: 'Tire uma foto nítida de dia ou com lanterna de luz branca neutra (evite luz roxa blurple).',
      };
    }
  }

  // 3. Quick Contextual Advice ("O que fazer agora" & Alertas)
  public async getPlantAdvice(
    plantContext: PlantContextData,
    geneticsSheet?: GeneticsSheet
  ): Promise<PlantContextAdvice> {
    try {
      const response = await fetch('/api/gemini/plant-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantContext, geneticsSheet }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Falha em plant-advice, usando motor factual offline:', e);
    }

    // Dynamic offline rules engine based on stage and days
    const stage = plantContext.stage;
    const daysInStage = plantContext.days_in_stage || 1;

    if (stage === 'vegetativo') {
      return {
        o_que_fazer_agora: [
          'Manter fotoperíodo contínuo de 18 horas de luz e 6 de escuro.',
          'Verificar se as novas brotações laterais já permitem iniciar amarras de LST suave.',
          'Regar somente quando os primeiros 3 cm de substrato estiverem visivelmente secos ao toque.',
        ],
        alertas_proxima_semana: [
          'Se planejar realizar Topping (poda apical), faça no 4º ou 5º nó enquanto a planta estiver viçosa.',
          'Acompanhar a expansão das raízes: considere transplante se o vaso for menor que 7 litros.',
        ],
        alvos_recomendados: {
          ph: 6.3,
          ec: 1.4,
          temp: 25,
          rh: 60,
          vpd: '0.9 - 1.1 kPa',
        },
      };
    }

    if (stage === 'floracao') {
      return {
        o_que_fazer_agora: [
          'Garantir 12 horas de escuridão total e absoluta, sem nenhum led indicador ligado na tenda.',
          'Manter a umidade relativa entre 40% e 50% para proteger os cálices de mofo botrytis.',
          'Aplicar suporte ou estacas nos ramos que começarem a dobrar pelo peso dos botões.',
        ],
        alertas_proxima_semana: [
          daysInStage > 40
            ? 'Iniciar inspeção de tricomas com lupa (30x-60x) nos cálices florais.'
            : 'Fazer desfolhação leve apenas das folhas que cobrem topos florais de baixo.',
          'Preparar a água filtrada para o flush nas últimas 1 a 2 semanas.',
        ],
        alvos_recomendados: {
          ph: 6.4,
          ec: 1.8,
          temp: 23,
          rh: 45,
          vpd: '1.2 - 1.4 kPa',
        },
      };
    }

    // General fallback
    return {
      o_que_fazer_agora: [
        'Monitorar a umidade e a circulação de ar interna ao redor da canópea.',
        'Checar o pH da calda de rega antes de aplicar no vaso.',
        'Registrar a fertirrigação no diário para manter o histórico de runoff.',
      ],
      alertas_proxima_semana: [
        'Acompanhar o desenvolvimento de novos nós e entrenós.',
        'Verificar se o vaso está drenando livremente sem água empoçada no prato.',
      ],
      alvos_recomendados: {
        ph: 6.2,
        ec: 1.3,
        temp: 24,
        rh: 55,
        vpd: '1.0 kPa',
      },
    };
  }

  // 4. Stream Chat with SSE Reader
  public async streamChat(
    messages: ChatMessage[],
    geneticsSheet?: GeneticsSheet,
    plantContext?: PlantContextData,
    onChunk?: (textChunk: string) => void,
    onComplete?: (fullText: string) => void,
    onError?: (err: any) => void
  ): Promise<void> {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          geneticsSheet,
          plantContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro no chat (${response.status}): ${await response.text()}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream não suportado pelo navegador.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.replace(/^data:\s*/, '');
          if (dataStr === '[DONE]') {
            break;
          }
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              fullText += parsed.text;
              onChunk?.(parsed.text);
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // Ignore parse errors on raw non-json SSE lines
          }
        }
      }

      onComplete?.(fullText);
    } catch (err) {
      console.error('Erro no streaming de chat:', err);
      onError?.(err);
    }
  }
}

export const geminiGeneticsService = new GeminiGeneticsService();
