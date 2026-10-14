import type { Demand, DelegationItem, MemoryFact, ChatMessage, EnergyState, CoachPosture } from '../types';
import { INITIAL_DEMANDS, INITIAL_DELEGATIONS, INITIAL_MEMORY, INITIAL_CHAT_MESSAGES } from '../mockData';

const STORAGE_KEYS = {
  DEMANDS: 'kairos_demands_v1',
  DELEGATIONS: 'kairos_delegations_v1',
  MEMORY: 'kairos_memory_v1',
  CHAT: 'kairos_chat_v1',
  ENERGY: 'kairos_energy_v1',
  POSTURE: 'kairos_posture_v1',
  NOTIFICATIONS: 'kairos_notifications_v1',
  METRICS: 'kairos_metrics_v1',
  GEMINI_API_KEY: 'kairos_gemini_api_key'
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

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.DEMANDS);
    localStorage.removeItem(STORAGE_KEYS.DELEGATIONS);
    localStorage.removeItem(STORAGE_KEYS.MEMORY);
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.ENERGY);
    localStorage.removeItem(STORAGE_KEYS.POSTURE);
  }
};
