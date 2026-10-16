import { useState, useEffect } from 'react';
import { Mail, Smartphone } from 'lucide-react';
import type { 
  Demand, 
  CoachPosture, 
  EnergyState, 
  DelegationItem, 
  MemoryFact, 
  ChatMessage, 
  BrainHack,
  EvolutionMetrics,
  SmartNotification,
  AntiSabotageTactic,
  IntegrationConfig,
  Habit,
  AnalyticsEvent
} from './types';
import { 
  INITIAL_BRAIN_HACKS, 
  INITIAL_EVOLUTION_METRICS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ANTI_SABOTAGE_TACTICS 
} from './mockData';
import { storageService } from './services/storageService';
import { aiService } from './services/aiService';

// Botanical Night Modular Components
import { AppHeader } from './components/layout/AppHeader';
import { DesktopNavigation, type MainTab } from './components/layout/DesktopNavigation';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { TodayView } from './components/today/TodayView';
import { HabitsView } from './components/habits/HabitsView';
import { EvolutionView } from './components/evolution/EvolutionView';
import { PlanningView, type PlanningSubTab } from './components/planning/PlanningView';
import { KairosAiView, type AiSubTab } from './components/ai/KairosAiView';

// Modals
import { SettingsHubModal } from './components/modals/SettingsHubModal';
import { QuickCaptureModal } from './components/modals/QuickCaptureModal';
import { DemandDetailModal } from './components/modals/DemandDetailModal';
import { CrappyDraftTimerModal } from './components/modals/CrappyDraftTimerModal';
import { NotificationsModal } from './components/modals/NotificationsModal';

