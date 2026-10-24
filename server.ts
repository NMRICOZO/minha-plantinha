import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { usageTracker } from './serverUsage.ts';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for body parsing with support for base64 photo upload
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Server-side Google Gemini client (User-Agent header required by guidelines)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PRIMARY_MODEL = 'gemini-3.8-flash';
const MODEL_NAME = PRIMARY_MODEL;

async function generateGeminiContentWithFallback(params: {
  contents: any;
  config: any;
  preferredModel?: string;
}) {
  const models = [
    params.preferredModel || PRIMARY_MODEL,
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  let lastError: any = null;
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      console.warn(`Modelo ${model} indisponível ou com alta demanda:`, err?.message || err);
      lastError = err;
      const errMsg = String(err?.message || '');
      if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('404') || errMsg.includes('UNAVAILABLE')) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// JSON Schemas for Gemini Structured Outputs
const geneticsSheetSchema = {
  type: Type.OBJECT,
  properties: {
    nome: { type: Type.STRING, description: 'Nome da strain' },
    breeder: { type: Type.STRING, description: 'Banco de sementes / criador (ou Desconhecido)' },
    linhagem: { type: Type.STRING, description: 'Cruzamento parentais' },
    proporcao_indica_sativa_ruderalis: { type: Type.STRING, description: 'Ex: 70% Indica / 30% Sativa / 0% Ruderalis' },
    fotoperiodo_ou_auto: { type: Type.STRING, enum: ['fotoperiodo', 'automatica'] },
    ciclo_total_dias: { type: Type.STRING, description: 'Dias totais estimados' },
    tempo_floracao_dias: { type: Type.STRING, description: 'Tempo de floração em dias' },
    altura_esperada: {
      type: Type.OBJECT,
      properties: {
        vega: { type: Type.STRING, description: 'Altura ao final do vegetativo' },
        final: { type: Type.STRING, description: 'Altura máxima final' },
      },
      required: ['vega', 'final'],
    },
    nivel_dificuldade: { type: Type.INTEGER, description: 'Nível de 1 (muito fácil) a 5 (especialista)' },
    producao_estimada: {
      type: Type.OBJECT,
      properties: {
        indoor: { type: Type.STRING, description: 'Rendimento indoor g/m²' },
        outdoor: { type: Type.STRING, description: 'Rendimento outdoor g/planta' },
      },
      required: ['indoor', 'outdoor'],
    },
    faixa_thc_cbd: {
      type: Type.OBJECT,
      properties: {
        thc: { type: Type.STRING, description: 'Porcentagem de THC estimada' },
        cbd: { type: Type.STRING, description: 'Porcentagem de CBD estimada' },
      },
      required: ['thc', 'cbd'],
    },
    terpenos_dominantes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Terpenos dominantes encontrados na strain',
    },
    perfil_aroma_sabor: { type: Type.STRING, description: 'Descritores de paladar e odor' },
    tolerancias: {
      type: Type.OBJECT,
      properties: {
        clima: { type: Type.STRING, description: 'Tolerância a calor, frio e oscilações' },
        pragas: { type: Type.STRING, description: 'Tolerância a ácaros, trips e pragas comuns' },
        mofo: { type: Type.STRING, description: 'Tolerância a botrytis e oídio em flora' },
      },
      required: ['clima', 'pragas', 'mofo'],
    },
    confianca: { type: Type.STRING, enum: ['alta', 'media', 'baixa'] },
    observacao_incerteza: {
      type: Type.STRING,
      description: 'Quando não houver dados confiáveis, dizer isso claramente. NUNCA inventar números. Se a genética for desconhecida, avisar e sugerir a categoria mais próxima.',
    },
    plano_fases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          fase_id: { type: Type.STRING, description: 'germinacao, plantula, vegetativo, pre_floracao, floracao, flush, secagem ou cura' },
          fase_nome: { type: Type.STRING },
          horas_luz: { type: Type.STRING, description: 'Ex: 18h luz / 6h escuro ou 12h / 12h' },
          temperatura_c: { type: Type.STRING, description: 'Temperatura recomendada em °C' },
          umidade_ur: { type: Type.STRING, description: 'Umidade relativa do ar em %' },
          vpd_kpa: { type: Type.STRING, description: 'Déficit de pressão de vapor ideal' },
          ph_rega: { type: Type.STRING, description: 'Faixa segura de pH da água e calda' },
          ec_ppm: { type: Type.STRING, description: 'Condutividade elétrica e PPM recomendados' },
          frequencia_rega: { type: Type.STRING, description: 'Diretriz de intervalo e volume' },
          nutrientes_cuidados: { type: Type.STRING, description: 'Nutrição específica para a genética' },
          podas_treinamentos: { type: Type.STRING, description: 'LST, Topping, desfolhação ou restrições' },
          erros_comuns: { type: Type.STRING, description: 'Armadilhas e erros mais comuns nesta fase' },
        },
        required: [
          'fase_id',
          'fase_nome',
          'horas_luz',
          'temperatura_c',
          'umidade_ur',
          'vpd_kpa',
          'ph_rega',
          'ec_ppm',
          'frequencia_rega',
          'nutrientes_cuidados',
          'podas_treinamentos',
          'erros_comuns',
        ],
      },
    },
  },
  required: [
    'nome',
    'breeder',
    'linhagem',
    'proporcao_indica_sativa_ruderalis',
    'fotoperiodo_ou_auto',
    'ciclo_total_dias',
    'tempo_floracao_dias',
    'altura_esperada',
    'nivel_dificuldade',
    'producao_estimada',
    'faixa_thc_cbd',
    'terpenos_dominantes',
    'perfil_aroma_sabor',
    'tolerancias',
    'confianca',
    'observacao_incerteza',
    'plano_fases',
  ],
};

const photoDiagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    descricao_visual: { type: Type.STRING, description: 'Descrição objetiva do estado foliar e morfológico visível na foto' },
    sinais_identificados: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Sintomas observados: clorose interveinal, pontas queimadas, garras, manchas necróticas, etc.',
    },
    possiveis_causas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tipo: {
            type: Type.STRING,
            enum: ['deficiencia', 'excesso', 'praga', 'fungo', 'estresse_ambiental', 'saudavel'],
          },
          titulo: { type: Type.STRING },
          explicacao: { type: Type.STRING },
          gravidade: { type: Type.STRING, enum: ['baixa', 'moderada', 'alta'] },
        },
        required: ['tipo', 'titulo', 'explicacao', 'gravidade'],
      },
    },
    confianca: { type: Type.STRING, enum: ['alta', 'media', 'baixa'] },
    proximos_passos: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Passo a passo prático começando por checar pH, rega e ambiente antes de culpar nutrientes',
    },
    precisa_mais_fotos: { type: Type.BOOLEAN, description: 'True se a foto estiver escura, sob luz de cultivo (blurple/HPS) ou com baixa resolução' },
    orientacoes_foto: { type: Type.STRING, description: 'Dicas sobre como tirar uma foto melhor se necessário' },
  },
  required: [
    'descricao_visual',
    'sinais_identificados',
    'possiveis_causas',
    'confianca',
    'proximos_passos',
    'precisa_mais_fotos',
  ],
};

// 1. Endpoint: Ficha da Genética (Structured JSON)
app.post('/api/gemini/genetics-sheet', async (req, res) => {
  try {
    const { strainName, breeder, medium, environment } = req.body;
    if (!strainName || typeof strainName !== 'string') {
      return res.status(400).json({ error: 'Nome da genética (strainName) é obrigatório.' });
    }

    const prompt = `Você é um agrônomo especialista mundial em genética e cultivo técnico de Cannabis.
Gere a Ficha da Genética completa para a strain "${strainName.trim()}"${breeder ? ` do breeder "${breeder.trim()}"` : ''}.
Contexto do cultivo informado pelo cultivador: Substrato/Meio: ${medium || 'Solo orgânico'}; Ambiente: ${environment || 'Indoor'}.

DIRETRIZES FUNDAMENTAIS:
1. Respostas em Português do Brasil com linguagem simples, técnica e direta.
2. NUNCA invente números ou dados fictícios. Se a genética for rara, clone local ou desconhecida, classifique "confianca" como "baixa" ou "media", aponte em "observacao_incerteza" as lacunas e ofereça a melhor aproximação botânica (ex: família Kush, Haze, Skunk, Cookies).
3. Forneça o plano de cultivo detalhado cobrindo TODAS as 8 fases fundamentais:
   - germinacao
   - plantula
   - vegetativo
   - pre_floracao
   - floracao
   - flush
   - secagem
   - cura
4. Inclua faixas realistas de temperatura, umidade, VPD, pH e EC adequadas para ${medium || 'solo ou substrato inerte'}.
5. Inclua podas e treinamentos recomendados para a morfologia desta linhagem específica (ex: se ramifica bem com LST ou se prefere haste única, se tolera Topping).`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: geneticsSheetSchema,
        systemInstruction: 'Você é um agrônomo mestre em horticultura canábica e botânica médica. Forneça fichas técnicas precisas sem inventar dados.',
        temperature: 0.3,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(jsonText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Erro em /api/gemini/genetics-sheet:', error);
    return res.status(500).json({
      error: 'Falha ao gerar ficha da genética.',
      details: error?.message || 'Erro inesperado no serviço de IA.',
    });
  }
});

// 2. Endpoint: Diagnóstico Fotográfico Multimodal
app.post('/api/gemini/photo-diagnosis', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', plantContext } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Imagem base64 é obrigatória para o diagnóstico visual.' });
    }

    // Clean base64 data if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const contextSummary = plantContext ? `
