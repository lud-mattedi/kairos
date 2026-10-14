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
  energyScore: number; // 1 to 5
  topFocusId: string;
  shutdownNote?: string;
  completedAt?: string;
}
