import { CannabisGrowthStage, CannabisMedium, CannabisPhotoperiod } from './index.ts';

export type GeneticsConfidence = 'alta' | 'media' | 'baixa';

export interface CultivationPhasePlan {
  fase_id: CannabisGrowthStage;
  fase_nome: string;
  horas_luz: string;
  temperatura_c: string;
  umidade_ur: string;
  vpd_kpa: string;
  ph_rega: string;
  ec_ppm: string;
  frequencia_rega: string;
  nutrientes_cuidados: string;
  podas_treinamentos: string;
  erros_comuns: string;
}

export interface GeneticsSheet {
  id?: string;
  nome: string;
  breeder: string;
  linhagem: string;
  proporcao_indica_sativa_ruderalis: string;
  fotoperiodo_ou_auto: 'fotoperiodo' | 'automatica';
  ciclo_total_dias: string;
  tempo_floracao_dias: string;
  altura_esperada: {
    vega: string;
    final: string;
  };
  nivel_dificuldade: number; // 1 to 5
  producao_estimada: {
    indoor: string;
    outdoor: string;
  };
  faixa_thc_cbd: {
    thc: string;
    cbd: string;
  };
  terpenos_dominantes: string[];
  perfil_aroma_sabor: string;
  tolerancias: {
    clima: string;
    pragas: string;
    mofo: string;
  };
  confianca: GeneticsConfidence;
  observacao_incerteza: string;
  plano_fases: CultivationPhasePlan[];
  criado_em?: string;
}

export interface PlantContextData {
  plant_id?: string;
  plant_name?: string;
  strain: string;
  stage: CannabisGrowthStage;
  medium: CannabisMedium;
  photoperiod: CannabisPhotoperiod;
  days_in_stage: number;
  total_days: number;
  pot_size_liters?: number;
  environment?: 'indoor' | 'outdoor' | 'estufa';
  light_type?: string;
}

export interface PlantContextAdvice {
  o_que_fazer_agora: string[];
  alertas_proxima_semana: string[];
  alvos_recomendados: {
    ph: number;
    ec: number;
    temp: number;
    rh: number;
    vpd: string;
  };
}

export interface PhotoDiagnosisResult {
  descricao_visual: string;
  sinais_identificados: string[];
  possiveis_causas: {
    tipo: 'deficiencia' | 'excesso' | 'praga' | 'fungo' | 'estresse_ambiental' | 'saudavel';
    titulo: string;
    explicacao: string;
    gravidade: 'baixa' | 'moderada' | 'alta';
  }[];
  confianca: GeneticsConfidence;
  proximos_passos: string[];
  precisa_mais_fotos: boolean;
  orientacoes_foto?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  photoUrl?: string;
}