Contexto do espécime:
- Genética: ${plantContext.strain || 'Não informada'}
- Fase de desenvolvimento: ${plantContext.stage || 'Não informada'} (${plantContext.days_in_stage || 0} dias nesta fase)
- Substrato: ${plantContext.medium || 'Solo orgânico'}
- Fotoperíodo: ${plantContext.photoperiod || '18/6'}
- Vaso: ${plantContext.pot_size_liters ? `${plantContext.pot_size_liters}L` : 'Não informado'}
- Ambiente: ${plantContext.environment || 'Indoor'}
` : 'Cultivo sem contexto prévio fornecido.';

    const promptText = `Você é um agrônomo fitopatologista e especialista em cultivo de Cannabis.
Analise a foto anexada desta planta de cannabis considerando o contexto atual do cultivo.

${contextSummary}

DIRETRIZES DE DIAGNÓSTICO:
1. Descreva minuciosamente o que você observa na estrutura foliar (coloração, turgor, bordo das folhas, nervuras, ápice e cálices).
2. Se a iluminação da foto for de baixa qualidade, colorida (luz roxa blurple ou amarela de sódio) ou se a resolução impedir uma conclusão segura, marque "precisa_mais_fotos": true e peça educadamente uma foto sob luz branca neutra e ângulo aproximado, SEM CHUTAR.
3. Se identificar sintomas, priorize a regra de ouro:
   - 1º Verificar pH da calda e do escorrimento (runoff) e excesso/falta de água.
   - 2º Verificar parâmetros de temperatura e umidade relativa (VPD).
   - 3º Somente culpe carência de nutrientes se o pH e a rega estiverem comprovadamente equilibrados (muitas deficiências aparentes são 'lockout' de pH!).
4. Seja prático e direto em português do Brasil.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: photoDiagnosisSchema,
        systemInstruction: 'Você é um fitopatologista botânico rigoroso. Seja factual e nunca afirme com certeza o que uma foto de baixa qualidade não comprovar.',
        temperature: 0.2,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(jsonText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Erro em /api/gemini/photo-diagnosis:', error);
    return res.status(500).json({
      error: 'Falha ao analisar foto da planta.',
      details: error?.message || 'Erro inesperado no processamento da imagem.',
    });
  }
});

// 3. Endpoint: Chat com Streaming (Server-Sent Events)
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, geneticsSheet, plantContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Array de mensagens é obrigatório.' });
    }

    // Build context prompt
    const geneticsSummary = geneticsSheet ? `
GENÉTICA DA PLANTA:
- Nome: ${geneticsSheet.nome} (${geneticsSheet.proporcao_indica_sativa_ruderalis})
- Breeder: ${geneticsSheet.breeder}
- Tempo de Floração: ${geneticsSheet.tempo_floracao_dias}
- Nível de Dificuldade: ${geneticsSheet.nivel_dificuldade}/5
- Terpenos: ${Array.isArray(geneticsSheet.terpenos_dominantes) ? geneticsSheet.terpenos_dominantes.join(', ') : ''}
- Tolerâncias: Clima: ${geneticsSheet.tolerancias?.clima || ''} | Pragas: ${geneticsSheet.tolerancias?.pragas || ''} | Mofo: ${geneticsSheet.tolerancias?.mofo || ''}
` : 'Nenhuma ficha de genética anexada.';

    const plantSummary = plantContext ? `
CONTEXTO ATUAL DA PLANTA DO CULTIVADOR:
- Nome/Identificador: ${plantContext.plant_name || 'Espécime'}
- Estágio de Crescimento: ${plantContext.stage} (há ${plantContext.days_in_stage || 1} dias nesta fase; dia ${plantContext.total_days || 1} no total)
- Substrato: ${plantContext.medium}
- Fotoperíodo: ${plantContext.photoperiod}
- Vaso: ${plantContext.pot_size_liters ? `${plantContext.pot_size_liters}L` : 'Não informado'}
- Tipo de Iluminação / Ambiente: ${plantContext.light_type || 'LED Quantum Board'} em ambiente ${plantContext.environment || 'Indoor'}
` : 'Nenhum contexto de planta específico fornecido.';

    const systemInstruction = `Você é o "Assistente de Cultivo & Genética" do aplicativo Minha Plantinha.
Você é um consultor agronômico sênior especializado em horticultura avançada e cultivo terapêutico de Cannabis.

INFORMAÇÕES CARREGADAS:
${geneticsSummary}
${plantSummary}

REGRAS DE CONDUTA ESTREITAS:
1. Responda em Português do Brasil com linguagem simples, amigável, técnica e direta ao ponto.
2. Sempre considere a genética e o contexto da planta informados acima ao formular recomendações.
3. Respostas curtas e práticas. Quando envolver uma ação, organize em passos numerados (1, 2, 3...).
4. Admita com honestidade quando não souber algo ou quando as informações forem insuficientes.
5. REGRA DE OURO DA HORTICULTURA: Sempre instrua a checar o pH (da água e do runoff), a drenagem/frequência de rega e os fatores ambientais (temperatura, umidade, VPD) ANTES de apontar falta de nutrientes ou indicar aplicar mais fertilizantes. A maioria dos problemas em cannabis decorre de excesso de água ou bloqueio de nutrientes por pH desregulado.
6. Nunca dê receitas perigosas de pesticidas químicos caseiros tóxicos; priorize controle biológico, óleo de neem ou sabão potássico na fase vegetativa (NUNCA em floração avançada).
7. Mantenha um tom profissional, acolhedor e focado no bem-estar vegetal.`;

    // Format chat history for Gemini
    const contents: any[] = [];
    messages.forEach((msg: any) => {
      if (msg.role === 'user') {
        const parts: any[] = [{ text: msg.content }];
        if (msg.photoUrl && msg.photoUrl.startsWith('data:image/')) {
          const mimeMatch = msg.photoUrl.match(/^data:(image\/[a-zA-Z]+);base64,/);
          const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const b64 = msg.photoUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: mime,
              data: b64,
            },
          });
        }
        contents.push({ role: 'user', parts });
      } else if (msg.role === 'assistant') {
        contents.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    });

    // Setup SSE response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Erro em /api/gemini/chat:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Falha no processamento do chat.',
        details: error?.message || 'Erro inesperado.',
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: error?.message || 'Erro durante a transmissão.' })}\n\n`);
      res.end();
    }
  }
});

// 4. Endpoint: Orientação Contextual Rápida ("O que fazer agora" & "Alertas da próxima semana")
app.post('/api/gemini/plant-advice', async (req, res) => {
  try {
    const { plantContext, geneticsSheet } = req.body;

    const prompt = `Considere este cultivo de Cannabis:
