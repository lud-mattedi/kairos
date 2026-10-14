export type DemandCategory = 
  | 'TASK' 
  | 'PROJECT' 
  | 'EVENT' 
  | 'GOAL' 
  | 'HABIT' 
  | 'SOMEDAY' 
  | 'REFERENCE' 
  | 'DELEGATED';

export type LifeDomain = 'Trabalho' | 'Liderança' | 'Desenvolvimento' | 'Casa/Vida' | 'Saúde' | 'Finanças';

export type EnergyLevel = 'Alta (Foco Analítico)' | 'Média (Coordenação)' | 'Baixa (Mecânico/Descanso)';

export type DeadlineType = 'Hard (Externo/Crítico)' | 'Soft (Autoimposto)' | 'Sem Prazo Fixo';

export interface Demand {
  id: string;
  title: string;
  category: DemandCategory;
  domain: LifeDomain;
  nextAction: string;
  energyLevel: EnergyLevel;
  estimatedMinutes: number;
  actualMinutes?: number;
  deadlineType: DeadlineType;
  deadlineText?: string;
  costOfDelay: string;
  definitionOfDone: string;
  aiDiagnosis: string;
  postponementCount: number;
  status: 'INBOX' | 'HOJE' | 'AGENDADO' | 'CONCLUÍDO' | 'ARQUIVADO';
  scheduledTime?: string;
  eisenhowerQuadrant?: 'Q1 (Urgente & Importante)' | 'Q2 (Estratégico / Não Urgente)' | 'Q3 (Urgente / Não Importante)' | 'Q4 (Eliminar / Algum Dia)';
  surgicalQuestion?: string;
}

export type CoachPosture = 'Guardião Firme' | 'Parceiro Empático' | 'Assistente Pragmático';

export type EnergyState = 'Alta' | 'Média' | 'Baixa';

export interface DelegationItem {
  id: string;
  taskTitle: string;
  assignee: string;
  autonomyLevel: '1 (Pesquise e me informe)' | '2 (Proponha e eu aprovo)' | '3 (Decida e me mantenha informado)';
  definitionOfDone: string;
  checkInDate: string;
  deadline: string;
  status: 'EM_ANDAMENTO' | 'BLOQUEADO' | 'REVISÃO' | 'ENTREGUE';
  supportPrompt: string;
}

export interface MemoryFact {
  id: string;
  category: 'Preferência' | 'Padrão Observado' | 'Limite Biológico' | 'Valor';
  insight: string;
  confidence: 'Alta' | 'Média' | 'Hipótese Inicial';
  userApproved: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  posture?: CoachPosture;
  suggestedAction?: {
    label: string;
    actionType: 'reschedule' | 'split' | 'delegate' | 'say_no' | 'focus_5min';
  };
}

export interface DailyRitualState {
  stage: 'morning' | 'midday' | 'evening_shutdown';
  energyScore: number; // 1 to 10
  topFocusId: string;
  shutdownNote?: string;
  completedAt?: string;
}

export interface FullBackupData {
  version: string;
  exportedAt: string;
  demands: Demand[];
  delegations: DelegationItem[];
  memoryFacts: MemoryFact[];
  coachPosture: CoachPosture;
  currentEnergy: EnergyState;
}

export interface BrainHack {
  id: string;
  category: 'Anti-Impostor' | 'Desarmar Perfeccionismo' | 'Dopamina & Inércia' | 'Miopia Temporal' | 'Estoicismo Prático';
  quote: string;
  authorOrSource: string;
  neuroMechanism: string; // Explicação de como o cérebro é "enganado"
  actionPrompt: string; // Micropasso físico imediato
}

export interface EvolutionMetrics {
  daily: {
    bigOneCompleted: boolean;
    bufferPreservedPercent: number; // Ex: 28%
    deepWorkMinutes: number;
    procrastinationRepelledCount: number; // Quantas vezes venceu o impulso de adiar
    victories: string[];
  };
  weekly: {
    clarityScore: number; // 0-100
    strategicRatio: number; // % do tempo em tarefas estratégicas Q2 vs incêndios Q1
    delegatedCount: number;
    diplomaticNoCount: number; // Demandas recusadas com elegância
    energyComplianceDays: number; // Dias em que respeitou o limite biológico
  };
  monthly: {
    projectsAdvanced: number;
    burnoutAvertedAlerts: number; // Vezes que o sistema evitou colapso de agenda
    teamAutonomyGrowth: number; // Liderados que subiram de nível de autonomia
    guiltFreeResets: number; // Retomadas sem culpa executadas com sucesso
  };
}

export interface SmartNotification {
  id: string;
  title: string;
  body: string;
  category: 'BUFFER_ALERT' | 'NEURO_HACK' | 'ENERGY_CHECK' | 'THE_BIG_ONE' | 'EVENING_SHUTDOWN' | 'ANTI_SABOTAGE';
  timestamp: string;
  read: boolean;
  actionTab?: string;
}

export interface AntiSabotageTactic {
  id: string;
  title: string;
  subtitle: string;
  psychologicalRoot: string;
  neuroHack: string;
  actionStep: string;
}

