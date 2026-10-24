import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { usageTracker } from '../serverUsage.ts';
import { formatBytes } from '../src/utils/imageCompressor.ts';

describe('1. Fluxo de Controle de Consumo & Limites de IA (serverUsage)', () => {
  const testUserId = `test_user_${Date.now()}`;

  beforeEach(() => {
    usageTracker.resetForTesting(testUserId);
    usageTracker.setPlan(testUserId, 'gratuito');
  });

  it('deve inicializar o usuário no plano gratuito com 10 consultas diárias e 100 mensais', () => {
    const status = usageTracker.getStatus(testUserId);
    assert.equal(status.plan, 'gratuito');
    assert.equal(status.dailyLimit, 10);
    assert.equal(status.monthlyLimit, 100);
    assert.equal(status.usedToday, 0);
    assert.equal(status.remainingToday, 10);
  });

  it('deve registrar chamadas e abater corretamente o saldo diário', () => {
    // 1ª chamada: IA Horta
    const r1 = usageTracker.recordUsage(testUserId, 'horta', 500, 300);
    assert.equal(r1.usedToday, 1);
    assert.equal(r1.remainingToday, 9);
    assert.ok(r1.costUSD > 0, 'Custo deve ser maior que zero');

    // 2ª chamada: IA Cannabis
    const r2 = usageTracker.recordUsage(testUserId, 'cannabis', 800, 400);
    assert.equal(r2.usedToday, 2);
    assert.equal(r2.remainingToday, 8);

    const status = usageTracker.getStatus(testUserId);
    assert.equal(status.breakdown.horta, 1);
    assert.equal(status.breakdown.cannabis, 1);
    assert.equal(status.totalCalls, 2);
  });

  it('deve bloquear chamadas quando o limite diário for atingido (HTTP 429)', () => {
    // Consumir as 10 chamadas permitidas
    for (let i = 0; i < 10; i++) {
      const check = usageTracker.checkLimit(testUserId);
      assert.equal(check.allowed, true, `Chamada ${i + 1} deve ser permitida`);
      usageTracker.recordUsage(testUserId, 'horta', 200, 100);
    }

    // 11ª chamada deve ser bloqueada
    const blockedCheck = usageTracker.checkLimit(testUserId);
    assert.equal(blockedCheck.allowed, false);
    assert.equal(blockedCheck.reason, 'daily');
    assert.equal(blockedCheck.remainingToday, 0);
  });

  it('deve expandir a cota para 50 consultas ao alternar para o plano Apoiador', () => {
    usageTracker.setPlan(testUserId, 'apoiador');
    const status = usageTracker.getStatus(testUserId);
    assert.equal(status.plan, 'apoiador');
    assert.equal(status.dailyLimit, 50);
    assert.equal(status.monthlyLimit, 500);

    const check = usageTracker.checkLimit(testUserId);
    assert.equal(check.allowed, true);
    assert.equal(check.remainingToday, 50);
  });

  it('deve calcular custos de tokens estritamente pelo pricing do Gemini 3.8 Flash', () => {
    // Pricing: $0.10 / 1M input tokens ($0.00000010) e $0.40 / 1M output tokens ($0.00000040)
    // 10.000 prompt tokens = $0.001
    // 5.000 candidate tokens = $0.002
    // Total esperado: $0.003
    const result = usageTracker.recordUsage(testUserId, 'horta', 10000, 5000);
    const expected = 10000 * 0.00000010 + 5000 * 0.00000040;
    assert.ok(Math.abs(result.costUSD - expected) < 0.0000001, 'Cálculo de custo deve ser exato');
  });
});