- Genética: ${geneticsSheet?.nome || plantContext?.strain || 'Híbrida'}
- Estágio: ${plantContext?.stage || 'vegetativo'}
- Meio: ${plantContext?.medium || 'solo_organico'}
- Fotoperíodo: ${plantContext?.photoperiod || '18/6'}
- Dias na fase atual: ${plantContext?.days_in_stage || 1} dias (Total: ${plantContext?.total_days || 1} dias)
- Vaso: ${plantContext?.pot_size_liters || 11}L

Gere um diagnóstico contextual contendo:
1. "o_que_fazer_agora": lista de 3 a 4 ações práticas imediatas para os próximos 2 a 3 dias.
2. "alertas_proxima_semana": lista de 2 a 3 pontos de atenção para os próximos 7 a 10 dias.
3. "alvos_recomendados": valores numéricos exatos recomendados para ph, ec, temp, rh e vpd.`;

    const adviceSchema = {
      type: Type.OBJECT,
      properties: {
        o_que_fazer_agora: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        alertas_proxima_semana: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        alvos_recomendados: {
          type: Type.OBJECT,
          properties: {
            ph: { type: Type.NUMBER },
            ec: { type: Type.NUMBER },
            temp: { type: Type.NUMBER },
            rh: { type: Type.NUMBER },
            vpd: { type: Type.STRING },
          },
          required: ['ph', 'ec', 'temp', 'rh', 'vpd'],
        },
      },
      required: ['o_que_fazer_agora', 'alertas_proxima_semana', 'alvos_recomendados'],
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: adviceSchema,
        systemInstruction: 'Você é um orientador agronômico canábico. Seja cirúrgico, preciso e prático.',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Erro em /api/gemini/plant-advice:', error);
    return res.status(500).json({ error: 'Falha ao gerar orientações contextuais.' });
  }
});

// ==========================================
// FEEDBACK DOS USUÁRIOS (BETA FECHADA)
// ==========================================
const FEEDBACK_FILE = path.join(path.resolve('.', 'data'), 'feedbacks.json');

app.post('/api/feedback', (req, res) => {
  try {
    const { type = 'sugestao', rating = 5, message, email, userId = 'default_user' } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem de feedback é obrigatória.' });
    }

    const feedbackEntry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      type: ['sugestao', 'defeito', 'elogio', 'outro'].includes(type) ? type : 'outro',
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      message: message.trim().slice(0, 2000),
      email: email ? String(email).trim().slice(0, 150) : undefined,
      createdAt: new Date().toISOString()
    };

    let feedbacks: any[] = [];
    const dataDir = path.resolve('.', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(FEEDBACK_FILE)) {
      try {
        feedbacks = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
      } catch {
        feedbacks = [];
      }
    }
    feedbacks.push(feedbackEntry);
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2), 'utf-8');

    return res.status(201).json({
      success: true,
      id: feedbackEntry.id,
      message: 'Feedback recebido com sucesso! Muito obrigado pela sua contribuição para a versão beta.'
    });
  } catch (err: any) {
    console.error('Erro ao salvar feedback:', err);
    return res.status(500).json({ error: 'Erro ao processar feedback.' });
  }
});

app.get('/api/feedback', (req, res) => {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      const data = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
      return res.json({ feedbacks: data });
    }
    return res.json({ feedbacks: [] });
  } catch {
    return res.json({ feedbacks: [] });
  }
});

// ==========================================
// MÓDULOS DE IA INDEPENDENTES COM CONTROLE DE CONSUMO
// ==========================================

// 1. Endpoint: Status de Consumo e Limites de IA
app.get('/api/ai/usage', (req, res) => {
  const userId = (req.query.userId as string) || 'default_user';
  const status = usageTracker.getStatus(userId);
  res.json(status);
});

// Endpoint administrativo/teste: Alterar plano do usuário
app.post('/api/ai/set-plan', (req, res) => {
  const { userId = 'default_user', plan = 'gratuito' } = req.body;
  const status = usageTracker.setPlan(userId, plan === 'apoiador' ? 'apoiador' : 'gratuito');
  res.json({ success: true, status });
});

// Endpoint de teste: Resetar cota de consumo
app.post('/api/ai/reset-quota', (req, res) => {
  const { userId = 'default_user' } = req.body;
  const status = usageTracker.resetForTesting(userId);
  res.json({ success: true, message: 'Cota de uso resetada para fins de teste.', status });
});

// Instrução de Sistema da IA Horta (Jardinagem Geral)
const HORTA_SYSTEM_INSTRUCTION = `Você é o consultor botânico especializado em jardinagem e horticultura tradicional do aplicativo Minha Plantinha.
Seu foco é orientar cultivadores no cuidado com folhagens ornamentais, plantas de interior, hortaliças, árvores frutíferas e suculentas.

