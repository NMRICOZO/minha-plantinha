import { Plant, CannabisPlant, WeatherData, DiaryEntry, PlantEvent, CannabisFeedLog } from '../types/index.ts';

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  photoUrl?: string;
  timestamp: string;
  tokens?: {
    promptTokens: number;
    candidateTokens: number;
    totalTokens: number;
    costUSD: number;
  };
}

export interface AiUsageStatus {
  userId: string;
  plan: 'gratuito' | 'apoiador';
  dailyLimit: number;
  monthlyLimit: number;
  usedToday: number;
  usedThisMonth: number;
  remainingToday: number;
  totalCostUSD: number;
  totalTokens: number;
  totalCalls: number;
  breakdown: {
    horta: number;
    cannabis: number;
  };
}

const STORAGE_KEYS = {
  HORTA_CHAT: 'minha_plantinha_chat_horta_v2',
  CANNABIS_CHAT: 'minha_plantinha_chat_cannabis_v2',
};

class AiService {
  // 1. Histórico Isolado da IA Horta
  getHortaHistory(): AiChatMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HORTA_CHAT);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveHortaHistory(messages: AiChatMessage[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.HORTA_CHAT, JSON.stringify(messages.slice(-30)));
    } catch (e) {
      console.warn('Falha ao salvar histórico da IA Horta:', e);
    }
  }

  clearHortaHistory() {
    localStorage.removeItem(STORAGE_KEYS.HORTA_CHAT);
  }

  // 2. Histórico Isolado da IA Cannabis Medicinal
  getCannabisHistory(): AiChatMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CANNABIS_CHAT);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveCannabisHistory(messages: AiChatMessage[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CANNABIS_CHAT, JSON.stringify(messages.slice(-30)));
    } catch (e) {
      console.warn('Falha ao salvar histórico da IA Cannabis:', e);
    }
  }

  clearCannabisHistory() {
    localStorage.removeItem(STORAGE_KEYS.CANNABIS_CHAT);
  }

  // 3. Obter status de cota e consumo
  async getUsageStatus(userId: string = 'default_user'): Promise<AiUsageStatus> {
    const res = await fetch(`/api/ai/usage?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) {
      throw new Error(`Falha ao obter status de uso: HTTP ${res.status}`);
    }
    return res.json();
  }

  // 4. Alterar plano de uso
  async setPlan(userId: string = 'default_user', plan: 'gratuito' | 'apoiador'): Promise<AiUsageStatus> {
    const res = await fetch('/api/ai/set-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan }),
    });
    const data = await res.json();
    return data.status;
  }

  // 5. Resetar cota para testes
  async resetQuota(userId: string = 'default_user'): Promise<AiUsageStatus> {
    const res = await fetch('/api/ai/reset-quota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data.status;
  }

  // 6. Consulta à IA Horta
  async sendHortaQuery(params: {
    message: string;
    history?: AiChatMessage[];
    selectedPlant?: Plant | null;
    recentDiary?: DiaryEntry[];
    recentEvents?: PlantEvent[];
    weatherData?: WeatherData | null;
    photoBase64?: string;
    userId?: string;
  }): Promise<{ reply: string; usage: any; status: AiUsageStatus }> {
    const payload = {
      message: params.message,
      history: (params.history || []).map((h) => ({ role: h.role, content: h.content })),
      selectedPlant: params.selectedPlant || null,
      recentDiary: params.recentDiary || [],
      recentEvents: params.recentEvents || [],
      weatherData: params.weatherData || null,
      photoBase64: params.photoBase64 || null,
      userId: params.userId || 'default_user',
    };

    const res = await fetch('/api/ai/horta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) {
      const errData = await res.json();
      const err = new Error(errData.mensagem || 'Limite de uso diário atingido.');
      (err as any).isQuotaExceeded = true;
      (err as any).quotaStatus = errData.status;
      throw err;
    }

    if (res.status === 503) {
      const errData = await res.json();
      throw new Error(errData.mensagem || 'Serviço de IA indisponível.');
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.mensagem || errData.error || `Erro HTTP ${res.status}`);
    }

    return res.json();
  }

  // 7. Consulta à IA Cannabis Medicinal
  async sendCannabisQuery(params: {
    message: string;
    history?: AiChatMessage[];
    selectedPlant?: CannabisPlant | null;
    recentFeedLogs?: CannabisFeedLog[];
    recentDiary?: DiaryEntry[];
    weatherData?: WeatherData | null;
    photoBase64?: string;
    userId?: string;
  }): Promise<{ reply: string; usage: any; status: AiUsageStatus }> {
    const payload = {
      message: params.message,
      history: (params.history || []).map((h) => ({ role: h.role, content: h.content })),
      selectedPlant: params.selectedPlant || null,
      recentFeedLogs: params.recentFeedLogs || [],
      recentDiary: params.recentDiary || [],
      weatherData: params.weatherData || null,
      photoBase64: params.photoBase64 || null,
      userId: params.userId || 'default_user',
    };

    const res = await fetch('/api/ai/cannabis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) {
      const errData = await res.json();
      const err = new Error(errData.mensagem || 'Limite de uso diário atingido.');
      (err as any).isQuotaExceeded = true;
      (err as any).quotaStatus = errData.status;
      throw err;
    }

    if (res.status === 503) {
      const errData = await res.json();
      throw new Error(errData.mensagem || 'Serviço de IA indisponível.');
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.mensagem || errData.error || `Erro HTTP ${res.status}`);
    }

    return res.json();
  }
}

export const aiService = new AiService();