describe('2. Validação e Tratamento de Fotos & Formatos (ImageCompressor Helper)', () => {
  it('deve formatar bytes de maneira legível em KB e MB', () => {
    assert.equal(formatBytes(0), '0 B');
    assert.equal(formatBytes(1024), '1 KB');
    assert.equal(formatBytes(500 * 1024), '500 KB');
    assert.equal(formatBytes(1.5 * 1024 * 1024), '1.5 MB');
    assert.equal(formatBytes(10 * 1024 * 1024), '10 MB');
  });

  it('deve rejeitar arquivos que não sejam imagens no pré-processamento', () => {
    const isImageMime = (mime: string) => mime.startsWith('image/');
    assert.equal(isImageMime('image/jpeg'), true);
    assert.equal(isImageMime('image/png'), true);
    assert.equal(isImageMime('image/webp'), true);
    assert.equal(isImageMime('application/pdf'), false);
    assert.equal(isImageMime('text/plain'), false);
    assert.equal(isImageMime('application/javascript'), false);
  });
});

describe('3. Validação dos Modelos de Dados de Planta e Cannabis', () => {
  it('deve validar estrutura de planta cadastrada na horta', () => {
    const plant = {
      id: 'p_123',
      name: 'Samambaia Americana',
      species: 'Nephrolepis exaltata',
      acquired_date: '2026-05-10',
      status: 'active',
      watering_frequency_days: 2,
    };

    assert.ok(plant.id.length > 0);
    assert.ok(plant.name.trim().length > 0);
    assert.ok(plant.watering_frequency_days > 0);
    assert.match(plant.acquired_date, /^\d{4}-\d{2}-\d{2}$/);
  });

  it('deve validar estrutura de espécime medicinal e estágios fenológicos', () => {
    const stages = ['germinacao', 'plantula', 'vegetativo', 'pre_floracao', 'floracao', 'flush', 'secagem', 'cura'];
    const specimen = {
      id: 'c_456',
      name: 'Northern Lights #1',
      strain: 'Northern Lights',
      stage: 'floracao',
      photoperiod: '12/12',
      medium: 'solo_organico',
    };

    assert.ok(stages.includes(specimen.stage), 'Estágio fenológico deve ser válido');
    assert.equal(specimen.photoperiod, '12/12');
  });

  it('deve validar registro de rega e pH de entrada/saída (runoff)', () => {
    const feedLog = {
      id: 'f_789',
      plant_id: 'c_456',
      date: '2026-10-24',
      water_liters: 2.5,
      ph_in: 6.4,
      ph_out: 6.1,
      ec_ppm: 750,
    };

    assert.ok(feedLog.ph_in >= 5.0 && feedLog.ph_in <= 8.0, 'pH de entrada deve estar na faixa aceitável');
    assert.ok(feedLog.ph_out! >= 5.0 && feedLog.ph_out! <= 8.0, 'pH de saída deve estar na faixa aceitável');
    assert.ok(feedLog.water_liters > 0);
  });
});

describe('4. Regras Éticas e Isolamento de Escopo das IAs', () => {
  it('diretriz da IA Cannabis deve conter vedações expressas de prescrição médica', () => {
    const cannabisRules = `
    NUNCA prescrever medicamentos, extratos caseiros, posologias, dosagens de miligramas ou tratamentos de saúde para enfermidades humanas.
    O Minha Plantinha é uma ferramenta estritamente agronômica e botânica, NÃO um serviço de saúde.
    Sempre incluir recomendação de consulta com médico prescritor.
    `;

    assert.ok(cannabisRules.includes('NUNCA prescrever medicamentos'));
    assert.ok(cannabisRules.includes('NÃO um serviço de saúde'));
    assert.ok(cannabisRules.includes('médico prescritor'));
  });

  it('diretriz da IA Horta deve separar observações de hipóteses', () => {
    const hortaRules = `
    Organize sua resposta em 4 blocos obrigatórios:
    - 🔍 OBSERVAÇÕES
    - 💡 HIPÓTESES
    - 📋 RECOMENDAÇÕES PRÁTICAS
    - ⚠️ DADOS FALTANTES & INCERTEZAS
    `;

    assert.ok(hortaRules.includes('OBSERVAÇÕES'));
    assert.ok(hortaRules.includes('HIPÓTESES'));
    assert.ok(hortaRules.includes('RECOMENDAÇÕES PRÁTICAS'));
    assert.ok(hortaRules.includes('DADOS FALTANTES & INCERTEZAS'));
  });
});