DIRETRIZES ESTREITAS E OBRIGATÓRIAS:
1. ESTRUTURAÇÃO DA RESPOSTA (SEMPRE RESPEITE ESTES 4 BLOCOS):
   Organize sua resposta de forma clara e visualmente estruturada com os seguintes títulos:
   - 🔍 **OBSERVAÇÕES**: Liste apenas os fatos visíveis e objetivos informados na descrição ou observáveis na foto anexada. NUNCA confunda observação factual com conclusão final.
   - 💡 **HIPÓTESES**: Apresente as possíveis causas em ordem de probabilidade (ex: excesso de rega vs carência de luz vs pragas). Deixe claro que são hipóteses baseadas em sintomas compatíveis.
   - 📋 **RECOMENDAÇÕES PRÁTICAS**: Passos de manejo simples, seguros e preferencialmente orgânicos (ex: teste do dedo no solo, drenagem, adubação com húmus/bokashi, poda sanitária).
   - ⚠️ **DADOS FALTANTES & INCERTEZAS**: Aponte quais dados cruciais não foram fornecidos (ex: drenagem do vaso, exposição solar diária, histórico recente de regas) e alerte sobre os riscos de intervenções agressivas sem confirmação.

2. RIGOR COM FOTOS:
   - NUNCA forneça um diagnóstico categórico ou definitivo baseado apenas em fotos.
   - Se a foto for ambígua, borrada, com luz desfavorável ou não mostrar o verso das folhas, registre isso expressamente em Observações e solicite novas fotos detalhadas sob luz solar indireta.

3. LINGUAGEM E CONDUTA:
   - Português do Brasil com tom acolhedor, simples e tecnicamente correto.
   - Não use termos em inglês quando houver equivalente botânico claro em português.
   - Seja honesto: admita imediatamente quando faltarem informações para concluir.

4. ISOLAMENTO DE ESCOPO (HORTA TRADICIONAL):
   - Se o usuário perguntar sobre o cultivo de cannabis medicinal nesta rota, responda com gentileza e respeito aos limites:
     "Como consultor botânico da horta tradicional, sou especializado em folhagens, hortaliças e plantas ornamentais. Para análise técnica do cultivo medicinal de cannabis (parâmetros de pH, EC e fertirrigação), por favor utilize a nossa **IA Cannabis Medicinal** na seção correspondente do app."
   - Nunca misture recomendações da cannabis na horta nem vice-versa.`;

// Instrução de Sistema da IA Cannabis Medicinal
const CANNABIS_SYSTEM_INSTRUCTION = `Você é o consultor agronômico especializado em manejo botânico e horticultura técnica de Cannabis Medicinal do aplicativo Minha Plantinha.
Seu papel é auxiliar pacientes e cultivadores no monitoramento fitossanitário e agronômico de seus espécimes vegetais.