import './App.css';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTab>('today');
  const [planningSubTab, setPlanningSubTab] = useState<PlanningSubTab>('inbox');
  const [aiSubTab, setAiSubTab] = useState<AiSubTab>('coach');

  // Persistent Domain State
  const [coachPosture, setCoachPosture] = useState<CoachPosture>(storageService.loadPosture);
  const [currentEnergy, setCurrentEnergy] = useState<EnergyState>(storageService.loadEnergy);
  const [demands, setDemands] = useState<Demand[]>(storageService.loadDemands);
  const [delegations] = useState<DelegationItem[]>(storageService.loadDelegations);
  const [memoryFacts, setMemoryFacts] = useState<MemoryFact[]>(storageService.loadMemory);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(storageService.loadChat);
  const [integrations, setIntegrations] = useState<IntegrationConfig>(storageService.loadIntegrations);
  const [habits, setHabits] = useState<Habit[]>(storageService.loadHabits);
  const [events, setEvents] = useState<AnalyticsEvent[]>(storageService.loadEvents);
  const [apiKey, setApiKey] = useState<string>(storageService.getApiKey);

  // Behavioral & AI Modules State
  const [brainHacks] = useState<BrainHack[]>(INITIAL_BRAIN_HACKS);
  const [currentHackIndex, setCurrentHackIndex] = useState(0);
  const [evolutionMetrics] = useState<EvolutionMetrics>(INITIAL_EVOLUTION_METRICS);
  const [notifications, setNotifications] = useState<SmartNotification[]>(INITIAL_NOTIFICATIONS);
  const [antiSabotageTactics] = useState<AntiSabotageTactic[]>(INITIAL_ANTI_SABOTAGE_TACTICS);
  const [activeTacticId, setActiveTacticId] = useState<string>('tactic-1');

  // Crappy Draft Timer (7 min / 420s)
  const [crappyDraftTimer, setCrappyDraftTimer] = useState(420);
  const [crappyDraftRunning, setCrappyDraftRunning] = useState(false);
  const [crappyDraftTitle, setCrappyDraftTitle] = useState('');
  const [showCrappyDraftModal, setShowCrappyDraftModal] = useState(false);

  // Modals Visibility
  const [showQuickCaptureModal, setShowQuickCaptureModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [inspectDemand, setInspectDemand] = useState<Demand | null>(null);

  // Simulation Toasts
  const [showSimulateWhatsAppToast, setShowSimulateWhatsAppToast] = useState(false);
  const [showSimulateHostingerToast, setShowSimulateHostingerToast] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Auto-save effects
  useEffect(() => {
    storageService.saveDemands(demands);
  }, [demands]);

  useEffect(() => {
    storageService.saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    storageService.saveEvents(events);
  }, [events]);

  useEffect(() => {
    storageService.saveMemory(memoryFacts);
  }, [memoryFacts]);

  useEffect(() => {
    storageService.saveChat(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    storageService.saveIntegrations(integrations);
  }, [integrations]);

  useEffect(() => {
    storageService.saveEnergy(currentEnergy);
  }, [currentEnergy]);

  useEffect(() => {
    storageService.savePosture(coachPosture);
  }, [coachPosture]);

  // Crappy Draft Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (crappyDraftRunning && crappyDraftTimer > 0) {
      interval = setInterval(() => {
        setCrappyDraftTimer(sec => sec - 1);
      }, 1000);
    } else if (crappyDraftTimer === 0) {
      setCrappyDraftRunning(false);
    }
    return () => clearInterval(interval);
  }, [crappyDraftRunning, crappyDraftTimer]);

  // Handlers: Demands
  const handleToggleDemand = (id: string) => {
    const updated: Demand[] = demands.map(d => {
      if (d.id === id) {
        const nextStatus: 'HOJE' | 'CONCLUÍDO' = d.status === 'CONCLUÍDO' ? 'HOJE' : 'CONCLUÍDO';
        if (nextStatus === 'CONCLUÍDO') {
          storageService.logEvent({
            type: 'TASK_COMPLETED',
            entityId: d.id,
            entityTitle: d.title,
            domain: d.domain,
            minutes: d.estimatedMinutes
          });
          setEvents(storageService.loadEvents());
        }
        return { ...d, status: nextStatus };
      }
      return d;
    });
    setDemands(updated);
  };

  const handleCreateDemandFromQuickCapture = async (title: string) => {
    const triageResult = await aiService.smartTriageDemand(title, currentEnergy);
    const newDem: Demand = {
      id: `dem-${Date.now()}`,
      title,
      category: triageResult.category || 'TASK',
      domain: triageResult.domain || 'Trabalho',
      nextAction: triageResult.nextAction || `Esclarecer o primeiro passo para "${title}"`,
      energyLevel: currentEnergy === 'Alta' ? 'Alta (Foco Analítico)' : 'Média (Coordenação)',
      estimatedMinutes: triageResult.estimatedMinutes || 30,
      deadlineType: triageResult.deadlineType || 'Soft (Autoimposto)',
      costOfDelay: triageResult.costOfDelay || 'Acúmulo de tarefas e ruído cognitivo.',
      definitionOfDone: triageResult.definitionOfDone || 'Critério a definir no agendamento.',
      aiDiagnosis: triageResult.aiDiagnosis || 'Classificada pela inteligência consultiva KAIROS.',
      postponementCount: 0,
      status: 'INBOX',
      eisenhowerQuadrant: triageResult.eisenhowerQuadrant || 'Q2 (Estratégico / Não Urgente)',
      surgicalQuestion: triageResult.surgicalQuestion || 'O que precisa acontecer primeiro e por quê?'
    };

    setDemands([newDem, ...demands]);
    storageService.logEvent({
      type: 'TASK_CREATED',
      entityId: newDem.id,
      entityTitle: newDem.title,
      domain: newDem.domain
    });
    setEvents(storageService.loadEvents());
  };

  // Handlers: Habits
  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const currentlyDone = !!h.history[dateStr];
        const newHistory = { ...h.history };
        if (currentlyDone) {
          delete newHistory[dateStr];
        } else {
          newHistory[dateStr] = true;
        }

        const newStreak = currentlyDone ? Math.max(0, h.streak - 1) : h.streak + 1;
        const newBestStreak = Math.max(h.bestStreak, newStreak);

        if (!currentlyDone) {
          storageService.logEvent({
            type: 'HABIT_COMPLETED',
            entityId: h.id,
            entityTitle: h.title,
            domain: h.domain
          });
          setEvents(storageService.loadEvents());
        }

        return {
          ...h,
          history: newHistory,
          streak: newStreak,
          bestStreak: newBestStreak
        };
      }
      return h;
    });
    setHabits(updated);
  };

  const handleToggleHabitActive = (habitId: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        return { ...h, active: !h.active };
      }
      return h;
    }));
  };

  const handleCreateHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'history' | 'createdAt'>) => {
    const newHab: Habit = {
      ...habitData,
      id: `hab-${Date.now()}`,
      streak: 0,
      bestStreak: 0,
      history: {},
      createdAt: new Date().toISOString().split('T')[0]
    };
    setHabits([newHab, ...habits]);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
  };

  // Handlers: Crappy Draft
  const handleStartCrappyDraft = (taskTitle: string) => {
    setCrappyDraftTitle(taskTitle);
    setCrappyDraftTimer(420);
    setCrappyDraftRunning(true);
    setShowCrappyDraftModal(true);
    storageService.logEvent({
      type: 'FOCUS_SESSION_START',
      entityTitle: taskTitle,
      minutes: 7,
      notes: 'Crappy Draft Protocol'
    });
    setEvents(storageService.loadEvents());
  };

  const handleStartFocusSession = (demand: Demand) => {
    setCrappyDraftTitle(`Foco Nobre: ${demand.title}`);
    setCrappyDraftTimer(demand.estimatedMinutes * 60 || 1500);
    setCrappyDraftRunning(true);
    setShowCrappyDraftModal(true);
    storageService.logEvent({
      type: 'FOCUS_SESSION_START',
      entityId: demand.id,
      entityTitle: demand.title,
      domain: demand.domain,
      minutes: demand.estimatedMinutes
    });
    setEvents(storageService.loadEvents());
  };

  // Handlers: AI Sparring Chat
  const handleSendChatMessage = async (textToSend?: string) => {
    if (!textToSend?.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    const contextSummary = `Lud está com energia ${currentEnergy}. Tarefas de hoje: ${demands.filter(d => d.status === 'HOJE').map(d => d.title).join(', ')}.`;
    const reply = await aiService.getSparringResponse(textToSend, coachPosture, contextSummary);

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      posture: coachPosture
    };

    setChatMessages(prev => [...prev, aiMsg]);
    setIsAiLoading(false);
  };

  // Handlers: Memory Facts
  const handleAddMemoryFact = (fact: MemoryFact) => {
    setMemoryFacts([fact, ...memoryFacts]);
  };

  const handleDeleteMemoryFact = (id: string) => {
    setMemoryFacts(memoryFacts.filter(f => f.id !== id));
  };

  // Handlers: Simulations
  const handleSimulateWhatsAppAudio = () => {
    const newDem: Demand = {
      id: `dem-${Date.now()}`,
      title: '🎙️ Áudio WhatsApp (+55 11 97555-6111): Alinhar dilação de prazo com diretor',
      category: 'TASK',
      domain: 'Trabalho',
      nextAction: 'Enviar mensagem de 2 linhas pelo WhatsApp solicitando extensão de entrega até quinta às 12h.',
      energyLevel: 'Média (Coordenação)',
      estimatedMinutes: 5,
      deadlineType: 'Hard (Externo/Crítico)',
      deadlineText: 'Hoje 17:00 (Transcrição de voz automatizada via Whisper)',
      costOfDelay: 'Diretor cobrar publicamente no comitê de amanhã cedo.',
      definitionOfDone: 'Confirmação de recebimento e aceite da prorrogação pelo diretor no WhatsApp.',
      aiDiagnosis: 'Demanda capturada por mensagem de voz às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + '. A IA já reduziu o perfeccionismo e transformou em um micro-texto de 2 linhas.',
      postponementCount: 0,
      status: 'HOJE',
      eisenhowerQuadrant: 'Q1 (Urgente & Importante)',
      scheduledTime: '16:30 - 16:35'
    };

    setDemands([newDem, ...demands]);

    const newNotif: SmartNotification = {
      id: `notif-${Date.now()}`,
      title: '🎙️ WhatsApp: Novo Áudio Transcrito e Triado',
      body: 'Áudio de 42s recebido de +55 11 97555-6111 foi convertido em Próxima Ação de 5 minutos.',
      category: 'THE_BIG_ONE',
      timestamp: 'Agora',
      read: false,
      actionTab: 'today'
    };
    setNotifications([newNotif, ...notifications]);
    setShowSimulateWhatsAppToast(true);
    setTimeout(() => setShowSimulateWhatsAppToast(false), 4500);
  };

  const handleSimulateHostingerEmail = () => {
    const newDem: Demand = {
      id: `dem-${Date.now()}`,
      title: '✉️ Hostinger (lud@mktcx.com.br): Relatório de Performance Trimestral #kairos',
      category: 'PROJECT',
      domain: 'Trabalho',
      nextAction: 'Exportar os 3 gráficos do Looker Studio e redigir introdução de 1 parágrafo no e-mail.',
      energyLevel: 'Alta (Foco Analítico)',
      estimatedMinutes: 45,
      deadlineType: 'Hard (Externo/Crítico)',
      deadlineText: 'Amanhã 11:00',
      costOfDelay: 'Insegurança do cliente e risco de reunião não alinhada.',
      definitionOfDone: 'PDF de 3 páginas enviado para o cliente por e-mail.',
      aiDiagnosis: 'E-mail capturado via filtro IMAP #kairos do Hostinger (lud@mktcx.com.br). O remetente usou termos alarmistas, mas a IA desarmou a falsa urgência e alocou no bloco nobre de amanhã.',
      postponementCount: 0,
      status: 'HOJE',
      eisenhowerQuadrant: 'Q2 (Estratégico / Não Urgente)',
      scheduledTime: '09:00 - 09:45'
    };

    setDemands([newDem, ...demands]);

    const newNotif: SmartNotification = {
      id: `notif-${Date.now()}`,
      title: '✉️ Hostinger: E-mail Triado sem Pânico',
      body: 'E-mail de cliente recebido em lud@mktcx.com.br desarmado pela IA e alocado no bloco nobre.',
      category: 'BUFFER_ALERT',
      timestamp: 'Agora',
      read: false,
      actionTab: 'today'
    };
    setNotifications([newNotif, ...notifications]);
    setShowSimulateHostingerToast(true);
    setTimeout(() => setShowSimulateHostingerToast(false), 4500);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações de sistema.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('KAIROS OS • Guardião Conectado', {
        body: 'Notificações ativadas! Você só receberá alertas de risco de buffer, The Big One e hacks de foco.',
        icon: './apple-touch-icon.png'
      });
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const activeHabitsTodayCount = habits.filter(h => h.active && !h.history[todayStr]).length;
  const currentNeuroHack = brainHacks[currentHackIndex % brainHacks.length];

  return (
    <div className="app-shell">
      
      {/* 1. Executive Top Header */}
      <AppHeader
        currentEnergy={currentEnergy}
        onEnergyChange={setCurrentEnergy}
        notifications={notifications}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenQuickCapture={() => setShowQuickCaptureModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        bufferMinutes={90}
      />

      {/* 2. Desktop 5-Tab Navigation */}
      <DesktopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inboxCount={demands.filter(d => d.status === 'INBOX').length}
        habitsDueToday={activeHabitsTodayCount}
      />

      {/* 3. Main Workspace Container */}
      <main className="container" style={{ padding: '1.5rem 1rem 5.5rem 1rem', minHeight: '80vh' }}>
        
        {/* TAB 1: HOJE */}
        {activeTab === 'today' && (
          <TodayView
            demands={demands}
            habits={habits}
            onToggleDemand={handleToggleDemand}
            onToggleHabit={(id) => handleToggleHabitDay(id, todayStr)}
            onInspectDemand={setInspectDemand}
            onStartCrappyDraft={handleStartCrappyDraft}
            onStartFocus={handleStartFocusSession}
            onNavigateTab={(tab, subTab) => {
              setActiveTab(tab);
              if (tab === 'planning' && subTab) setPlanningSubTab(subTab as any);
              if (tab === 'ai' && subTab) setAiSubTab(subTab as any);
            }}
            neuroHack={currentNeuroHack}
            onNextNeuroHack={() => setCurrentHackIndex(prev => prev + 1)}
          />
        )}

        {/* TAB 2: HÁBITOS */}
        {activeTab === 'habits' && (
          <HabitsView
            habits={habits}
            onToggleHabitDay={handleToggleHabitDay}
            onToggleHabitActive={handleToggleHabitActive}
            onCreateHabit={handleCreateHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}

        {/* TAB 3: EVOLUÇÃO */}
        {activeTab === 'evolution' && (
          <EvolutionView
            demands={demands}
            habits={habits}
            events={events}
            baselineMetrics={evolutionMetrics}
          />
        )}

        {/* TAB 4: PLANEJAR */}
        {activeTab === 'planning' && (
          <PlanningView
            demands={demands}
            delegations={delegations}
            initialSubTab={planningSubTab}
            onOpenNewDemandModal={() => setShowQuickCaptureModal(true)}
            onInspectDemand={setInspectDemand}
          />
        )}

        {/* TAB 5: KAIROS IA */}
        {activeTab === 'ai' && (
          <KairosAiView
            coachPosture={coachPosture}
            onPostureChange={setCoachPosture}
            chatMessages={chatMessages}
            onSendMessage={handleSendChatMessage}
            isAiLoading={isAiLoading}
            demands={demands}
            memoryFacts={memoryFacts}
            onAddMemoryFact={handleAddMemoryFact}
            onDeleteMemoryFact={handleDeleteMemoryFact}
            antiSabotageTactics={antiSabotageTactics}
            activeTacticId={activeTacticId}
            onSelectTactic={setActiveTacticId}
            initialSubTab={aiSubTab}
            onNavigateToToday={() => setActiveTab('today')}
          />
        )}

      </main>

      {/* 4. Native iOS Mobile TabBar */}
      <MobileTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inboxCount={demands.filter(d => d.status === 'INBOX').length}
      />

      {/* 5. Modals Hub */}
      <SettingsHubModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        integrations={integrations}
        onUpdateIntegrations={(updates) => setIntegrations({ ...integrations, ...updates })}
        onSimulateWhatsApp={handleSimulateWhatsAppAudio}
        onSimulateHostinger={handleSimulateHostingerEmail}
        apiKey={apiKey}
        onSaveApiKey={(k) => { setApiKey(k); storageService.setApiKey(k); }}
        onRestoreSuccess={() => {
          setDemands(storageService.loadDemands());
          setHabits(storageService.loadHabits());
          setEvents(storageService.loadEvents());
          setMemoryFacts(storageService.loadMemory());
          setChatMessages(storageService.loadChat());
          setIntegrations(storageService.loadIntegrations());
        }}
      />

      <QuickCaptureModal
        isOpen={showQuickCaptureModal}
        onClose={() => setShowQuickCaptureModal(false)}
        onSubmit={handleCreateDemandFromQuickCapture}
        currentEnergy={currentEnergy}
      />

      <DemandDetailModal
        demand={inspectDemand}
        onClose={() => setInspectDemand(null)}
        onToggleStatus={handleToggleDemand}
        onStartFocus={handleStartFocusSession}
        onStartCrappyDraft={handleStartCrappyDraft}
      />

      <CrappyDraftTimerModal
        isOpen={showCrappyDraftModal}
        onClose={() => setShowCrappyDraftModal(false)}
        taskTitle={crappyDraftTitle}
        secondsRemaining={crappyDraftTimer}
        isRunning={crappyDraftRunning}
        onToggleRun={() => setCrappyDraftRunning(!crappyDraftRunning)}
        onReset={() => { setCrappyDraftRunning(false); setCrappyDraftTimer(420); }}
      />

      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))}
        onMarkAllAsRead={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
        onRequestPushPermission={requestNotificationPermission}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Simulation Floating Feedback Toasts */}
      {showSimulateWhatsAppToast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: '#222B27',
            border: '1px solid #25D366',
            borderRadius: '10px',
            padding: '1rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            zIndex: 100,
            maxWidth: '340px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Smartphone size={18} color="#25D366" />
          </div>
          <div>
            <strong style={{ fontSize: '0.85rem', color: '#25D366', display: 'block' }}>Áudio WhatsApp Triado!</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Áudio de 42s convertido em Próxima Ação de 5 min alocada para hoje às 16:30.</span>
          </div>
        </div>
      )}

      {showSimulateHostingerToast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: '#222B27',
            border: '1px solid var(--accent-champagne)',
            borderRadius: '10px',
            padding: '1rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            zIndex: 100,
            maxWidth: '340px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(210, 173, 120, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={18} color="var(--accent-champagne)" />
          </div>
          <div>
            <strong style={{ fontSize: '0.85rem', color: 'var(--accent-champagne)', display: 'block' }}>E-mail Hostinger Desarmado!</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Filtro #kairos absorveu o e-mail de cliente sem gerar pânico na sua noite.</span>
          </div>
        </div>
      )}

    </div>
  );
}
