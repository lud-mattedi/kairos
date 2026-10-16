import type { Demand, DelegationItem, MemoryFact, ChatMessage, EnergyState, CoachPosture, IntegrationConfig, Habit, AnalyticsEvent } from '../types';
import { INITIAL_DEMANDS, INITIAL_DELEGATIONS, INITIAL_MEMORY, INITIAL_CHAT_MESSAGES, INITIAL_INTEGRATIONS, INITIAL_HABITS } from '../mockData';

const STORAGE_KEYS = {
  DEMANDS: 'kairos_demands_v1',
  DELEGATIONS: 'kairos_delegations_v1',
  MEMORY: 'kairos_memory_v1',
  CHAT: 'kairos_chat_v1',
  ENERGY: 'kairos_energy_v1',
  POSTURE: 'kairos_posture_v1',
  NOTIFICATIONS: 'kairos_notifications_v1',
  METRICS: 'kairos_metrics_v1',
  GEMINI_API_KEY: 'kairos_gemini_api_key',
  INTEGRATIONS: 'kairos_integrations_v1',
  HABITS: 'kairos_habits_v1',
  EVENTS: 'kairos_events_v1'
};

export const storageService = {
  loadDemands(): Demand[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMANDS);
      return data ? JSON.parse(data) : INITIAL_DEMANDS;
    } catch {
      return INITIAL_DEMANDS;
    }
  },

  saveDemands(demands: Demand[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMANDS, JSON.stringify(demands));
    } catch (e) {
      console.error('Error saving demands:', e);
    }
  },

  loadDelegations(): DelegationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DELEGATIONS);
      return data ? JSON.parse(data) : INITIAL_DELEGATIONS;
    } catch {
      return INITIAL_DELEGATIONS;
    }
  },

  saveDelegations(delegations: DelegationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DELEGATIONS, JSON.stringify(delegations));
    } catch (e) {
      console.error('Error saving delegations:', e);
    }
  },

  loadMemory(): MemoryFact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORY);
      return data ? JSON.parse(data) : INITIAL_MEMORY;
    } catch {
      return INITIAL_MEMORY;
    }
  },

  saveMemory(facts: MemoryFact[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(facts));
    } catch (e) {
      console.error('Error saving memory:', e);
    }
  },

  loadChat(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      return data ? JSON.parse(data) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  },

  saveChat(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat:', e);
    }
  },

  loadEnergy(): EnergyState {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ENERGY);
      return (val as EnergyState) || 'Alta';
    } catch {
      return 'Alta';
    }
  },

  saveEnergy(energy: EnergyState): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ENERGY, energy);
    } catch (e) {
      console.error('Error saving energy:', e);
    }
  },

  loadPosture(): CoachPosture {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.POSTURE);
      return (val as CoachPosture) || 'Guardião Firme';
    } catch {
      return 'Guardião Firme';
    }
  },

  savePosture(posture: CoachPosture): void {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTURE, posture);
    } catch (e) {
      console.error('Error saving posture:', e);
    }
  },

  getApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
  },

  setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
  },

  loadIntegrations(): IntegrationConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
      return data ? JSON.parse(data) : INITIAL_INTEGRATIONS;
    } catch {
      return INITIAL_INTEGRATIONS;
    }
  },

  saveIntegrations(integrations: IntegrationConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
    } catch (e) {
      console.error('Error saving integrations:', e);
    }
  },

  loadHabits(): Habit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      return data ? JSON.parse(data) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  },

  saveHabits(habits: Habit[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Error saving habits:', e);
    }
  },

  loadEvents(): AnalyticsEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveEvents(events: AnalyticsEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Error saving analytics events:', e);
    }
  },

  logEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
    try {
      const current = this.loadEvents();
      const newEvent: AnalyticsEvent = {
        ...event,
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date().toISOString()
      };
      // Keep up to 2000 events to prevent quota overflow
      const updated = [newEvent, ...current].slice(0, 2000);
      this.saveEvents(updated);
    } catch (e) {
      console.error('Error logging analytics event:', e);
    }
  },

  exportFullBackupJSON(): string {
    const backup = {
      app: 'KAIROS OS',
      version: 'v1.6-noite-botanica',
      exportedAt: new Date().toISOString(),
      user: 'Lud',
      demands: this.loadDemands(),
      delegations: this.loadDelegations(),
      memoryFacts: this.loadMemory(),
      chatMessages: this.loadChat(),
      energy: this.loadEnergy(),
      posture: this.loadPosture(),
      integrations: this.loadIntegrations(),
      habits: this.loadHabits(),
      events: this.loadEvents()
    };
    return JSON.stringify(backup, null, 2);
  },

  importFullBackupJSON(jsonStr: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Arquivo JSON inválido ou corrompido.' };
      }
      if (Array.isArray(data.demands)) this.saveDemands(data.demands);
      if (Array.isArray(data.delegations)) this.saveDelegations(data.delegations);
      if (Array.isArray(data.memoryFacts)) this.saveMemory(data.memoryFacts);
      if (Array.isArray(data.chatMessages)) this.saveChat(data.chatMessages);
      if (data.energy) this.saveEnergy(data.energy);
      if (data.posture) this.savePosture(data.posture);
      if (data.integrations) this.saveIntegrations(data.integrations);
      if (Array.isArray(data.habits)) this.saveHabits(data.habits);
      if (Array.isArray(data.events)) this.saveEvents(data.events);
      return { success: true, message: 'Dados restaurados com sucesso!' };
    } catch (e: any) {
      return { success: false, message: `Erro ao importar: ${e?.message || 'Arquivo inválido'}` };
    }
  },

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.DEMANDS);
    localStorage.removeItem(STORAGE_KEYS.DELEGATIONS);
    localStorage.removeItem(STORAGE_KEYS.MEMORY);
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.ENERGY);
    localStorage.removeItem(STORAGE_KEYS.POSTURE);
    localStorage.removeItem(STORAGE_KEYS.INTEGRATIONS);
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
  }
};