DIRETRIZES FUNDAMENTAIS DE SEGURANÇA MÉDICA E JURÍDICA:
1. VEDAÇÃO MÉDICA E NÃO PRESCRIÇÃO:
   - NUNCA prescreva medicamentos, extratos caseiros, posologias, dosagens de miligramas ou tratamentos de saúde para enfermidades humanas.
   - O Minha Plantinha é uma ferramenta estritamente agronômica e botânica, NÃO um serviço de saúde.
   - Se a dúvida do cultivador envolver posologia, sintomas de doenças humanas ou tratamento terapêutico, recomende expressamente a consulta com o médico prescritor ou equipe de saúde legalmente habilitada.

2. CONFORMIDADE LEGAL:
   - NUNCA incentive o comércio ilegal, desvio de uso ou cultivo em desacordo com as decisões judiciais e regulamentações sanitárias vigentes.
   - Recomende orientação jurídica especializada ou acompanhamento junto a associações de pacientes autorizadas caso surjam dúvidas legais.

3. ESTRUTURAÇÃO DA RESPOSTA (SEMPRE RESPEITE ESTES 4 BLOCOS):
   Organize sua resposta de forma técnica, limpa e estruturada:
   - 🔍 **OBSERVAÇÕES DO CULTIVO**: Análise factual das características visíveis, histórico fenológico (fase atual, fotoperíodo, dias de floração) e métricas instrumentais fornecidas (pH, EC, temperatura, umidade).
   - 💡 **HIPÓTESES AGRONÔMICAS**: Causas técnicas prováveis para as anomalias observadas. REGRA DE OURO: Investigue sempre drenagem, saturação hídrica e faixa de pH da calda/runoff ANTES de atribuir sintomas a deficiências nutricionais (a imensa maioria dos bloqueios/lockouts provém de pH descalibrado).
   - 📋 **RECOMENDAÇÕES DE MANEJO**: Ações práticas e seguras de estabilização agronômica em ordem de prioridade.
   - ⚠️ **DADOS FALTANTES & LIMITAÇÕES**: Aponte quais parâmetros instrumentais indispensáveis não foram aferidos (ex: pH do runoff, valor de EC/PPM, VPD, temperatura no topo do dossel) e alerte sobre os riscos de fertilizações precipitadas.

4. RIGOR COM FOTOS:
   - NUNCA dê diagnóstico categórico baseado em fotos.
   - Se a imagem estiver sob iluminação artificial colorida (blurple LED ou lâmpadas HPS amareladas), registre que a avaliação espectral está comprometida e solicite foto sob luz branca neutra (CRI alto) com lente limpa.

5. ISOLAMENTO DE ESCOPO:
   - Se o usuário perguntar sobre hortaliças comuns, árvores ou plantas ornamentais nesta rota, oriente cordialmente a utilizar a **IA Horta** na área correspondente do aplicativo.`;

// 2. Rota: IA Horta (Jardinagem Geral e Plantas Ornamentais)
app.post('/api/ai/horta', async (req, res) => {
  try {
    const {
      message,
      history = [],
      selectedPlant,
      recentDiary = [],
      recentEvents = [],
      weatherData,
      photoBase64,
      mimeType = 'image/jpeg',
      userId = 'default_user',
    } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem do usuário é obrigatória.' });
    }

    // 1. Controle de Consumo / Rate Limit
    const limitCheck = usageTracker.checkLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        error: 'limite_atingido',
        motivo: limitCheck.reason,
        mensagem:
          limitCheck.reason === 'daily'
            ? `Você atingiu seu limite diário de ${limitCheck.dailyLimit} consultas gratuitas de IA hoje no plano ${limitCheck.plan}. O limite é renovado diariamente.`
            : `Você atingiu seu limite mensal de ${limitCheck.monthlyLimit} consultas de IA neste mês no plano ${limitCheck.plan}.`,
        status: limitCheck,
      });
    }

    // 2. Verificação de chave de API no servidor
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'ia_indisponivel',
        mensagem:
          'O serviço de Inteligência Artificial está temporariamente indisponível no servidor (chave de API não configurada).',
      });
    }

    // 3. Montagem do Contexto Botânico da Horta
    let contextPrompt = 'CONTEXTO AMBIENTAL & COLEÇÃO:\n';
    if (weatherData) {
      contextPrompt += `- Clima Local Atual: ${weatherData.temperature}°C, umidade ${weatherData.humidity}%, probabilidade de chuva ${weatherData.rain_prob}%, vento ${weatherData.wind_speed} km/h (Condição: ${weatherData.condition}).\n`;
    }

    if (selectedPlant) {
      contextPrompt += `\nPLANTA EM FOCO SELECIONADA PELO CULTIVADOR:
- Nome: ${selectedPlant.name}
- Espécie/Variedade: ${selectedPlant.species || 'Não informada'}
- Data de Aquisição: ${selectedPlant.acquired_date || 'Não informada'}
- Localização no Ambiente: ${selectedPlant.location || 'Não especificada'}
- Nível de Luminosidade: ${selectedPlant.light_level || 'Não especificado'}
- Intervalo de Rega Programado: a cada ${selectedPlant.watering_frequency_days || 3} dias
- Observações Cadastradas: ${selectedPlant.notes || 'Nenhuma'}\n`;
    } else {
      contextPrompt += '\nNenhuma planta específica selecionada (pergunta geral sobre jardinagem/horta).\n';
    }

    if (Array.isArray(recentDiary) && recentDiary.length > 0) {
      contextPrompt += '\nÚLTIMOS REGISTROS NO DIÁRIO DA PLANTA:\n';
      recentDiary.slice(0, 3).forEach((d: any) => {
        contextPrompt += `- [${d.entry_date}]: ${d.content}\n`;
      });
    }

    if (Array.isArray(recentEvents) && recentEvents.length > 0) {
      contextPrompt += '\nÚLTIMOS CUIDADOS E REGAS REGISTRADOS:\n';
      recentEvents.slice(0, 4).forEach((ev: any) => {
        contextPrompt += `- [${ev.event_date}] ${ev.event_type}${ev.notes ? ` (${ev.notes})` : ''}\n`;
      });
    }

    // 4. Formatação de histórico e peças de conteúdo
    const contents: any[] = [];

    // Limita histórico recente às últimas 6 mensagens para manter foco e controlar tokens
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const h of recentHistory) {
        if (h.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: h.content }] });
        } else if (h.role === 'assistant') {
          contents.push({ role: 'model', parts: [{ text: h.content }] });
        }
      }
    }

    // Peça do usuário atual com o contexto e imagem (se houver)
    const currentParts: any[] = [];
    currentParts.push({
      text: `${contextPrompt}\nPERGUNTA DO CULTIVADOR:\n${message.trim()}`,
    });

    if (photoBase64 && typeof photoBase64 === 'string') {
      const cleanB64 = photoBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      if (cleanB64.length > 10) {
        currentParts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanB64,
          },
        });
      }
    }

    contents.push({ role: 'user', parts: currentParts });

    // 5. Chamada resiliente aos modelos Gemini
    const { response, modelUsed } = await generateGeminiContentWithFallback({
      contents,
      config: {
        systemInstruction: HORTA_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const reply = response.text || 'Não foi possível gerar uma resposta detalhada no momento.';

    // 6. Registro de consumo e custo
    const promptTokens = response.usageMetadata?.promptTokenCount || 0;
    const candidateTokens = response.usageMetadata?.candidatesTokenCount || 0;
    const usageResult = usageTracker.recordUsage(userId, 'horta', promptTokens, candidateTokens);

    return res.json({
      reply,
      usage: {
        promptTokens,
        candidateTokens,
        totalTokens: promptTokens + candidateTokens,
        costUSD: usageResult.costUSD,
        usedToday: usageResult.usedToday,
        remainingToday: usageResult.remainingToday,
      },
      status: usageTracker.getStatus(userId),
    });
  } catch (error: any) {
    console.error('Erro em /api/ai/horta:', error);
    return res.status(500).json({
      error: 'falha_processamento',
      mensagem: 'Falha ao processar consulta na IA Horta.',
      detalhes: error?.message || 'Erro interno no provedor de IA.',
    });
  }
});

// 3. Rota: IA Cannabis Medicinal (Manejo Técnico de Precisão)
app.post('/api/ai/cannabis', async (req, res) => {
  try {
    const {
      message,
      history = [],
      selectedPlant,
      recentFeedLogs = [],
      recentDiary = [],
      weatherData,
      photoBase64,
      mimeType = 'image/jpeg',
      userId = 'default_user',
    } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem do cultivador é obrigatória.' });
    }

    // 1. Controle de Consumo / Rate Limit
    const limitCheck = usageTracker.checkLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        error: 'limite_atingido',
        motivo: limitCheck.reason,
        mensagem:
          limitCheck.reason === 'daily'
            ? `Você atingiu seu limite diário de ${limitCheck.dailyLimit} consultas gratuitas de IA hoje no plano ${limitCheck.plan}. O limite é renovado diariamente.`
            : `Você atingiu seu limite mensal de ${limitCheck.monthlyLimit} consultas de IA neste mês no plano ${limitCheck.plan}.`,
        status: limitCheck,
      });
    }

    // 2. Verificação de chave de API no servidor
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'ia_indisponivel',
        mensagem:
          'O serviço de Inteligência Artificial está temporariamente indisponível no servidor (chave de API não configurada).',
      });
    }

    // 3. Montagem do Contexto Agronômico da Cannabis
    let contextPrompt = 'CONTEXTO AGRONÔMICO DO CULTIVO:\n';
    if (weatherData) {
      contextPrompt += `- Clima Local: ${weatherData.temperature}°C, umidade ${weatherData.humidity}%, chuva ${weatherData.rain_prob}%, vento ${weatherData.wind_speed} km/h.\n`;
    }

    if (selectedPlant) {
      contextPrompt += `\nESPÉCIME EM FOCO SELECIONADO:
