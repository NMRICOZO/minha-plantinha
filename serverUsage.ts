import fs from 'fs';
import path from 'path';

export interface AiUsageRecord {
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  type: 'horta' | 'cannabis';
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  costUSD: number;
  timestamp: string;
}

export interface UserUsageProfile {
  userId: string;
  plan: 'gratuito' | 'apoiador';
  dailyLimit: number;
  monthlyLimit: number;
  records: AiUsageRecord[];
}

interface StorageSchema {
  users: Record<string, UserUsageProfile>;
}

const DATA_DIR = path.resolve('.', 'data');
const USAGE_FILE = path.join(DATA_DIR, 'ai_usage.json');

// Default limits
const PLAN_LIMITS = {
  gratuito: {
    dailyLimit: 10,
    monthlyLimit: 100,
  },
  apoiador: {
    dailyLimit: 50,
    monthlyLimit: 500,
  },
};

// Pricing per token for gemini-3.8-flash:
// $0.10 per 1M input tokens -> $0.00000010
// $0.40 per 1M output tokens -> $0.00000040
const COST_PER_INPUT_TOKEN = 0.00000010;
const COST_PER_OUTPUT_TOKEN = 0.00000040;

class UsageTracker {
  private data: StorageSchema = { users: {} };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(USAGE_FILE)) {
        const raw = fs.readFileSync(USAGE_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (e) {
      console.warn('Não foi possível carregar arquivo de uso de IA, iniciando em memória:', e);
      this.data = { users: {} };
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(USAGE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Falha ao persistir uso da IA:', e);
    }
  }

  private getTodayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getMonthStr(): string {
    return new Date().toISOString().slice(0, 7);
  }

  private getOrCreateUser(userId: string = 'default_user'): UserUsageProfile {
    const id = userId || 'default_user';
    if (!this.data.users[id]) {
      this.data.users[id] = {
        userId: id,
        plan: 'gratuito',
        dailyLimit: PLAN_LIMITS.gratuito.dailyLimit,
        monthlyLimit: PLAN_LIMITS.gratuito.monthlyLimit,
        records: [],
      };
      this.save();
    }
    return this.data.users[id];
  }

  public checkLimit(userId: string = 'default_user'): {
    allowed: boolean;
    reason?: 'daily' | 'monthly';
    usedToday: number;
    dailyLimit: number;
    usedThisMonth: number;
    monthlyLimit: number;
    remainingToday: number;
    plan: string;
  } {
    const user = this.getOrCreateUser(userId);
    const today = this.getTodayStr();
    const month = this.getMonthStr();

    const usedToday = user.records.filter((r) => r.date === today).length;
    const usedThisMonth = user.records.filter((r) => r.month === month).length;

    const remainingToday = Math.max(0, user.dailyLimit - usedToday);

    if (usedToday >= user.dailyLimit) {
      return {
        allowed: false,
        reason: 'daily',
        usedToday,
        dailyLimit: user.dailyLimit,
        usedThisMonth,
        monthlyLimit: user.monthlyLimit,
        remainingToday,
        plan: user.plan,
      };
    }

    if (usedThisMonth >= user.monthlyLimit) {
      return {
        allowed: false,
        reason: 'monthly',
        usedToday,
        dailyLimit: user.dailyLimit,
        usedThisMonth,
        monthlyLimit: user.monthlyLimit,
        remainingToday,
        plan: user.plan,
      };
    }

    return {
      allowed: true,
      usedToday,
      dailyLimit: user.dailyLimit,
      usedThisMonth,
      monthlyLimit: user.monthlyLimit,
      remainingToday,
      plan: user.plan,
    };
  }

  public recordUsage(
    userId: string = 'default_user',
    type: 'horta' | 'cannabis',
    promptTokens: number = 0,
    candidateTokens: number = 0
  ): {
    costUSD: number;
    usedToday: number;
    remainingToday: number;
  } {
    const user = this.getOrCreateUser(userId);
    const today = this.getTodayStr();
    const month = this.getMonthStr();

    const safePrompt = Math.max(0, promptTokens);
    const safeCandidate = Math.max(0, candidateTokens);
    const totalTokens = safePrompt + safeCandidate;

    const costUSD = safePrompt * COST_PER_INPUT_TOKEN + safeCandidate * COST_PER_OUTPUT_TOKEN;

    const record: AiUsageRecord = {
      date: today,
      month: month,
      type,
      promptTokens: safePrompt,
      candidateTokens: safeCandidate,
      totalTokens,
      costUSD,
      timestamp: new Date().toISOString(),
    };

    user.records.push(record);

    // Keep only last 500 records per user to prevent unbounded growth
    if (user.records.length > 500) {
      user.records = user.records.slice(-500);
    }

    this.save();

    const usedToday = user.records.filter((r) => r.date === today).length;
    const remainingToday = Math.max(0, user.dailyLimit - usedToday);

    return {
      costUSD,
      usedToday,
      remainingToday,
    };
  }

  public getStatus(userId: string = 'default_user') {
    const user = this.getOrCreateUser(userId);
    const today = this.getTodayStr();
    const month = this.getMonthStr();

    const todayRecords = user.records.filter((r) => r.date === today);
    const monthRecords = user.records.filter((r) => r.month === month);

    const usedToday = todayRecords.length;
    const usedThisMonth = monthRecords.length;
    const remainingToday = Math.max(0, user.dailyLimit - usedToday);

    const totalCostUSD = user.records.reduce((acc, r) => acc + (r.costUSD || 0), 0);
    const totalTokens = user.records.reduce((acc, r) => acc + (r.totalTokens || 0), 0);

    const hortaCalls = user.records.filter((r) => r.type === 'horta').length;
    const cannabisCalls = user.records.filter((r) => r.type === 'cannabis').length;

    return {
      userId: user.userId,
      plan: user.plan,
      dailyLimit: user.dailyLimit,
      monthlyLimit: user.monthlyLimit,
      usedToday,
      usedThisMonth,
      remainingToday,
      totalCostUSD: Number(totalCostUSD.toFixed(6)),
      totalTokens,
      totalCalls: user.records.length,
      breakdown: {
        horta: hortaCalls,
        cannabis: cannabisCalls,
      },
    };
  }

  public setPlan(userId: string = 'default_user', plan: 'gratuito' | 'apoiador') {
    const user = this.getOrCreateUser(userId);
    user.plan = plan;
    user.dailyLimit = PLAN_LIMITS[plan].dailyLimit;
    user.monthlyLimit = PLAN_LIMITS[plan].monthlyLimit;
    this.save();
    return this.getStatus(userId);
  }

  public resetForTesting(userId: string = 'default_user') {
    const user = this.getOrCreateUser(userId);
    user.records = [];
    this.save();
    return this.getStatus(userId);
  }
}

export const usageTracker = new UsageTracker();