- Identificador / Nome: ${selectedPlant.name}
- Genética / Strain: ${selectedPlant.strain || 'Não informada'}
- Fase Fenológica Atual: ${selectedPlant.stage || 'vegetativo'}
- Início da Fase Atual: ${selectedPlant.stage_start_date || 'Não informada'}
- Data de Germinação: ${selectedPlant.germination_date || 'Não informada'}
- Substrato / Meio: ${selectedPlant.medium || 'Solo orgânico'}
- Fotoperíodo: ${selectedPlant.photoperiod || '18/6'}
- Volume do Vaso: ${selectedPlant.pot_size_liters ? `${selectedPlant.pot_size_liters}L` : 'Não informado'}
- Tipo de Iluminação: ${selectedPlant.light_type || 'LED Quantum Board'}
- Ambiente: ${selectedPlant.environment || 'Indoor'}\n`;
    } else {
      contextPrompt += '\nNenhum espécime específico selecionado (consulta geral sobre cultivo técnico).\n';
    }

    if (Array.isArray(recentFeedLogs) && recentFeedLogs.length > 0) {
      contextPrompt += '\nÚLTIMOS REGISTROS DE REGA & FERTIRRIGAÇÃO:\n';
      recentFeedLogs.slice(0, 3).forEach((f: any) => {
        contextPrompt += `- [${f.log_date}] pH entrada: ${f.ph_in ?? '-'} | EC entrada: ${f.ec_in_ms ?? '-'} mS/cm | pH runoff: ${f.ph_runoff ?? '-'} | Volume: ${f.water_volume_liters ?? '-'}L | Nutrientes: ${f.nutrients_notes || 'Água pura'}\n`;
      });
    }

    if (Array.isArray(recentDiary) && recentDiary.length > 0) {
      contextPrompt += '\nÚLTIMOS REGISTROS DO DIÁRIO VISUAL:\n';
      recentDiary.slice(0, 3).forEach((d: any) => {
        contextPrompt += `- [${d.entry_date}]: ${d.content}\n`;
      });
    }

    // 4. Formatação de histórico e peças de conteúdo
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const h of recentHistory) {
        if (h.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: h.content }] });
        } else if (h.role === 'assistant') {
          contents.push({ role: 'model', parts: [{ text: h.content }] });
        }
      }
    }

    const currentParts: any[] = [];
    currentParts.push({
      text: `${contextPrompt}\nPERGUNTA DO CULTIVADOR:\n${message.trim()}`,
    });

    if (photoBase64 && typeof photoBase64 === 'string') {
      const cleanB64 = photoBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      if (cleanB64.length > 10) {
        currentParts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanB64,
          },
        });
      }
    }

    contents.push({ role: 'user', parts: currentParts });

    // 5. Chamada resiliente aos modelos Gemini
    const { response, modelUsed } = await generateGeminiContentWithFallback({
      contents,
      config: {
        systemInstruction: CANNABIS_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const reply = response.text || 'Não foi possível gerar uma resposta agronômica no momento.';

    // 6. Registro de consumo e custo
    const promptTokens = response.usageMetadata?.promptTokenCount || 0;
    const candidateTokens = response.usageMetadata?.candidatesTokenCount || 0;
    const usageResult = usageTracker.recordUsage(userId, 'cannabis', promptTokens, candidateTokens);

    return res.json({
      reply,
      usage: {
        promptTokens,
        candidateTokens,
        totalTokens: promptTokens + candidateTokens,
        costUSD: usageResult.costUSD,
        usedToday: usageResult.usedToday,
        remainingToday: usageResult.remainingToday,
      },
      status: usageTracker.getStatus(userId),
    });
  } catch (error: any) {
    console.error('Erro em /api/ai/cannabis:', error);
    return res.status(500).json({
      error: 'falha_processamento',
      mensagem: 'Falha ao processar consulta na IA Cannabis Medicinal.',
      detalhes: error?.message || 'Erro interno no provedor de IA.',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Minha Plantinha - Cannabis Genetics Assistant',
    model: MODEL_NAME,
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Start server with Vite middleware in development or static in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('.', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌿 Minha Plantinha backend + frontend rodando em http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Erro ao inicializar servidor:', err);
  });
}

export default app;
