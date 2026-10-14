import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Inbox, 
  Zap, 
  ShieldAlert, 
  RotateCcw, 
  BrainCircuit, 
  Clock, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  Copy, 
  Check, 
  Plus, 
  X,
  Play,
  Pause,
  RefreshCw,
  Eye,
  ShieldCheck,
  Send,
  Target,
  MessageSquare,
  HelpCircle,
  Mic,
  Download,
  Key,
  History,
  Shield,
  ArrowRight,
  Bell,
  Award,
  TrendingUp,
  Quote,
  Flame,
  Mail,
  Smartphone,
  Apple,
  Share2,
  Globe
} from 'lucide-react';
import type { 
  Demand, 
  CoachPosture, 
  EnergyState, 
  DelegationItem, 
  MemoryFact, 
  ChatMessage, 
  LifeDomain,
  BrainHack,
  EvolutionMetrics,
  SmartNotification,
  AntiSabotageTactic,
  IntegrationConfig
} from './types';
import { 
  INITIAL_BRAIN_HACKS, 
  INITIAL_EVOLUTION_METRICS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ANTI_SABOTAGE_TACTICS
} from './mockData';
import { storageService } from './services/storageService';
import { aiService } from './services/aiService';
import { calendarService } from './services/calendarService';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'showcase' | 'inbox' | 'procrastination' | 'boundaries' | 'sparring' | 'softLanding' | 'memory' | 'evolution'>('today');
  
  // Persistent State
  const [coachPosture, setCoachPosture] = useState<CoachPosture>(storageService.loadPosture);
  const [currentEnergy, setCurrentEnergy] = useState<EnergyState>(storageService.loadEnergy);
  const [demands, setDemands] = useState<Demand[]>(storageService.loadDemands);
  const [delegations] = useState<DelegationItem[]>(storageService.loadDelegations);
  const [memoryFacts, setMemoryFacts] = useState<MemoryFact[]>(storageService.loadMemory);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(storageService.loadChat);
  const [apiKey, setApiKey] = useState<string>(storageService.getApiKey);
  const [isSavingKey, setIsSavingKey] = useState(false);

  // New modules state: Evolution, Neuro-Hacks, Notifications, Anti-Sabotage
  const [evolutionPeriod, setEvolutionPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [brainHacks] = useState<BrainHack[]>(INITIAL_BRAIN_HACKS);
  const [currentHackIndex, setCurrentHackIndex] = useState(0);
  const [evolutionMetrics] = useState<EvolutionMetrics>(INITIAL_EVOLUTION_METRICS);
  const [notifications, setNotifications] = useState<SmartNotification[]>(INITIAL_NOTIFICATIONS);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [antiSabotageTactics] = useState<AntiSabotageTactic[]>(INITIAL_ANTI_SABOTAGE_TACTICS);
  const [activeTacticId, setActiveTacticId] = useState<string>('tactic-1');

  // Crappy Draft Timer (7 min / 420s)
  const [crappyDraftTimer, setCrappyDraftTimer] = useState(420);
  const [crappyDraftRunning, setCrappyDraftRunning] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Selected filter in Inbox
  const [inboxFilter, setInboxFilter] = useState<LifeDomain | 'Todos'>('Todos');

  // Simulation states
  const [emergencyResolved, setEmergencyResolved] = useState<string | null>(null);

  // Anti-procrastination state
  const [selectedProcrastinationDemand, setSelectedProcrastinationDemand] = useState<string>(
    demands[2]?.id || demands[0]?.id || ''
  );
  const [procrastinationCause, setProcrastinationCause] = useState<string>('friction');
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 min
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Saying No Generator state
  const [recipientType, setRecipientType] = useState<'boss' | 'client' | 'peer' | 'friend'>('boss');
  const [requestContext, setRequestContext] = useState<'meeting' | 'extraTask' | 'tightDeadline'>('extraTask');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New demand modal state
  const [newDemandTitle, setNewDemandTitle] = useState('');
  const [showNewDemandModal, setShowNewDemandModal] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);

  // Selected demand detail modal
  const [inspectDemand, setInspectDemand] = useState<Demand | null>(null);

  // Soft landing state
  const [softLandingCleaned, setSoftLandingCleaned] = useState(false);

  // Version history banner modal
  const [showVersionModal, setShowVersionModal] = useState(false);

  // Integrations state & modals
  const [integrations, setIntegrations] = useState<IntegrationConfig>(storageService.loadIntegrations);
  const [showSimulateWhatsAppToast, setShowSimulateWhatsAppToast] = useState(false);
  const [showSimulateHostingerToast, setShowSimulateHostingerToast] = useState(false);
  const [showAppStoreModal, setShowAppStoreModal] = useState(false);

  // Auto-save to LocalStorage
  useEffect(() => {
    storageService.saveIntegrations(integrations);
  }, [integrations]);
  useEffect(() => {
    storageService.saveDemands(demands);
  }, [demands]);

  useEffect(() => {
    storageService.saveDelegations(delegations);
  }, [delegations]);

  useEffect(() => {
    storageService.saveMemory(memoryFacts);
  }, [memoryFacts]);

  useEffect(() => {
    storageService.saveChat(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    storageService.saveEnergy(currentEnergy);
  }, [currentEnergy]);

  useEffect(() => {
    storageService.savePosture(coachPosture);
  }, [coachPosture]);

  // Focus timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Crappy Draft Timer effect
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

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações de sistema.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('KAIROS OS • Guardião Conectado', {
        body: 'Notificações ativadas! Você só receberá alertas de risco de buffer, The Big One e hacks de foco.',
        icon: '/favicon.svg'
      });
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.setApiKey(apiKey);
    setIsSavingKey(true);
    setTimeout(() => setIsSavingKey(false), 1500);
  };

  const updateIntegration = <K extends keyof IntegrationConfig>(key: K, updates: Partial<IntegrationConfig[K]>) => {
    const updated: IntegrationConfig = {
      ...integrations,
      [key]: {
        ...integrations[key],
        ...updates
      }
    };
    setIntegrations(updated);
    storageService.saveIntegrations(updated);
  };

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
    const updated = [newDem, ...demands];
    setDemands(updated);
    storageService.saveDemands(updated);

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
    const updated = [newDem, ...demands];
    setDemands(updated);
    storageService.saveDemands(updated);

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

  const handleCreateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDemandTitle.trim()) return;

    setIsClassifying(true);

    // Call AI Service (Gemini or offline heuristic)
    const triageResult = await aiService.smartTriageDemand(newDemandTitle, currentEnergy);

    const newDem: Demand = {
      id: `dem-${Date.now()}`,
      title: newDemandTitle,
      category: triageResult.category || 'TASK',
      domain: triageResult.domain || 'Trabalho',
      nextAction: triageResult.nextAction || `Esclarecer o primeiro passo para "${newDemandTitle}"`,
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
    setNewDemandTitle('');
    setShowNewDemandModal(false);
    setIsVoiceRecording(false);
    setIsClassifying(false);
  };

  const handleVoiceCapture = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsVoiceRecording(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setNewDemandTitle(transcript);
          setIsVoiceRecording(false);
        };

        recognition.onerror = () => {
          setIsVoiceRecording(false);
        };

        recognition.onend = () => {
          setIsVoiceRecording(false);
        };

        recognition.start();
        return;
      } catch {
        // Fallback below
      }
    }

    // Fallback simulation if Speech API not permitted
    setIsVoiceRecording(true);
    setTimeout(() => {
      setNewDemandTitle('Alinhar prazo do relatório com a diretoria na quinta-feira');
      setIsVoiceRecording(false);
    }, 1500);
  };

  const toggleTaskStatus = (id: string) => {
    setDemands(demands.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: d.status === 'CONCLUÍDO' ? 'HOJE' : 'CONCLUÍDO'
        };
      }
      return d;
    }));
  };

  const handleSendChatMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsAiLoading(true);

    const contextSummary = `Energia: ${currentEnergy}. Tarefas de hoje: ${demands.filter(d => d.status === 'HOJE').map(d => d.title).join(', ')}.`;
    const reply = await aiService.getSparringResponse(text, coachPosture, contextSummary);

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

  // Capacity Calculation
  const deepWorkMinutes = 165; // ~2h45min planned
  const maxDeepWork = 210; // 3h30min biological limit
  const shallowMinutes = 105; // 1h45min
  const bufferMinutes = 90; // 1h30min buffer (28%)

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="brand-title">KAIROS OS</h1>
              <p className="brand-subtitle">Executive Sanctuary • Decisão & Liderança</p>
            </div>
          </div>

          <div className="header-controls">
            {/* Version Snapshot Pill (Desktop) */}
            <button 
              className="selector-pill desktop-only-control" 
              onClick={() => setShowVersionModal(true)}
              title="Clique para ver o histórico de snapshots e restaurar versões anteriores"
              style={{ cursor: 'pointer' }}
            >
              <History size={13} color="var(--accent-amber-soft)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>v1.2 iOS</span>
            </button>

            {/* Energy Selector (Desktop) */}
            <div className="selector-pill desktop-only-control" title="Seu estado biológico atual ajusta as recomendações da IA">
              <Zap size={14} color="var(--accent-amber)" />
              <span>Energia:</span>
              <select 
                value={currentEnergy} 
                onChange={(e) => setCurrentEnergy(e.target.value as EnergyState)}
              >
                <option value="Alta">Alta ⚡ (Foco Nobre)</option>
                <option value="Média">Média ⚖️ (Coordenação)</option>
                <option value="Baixa">Baixa 🔋 (Recarga)</option>
              </select>
            </div>

            {/* Coach Posture Selector (Desktop) */}
            <div className="selector-pill desktop-only-control" title="Ajuste como a IA interage e desafia suas escolhas">
              <BrainCircuit size={14} color="var(--accent-sage-soft)" />
              <span>Postura IA:</span>
              <select 
                value={coachPosture} 
                onChange={(e) => setCoachPosture(e.target.value as CoachPosture)}
              >
                <option value="Guardião Firme">Guardião Firme 🛡️</option>
                <option value="Parceiro Empático">Parceiro Empático 🤝</option>
                <option value="Assistente Pragmático">Assistente Pragmático ⚙️</option>
              </select>
            </div>

            {/* Primary Capture Button (Desktop) */}
            <button 
              className="btn-primary desktop-only-control" 
              onClick={() => setShowNewDemandModal(true)}
            >
              <Plus size={16} /> Capturar Demanda
            </button>

            {/* Notification Bell (Desktop & Mobile) */}
            <button 
              className="notif-btn" 
              onClick={() => setShowNotificationsModal(true)}
              title="Notificações Pertinentes"
              aria-label="Notificações"
            >
              <Bell size={16} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notif-badge-count">{notifications.filter(n => !n.read).length}</span>
              )}
            </button>

            {/* Mobile Header Actions (Stitch iPhone Pattern) */}
            <div className="mobile-telemetry-pill">
              <span className="telemetry-pulse"></span>
              <span>Buffer 28%</span>
            </div>

            <button 
              className="mobile-capture-btn" 
              onClick={() => setShowNewDemandModal(true)}
              title="Capturar Nova Demanda"
              aria-label="Capturar Demanda"
            >
              <Plus size={18} />
            </button>

            <button 
              className="mobile-settings-btn" 
              onClick={() => setShowVersionModal(true)}
              title="Configurações e Snapshots"
              aria-label="Configurações e Snapshots"
            >
              <History size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Horizontal Subnav (Quick Category Chips) */}
      <div className="mobile-subnav" aria-label="Navegação rápida de módulos">
        <button className={`mobile-nav-chip ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>1. Cockpit</button>
        <button className={`mobile-nav-chip ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>2. Triagem ({demands.length})</button>
        <button className={`mobile-nav-chip ${activeTab === 'showcase' ? 'active' : ''}`} onClick={() => setActiveTab('showcase')}>3. 5 Casos</button>
        <button className={`mobile-nav-chip ${activeTab === 'procrastination' ? 'active' : ''}`} onClick={() => setActiveTab('procrastination')}>4. SOS Foco</button>
        <button className={`mobile-nav-chip ${activeTab === 'boundaries' ? 'active' : ''}`} onClick={() => setActiveTab('boundaries')}>5. Liderança</button>
        <button className={`mobile-nav-chip ${activeTab === 'sparring' ? 'active' : ''}`} onClick={() => setActiveTab('sparring')}>6. Coach IA</button>
        <button className={`mobile-nav-chip ${activeTab === 'softLanding' ? 'active' : ''}`} onClick={() => setActiveTab('softLanding')}>7. Retomada</button>
        <button className={`mobile-nav-chip ${activeTab === 'evolution' ? 'active' : ''}`} onClick={() => setActiveTab('evolution')}>🏆 8. Conquistas</button>
        <button className={`mobile-nav-chip ${activeTab === 'memory' ? 'active' : ''}`} onClick={() => setActiveTab('memory')}>9. Memória</button>
      </div>

      {/* Main Tab Navigation */}
      <nav className="nav-bar">
        <div className="container nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            <Calendar size={15} /> 1. Cockpit do Dia
          </button>
          <button 
            className={`nav-tab ${activeTab === 'showcase' ? 'active' : ''}`}
            onClick={() => setActiveTab('showcase')}
          >
            <Target size={15} /> 2. Demonstração das 5 Demandas
          </button>
          <button 
            className={`nav-tab ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            <Inbox size={15} /> 3. Caixa de Entrada & Triagem ({demands.length})
          </button>
          <button 
            className={`nav-tab ${activeTab === 'procrastination' ? 'active' : ''}`}
            onClick={() => setActiveTab('procrastination')}
          >
            <Zap size={15} /> 4. SOS Anti-Procrastinação
          </button>
          <button 
            className={`nav-tab ${activeTab === 'boundaries' ? 'active' : ''}`}
            onClick={() => setActiveTab('boundaries')}
          >
            <ShieldAlert size={15} /> 5. Dizer Não & Delegação
          </button>
          <button 
            className={`nav-tab ${activeTab === 'sparring' ? 'active' : ''}`}
            onClick={() => setActiveTab('sparring')}
          >
            <MessageSquare size={15} /> 6. Coach & Sparring IA
          </button>
          <button 
            className={`nav-tab ${activeTab === 'softLanding' ? 'active' : ''}`}
            onClick={() => setActiveTab('softLanding')}
          >
            <RotateCcw size={15} /> 7. Retomada sem Culpa
          </button>
          <button 
            className={`nav-tab ${activeTab === 'evolution' ? 'active' : ''}`}
            onClick={() => setActiveTab('evolution')}
          >
            <Award size={15} /> 8. Evolução & Conquistas
          </button>
          <button 
            className={`nav-tab ${activeTab === 'memory' ? 'active' : ''}`}
            onClick={() => setActiveTab('memory')}
          >
            <Eye size={15} /> 9. Memória & Integrações
          </button>
        </div>
      </nav>

      {/* Main Views */}
      <main className="main-view container">

        {/* ----------------- TAB 1: COCKPIT DO DIA & CAPACIDADE ----------------- */}
        {activeTab === 'today' && (
          <div>
            {/* Executive Greeting Header (Stitch Mobile Pattern) */}
            <div className="executive-greeting">
              <div className="greeting-row">
                <h1 className="greeting-title">Bom dia, Rodrigo</h1>
                <span className="greeting-date">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()}
                </span>
              </div>
              <div className="greeting-tags">
                <span className="badge badge-amber">
                  <ShieldAlert size={12} /> Modo: Retomada sem Culpa Ativo
                </span>
                <span className="badge badge-sage">
                  <Shield size={12} /> Buffer 28% Preservado
                </span>
                <span className="badge badge-sage">
                  <Zap size={12} /> Energia: {currentEnergy}
                </span>
              </div>
            </div>

            {/* The Big One Card (Stitch Focus Anchor) */}
            <div className="the-big-one-card">
              <div className="big-one-header">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="big-one-tag">O Foco do Dia</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>INEGOCIÁVEL</span>
                </div>
                <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                  <Clock size={12} /> SLA 10:30
                </span>
              </div>
              <h3 className="big-one-title">Acompanhar entrega crítica do Squad Alfa</h3>
              <p className="big-one-action">
                Critérios de Aceite definidos. Revisão arquitetural do pipeline e validação do deploy de staging sem bloqueios para a diretoria.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-sage-soft)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={14} /> Critérios Validados (3/3)
                </span>
                <button 
                  className="btn-primary" 
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  onClick={() => setActiveTab('boundaries')}
                >
                  Iniciar Alinhamento <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Daily Neuro-Hack Card (Enganar o Cérebro) */}
            <div className="neuro-hack-card">
              <div className="neuro-hack-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Quote size={16} color="var(--accent-amber-soft)" />
                  <span className="badge badge-amber">{brainHacks[currentHackIndex].category}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Neuro-Hack #{currentHackIndex + 1} de {brainHacks.length}</span>
                </div>
                <button 
                  className="btn-ghost" 
                  onClick={() => setCurrentHackIndex((currentHackIndex + 1) % brainHacks.length)}
                  style={{ fontSize: '0.75rem', color: 'var(--accent-amber-soft)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <RefreshCw size={12} /> Próximo Neuro-Hack
                </button>
              </div>
              <p className="neuro-hack-quote">
                "{brainHacks[currentHackIndex].quote}"
              </p>
              <div className="neuro-hack-mechanism">
                <strong style={{ color: 'var(--accent-sage-soft)', display: 'block', marginBottom: '0.2rem' }}>
                  🧠 Como isso engana o cérebro:
                </strong>
                {brainHacks[currentHackIndex].neuroMechanism}
              </div>
              <div className="neuro-hack-action">
                <span style={{ color: 'var(--accent-amber-soft)', fontWeight: 600 }}>⚡ Micropasso de Ação:</span> {brainHacks[currentHackIndex].actionPrompt}
              </div>
            </div>

            {/* Capacity Budget Card */}
            <div className="capacity-card">
              <div className="capacity-header">
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} color="var(--accent-amber-soft)" /> Orçamento Biológico do Dia
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Você não possui 8 horas de foco sustentado. A neurociência indica até 3h30 de Deep Work. O KAIROS protege 28% de margem intocável contra imprevistos.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => calendarService.exportToICS(demands)}
                    title="Exportar time-blocks para Google Agenda, Outlook ou Apple Calendar"
                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                  >
                    <Download size={14} /> Sincronizar Google Agenda (.ics)
                  </button>
                  <span className="badge badge-sage">Capacidade Saudável</span>
                </div>
              </div>

              {/* Multi-segment Budget Bar */}
              <div className="budget-bar-container">
                <div 
                  className="budget-segment segment-deep" 
                  style={{ width: `${(deepWorkMinutes / 480) * 100}%` }} 
                  title={`Deep Work: ${deepWorkMinutes}m alocados de ${maxDeepWork}m limite biológico`}
                />
                <div 
                  className="budget-segment segment-shallow" 
                  style={{ width: `${(shallowMinutes / 480) * 100}%` }} 
                  title={`Coordenação: ${shallowMinutes}m alocados`}
                />
                <div 
                  className="budget-segment segment-buffer" 
                  style={{ width: `${(bufferMinutes / 480) * 100}%` }} 
                  title="Buffer de Imprevistos: 1h30m Intocável (28%)"
                />
                <div 
                  className="budget-segment segment-rest" 
                  style={{ width: `${((480 - deepWorkMinutes - shallowMinutes - bufferMinutes) / 480) * 100}%` }} 
                  title="Margem Livre / Regeneração"
                />
              </div>

              <div className="budget-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--accent-amber)' }} />
                  <span><strong>Deep Work (Foco Nobre):</strong> 2h45m / 3h30m máx</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#4F5868' }} />
                  <span><strong>Coordenação & Reuniões:</strong> 1h45m</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: 'var(--accent-sage)' }} />
                  <span><strong>Buffer Imprevistos (Intocável):</strong> 1h30m (28%)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#181C23' }} />
                  <span><strong>Margem Segura:</strong> 2h00m</span>
                </div>
              </div>
            </div>

            {/* Emergency Trade-off Simulator Banner */}
            {!emergencyResolved ? (
              <div className="simulation-banner">
                <AlertTriangle size={24} color="var(--accent-amber-soft)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent-amber-soft)', marginBottom: '0.3rem' }}>
                    Simulação de Trade-Off: Nova Demanda Externa Inesperada
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    Mensagem do Diretor acabou de chegar: <em>"Preciso de uma reunião emergencial de 1 hora hoje às 14:00 para revisar o orçamento."</em>
                  </p>
                  <div style={{ background: 'rgba(12, 14, 18, 0.7)', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-amber-soft)', fontWeight: 600 }}>
                      Análise do Guardião KAIROS (IA):
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Sua tarde já possui o agendamento da <strong>Prova de Habilitação (14:00 - Hard Deadline)</strong> e a dobradiça da porta após o almoço. Se você aceitar essa reunião agora sem negociar, terá que cancelar a prova (risco de expiração de laudo do Detran) ou invadir sua noite de descanso.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-primary" 
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      onClick={() => setEmergencyResolved('recusou')}
                    >
                      🛡️ Gerar Contraproposta Diplomática ("Posso amanhã às 09h")
                    </button>
                    <button 
                      className="btn-secondary" 
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      onClick={() => setEmergencyResolved('aceitou_troca')}
                    >
                      ⚖️ Aceitar e Deslocar a Prova Conscientemente
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--accent-sage-dim)', border: '1px solid rgba(118, 142, 122, 0.4)', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-sage-soft)' }}>
                  ✓ Decisão registrada: {emergencyResolved === 'recusou' ? 'Você protegeu sua prioridade legal crítica e enviou uma contraproposta assertiva ao diretor.' : 'Você fez uma troca consciente de agenda sem a ilusão de capacidade infinita.'}
                </span>
                <button className="btn-ghost" style={{ fontSize: '0.75rem' }} onClick={() => setEmergencyResolved(null)}>Reiniciar Simulação</button>
              </div>
            )}

            {/* Today's Priority and Grid */}
            <div className="columns-layout">
              {/* Left Column: Scheduled Items */}
              <div>
                <h3 className="section-title">
                  <CheckCircle2 size={18} color="var(--accent-amber-soft)" /> Compromissos & Execuções de Hoje
                </h3>
                
                <div className="demand-list">
                  {demands.filter(d => d.status === 'HOJE' || d.id === 'dem-2' || d.id === 'dem-4' || d.id === 'dem-3').map(item => (
                    <div key={item.id} className="demand-card">
                      <div className="demand-top">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <button 
                            onClick={() => toggleTaskStatus(item.id)} 
                            style={{ marginTop: '0.15rem', color: item.status === 'CONCLUÍDO' ? 'var(--accent-sage-soft)' : 'var(--text-dim)' }}
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <div>
                            <h4 className="demand-title" style={{ textDecoration: item.status === 'CONCLUÍDO' ? 'line-through' : 'none', color: item.status === 'CONCLUÍDO' ? 'var(--text-muted)' : 'inherit' }}>
                              {item.title}
                            </h4>
                            <div className="demand-meta" style={{ marginTop: '0.35rem' }}>
                              <span className="badge badge-amber">{item.scheduledTime || 'Hoje'}</span>
                              <span className="badge badge-gray">{item.estimatedMinutes} min</span>
                              <span className={`badge ${item.energyLevel.includes('Alta') ? 'badge-amber' : 'badge-sage'}`}>
                                {item.energyLevel.split(' ')[0]} Energia
                              </span>
                              <span className={`badge ${item.deadlineType.includes('Hard') ? 'badge-rose' : 'badge-sage'}`}>
                                {item.deadlineType.split(' ')[0]} Deadline
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="btn-ghost" onClick={() => setInspectDemand(item)} title="Ver diagnóstico detalhado da IA">
                          <Eye size={16} />
                        </button>
                      </div>

                      {/* Next Physical Action Box */}
                      <div className="next-action-box">
                        <div className="next-action-label">Próxima Ação Física Concreta</div>
                        <p style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>
                          {item.nextAction}
                        </p>
                      </div>

                      {/* AI Reasoning */}
                      <div className="ai-reasoning-box">
                        <div className="ai-reasoning-header">
                          <BrainCircuit size={13} /> Por que está aqui hoje?
                        </div>
                        <p>{item.aiDiagnosis}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Protected Quadrant II & Week Highlights */}
              <div>
                <h3 className="section-title">
                  <ShieldCheck size={18} color="var(--accent-sage-soft)" /> Protegido para a Semana (Sem Culpa)
                </h3>

                <div className="demand-list">
                  {demands.filter(d => d.id === 'dem-1' || d.id === 'dem-5').map(item => (
                    <div key={item.id} className="demand-card" style={{ opacity: 0.95 }}>
                      <div className="demand-top">
                        <div>
                          <h4 className="demand-title">{item.title}</h4>
                          <div className="demand-meta" style={{ marginTop: '0.35rem' }}>
                            <span className="badge badge-sage">{item.deadlineText || item.scheduledTime}</span>
                            <span className="badge badge-mist">{item.domain}</span>
                            <span className="badge badge-gray">{item.estimatedMinutes} min</span>
                          </div>
                        </div>
                        <button className="btn-ghost" onClick={() => setInspectDemand(item)}>
                          <Eye size={16} />
                        </button>
                      </div>

                      <div className="next-action-box" style={{ borderLeftColor: 'var(--accent-sage)' }}>
                        <div className="next-action-label" style={{ color: 'var(--accent-sage-soft)' }}>Estratégia de Alocação da IA</div>
                        <p style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>
                          {item.id === 'dem-1' && 'Alocado no sábado de manhã: protege a semana útil da dispersão criativa e garante foco tranquilo sem culpa.'}
                          {item.id === 'dem-5' && 'Ponto de apoio preventivo agendado na quinta às 15:30: desbloqueia a Lívia antes da entrega final de sexta-feira.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-amber-soft)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <HelpCircle size={15} /> Princípio da Arbitragem de Tempo
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Diferenciamos <em>tempo livre</em> de <em>disponibilidade para assumir obrigações</em>. Espaços vazios no calendário são buffers biológicos para você pensar, descansar e absorver atrasos naturais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: DEMONSTRAÇÃO PRÁTICA (5 DEMANDAS) ----------------- */}
        {activeTab === 'showcase' && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-amber-dim)', border: '1px solid rgba(212, 163, 89, 0.35)', padding: '0.25rem 0.75rem', borderRadius: '4px', color: 'var(--accent-amber-soft)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                <Sparkles size={14} /> Estudo de Caso Prático do Briefing
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600 }}>Demonstração Prática com as 5 Demandas Reais</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Veja exatamente como o KAIROS OS analisa, questiona, desdobra em ações físicas e aloca cada uma das 5 demandas do seu briefing, declarando hipóteses e evitando prazos fictícios.
              </p>
            </div>

            <div className="showcase-grid">
              {demands.slice(0, 5).map((item, index) => (
                <div key={item.id} className="showcase-card">
                  <div className="showcase-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="showcase-num">{index + 1}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span className="badge badge-amber">{item.category}</span>
                          <span className="badge badge-mist">{item.domain}</span>
                          <span className="badge badge-sage">{item.eisenhowerQuadrant}</span>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{item.title}</h3>
                      </div>
                    </div>
                    <span className="badge badge-gray">{item.estimatedMinutes} min estimativa</span>
                  </div>

                  <div className="showcase-grid-content">
                    {/* Pergunta Cirúrgica da IA */}
                    <div className="showcase-block" style={{ borderLeft: '3px solid var(--accent-amber)' }}>
                      <div className="showcase-block-title" style={{ color: 'var(--accent-amber-soft)' }}>
                        <BrainCircuit size={13} /> Pergunta Cirúrgica da IA
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                        "{item.surgicalQuestion}"
                      </p>
                    </div>

                    {/* Próxima Ação Física Concreta */}
                    <div className="showcase-block" style={{ borderLeft: '3px solid var(--accent-sage)' }}>
                      <div className="showcase-block-title" style={{ color: 'var(--accent-sage-soft)' }}>
                        <Zap size={13} /> Próxima Ação Física Concreta (GTD)
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        {item.nextAction}
                      </p>
                    </div>

                    {/* Definição de Pronto (DoD) */}
                    <div className="showcase-block" style={{ borderLeft: '3px solid var(--accent-mist)' }}>
                      <div className="showcase-block-title" style={{ color: 'var(--accent-mist)' }}>
                        <CheckCircle2 size={13} /> Critério Inequívoco de Conclusão (Done)
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {item.definitionOfDone}
                      </p>
                    </div>

                    {/* Enquadramento Estratégico & Agenda */}
                    <div className="showcase-block" style={{ borderLeft: '3px solid rgba(212, 163, 89, 0.4)' }}>
                      <div className="showcase-block-title" style={{ color: 'var(--text-muted)' }}>
                        <Calendar size={13} /> Proposta de Agenda & Hipótese Declarada
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        <strong>Alocação:</strong> {item.deadlineText || item.scheduledTime}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <strong>Custo do Atraso:</strong> {item.costOfDelay}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(12, 14, 18, 0.7)', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--accent-amber-soft)' }}>Diagnóstico Comportamental:</strong> {item.aiDiagnosis}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: CAIXA DE ENTRADA & TRIAGEM ----------------- */}
        {activeTab === 'inbox' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Caixa de Entrada & Classificação Progressiva</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Nem toda ideia é uma obrigação imediata. A IA distingue tarefas atômicas, projetos, hábitos e referências.
                </p>
              </div>

              {/* Domain Filter */}
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filtrar:</span>
                {(['Todos', 'Trabalho', 'Liderança', 'Desenvolvimento', 'Casa/Vida'] as const).map(dom => (
                  <button 
                    key={dom}
                    onClick={() => setInboxFilter(dom as any)}
                    className={`badge ${inboxFilter === dom ? 'badge-amber' : 'badge-gray'}`}
                    style={{ cursor: 'pointer', padding: '0.35rem 0.7rem' }}
                  >
                    {dom}
                  </button>
                ))}
                <button className="btn-primary" onClick={() => setShowNewDemandModal(true)} style={{ marginLeft: '0.5rem' }}>
                  <Plus size={15} /> Nova Demanda
                </button>
              </div>
            </div>

            <div className="demand-list">
              {demands
                .filter(d => inboxFilter === 'Todos' || d.domain === inboxFilter)
                .map(item => (
                <div key={item.id} className="demand-card">
                  <div className="demand-top">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span className="badge badge-amber">{item.category}</span>
                        <span className="badge badge-mist">{item.domain}</span>
                        <span className="badge badge-sage">{item.eisenhowerQuadrant}</span>
                        {item.postponementCount > 1 && (
                          <span className="badge badge-rose" title={`Adiado ${item.postponementCount} vezes`}>
                            ⚠️ Adiado {item.postponementCount}x
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{item.title}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => setInspectDemand(item)}>
                        Explorar Diagnóstico
                      </button>
                    </div>
                  </div>

                  <div className="columns-layout" style={{ gap: '1rem', marginTop: '0.5rem' }}>
                    <div className="next-action-box">
                      <div className="next-action-label">Próxima Ação Física Concreta</div>
                      <p style={{ fontSize: '0.85rem' }}>{item.nextAction}</p>
                    </div>
                    <div style={{ background: 'rgba(12, 14, 18, 0.6)', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Critério de Conclusão (Done)
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.definitionOfDone}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Custo do Atraso: <em>{item.costOfDelay}</em></span>
                    <span>Prazo: <strong style={{ color: 'var(--text-main)' }}>{item.deadlineType}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: SOS ANTI-PROCRASTINAÇÃO ----------------- */}
        {activeTab === 'procrastination' && (
          <div className="wizard-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--accent-amber-dim)', padding: '0.75rem', borderRadius: '4px', color: 'var(--accent-amber-soft)' }}>
                <Zap size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Modo "Me Ajude a Começar Agora" (Start Me Up)</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Procrastinação é regulação emocional e sobrecarga, não preguiça moral. Investigamos a causa e reduzimos o atrito em 60 segundos.
                </p>
              </div>
            </div>

            {/* Select Stuck Task */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                1. Em qual demanda você está sentindo atrito ou adiamento repetido?
              </label>
              <select 
                value={selectedProcrastinationDemand}
                onChange={(e) => setSelectedProcrastinationDemand(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '4px', color: 'var(--text-main)', fontSize: '0.9rem' }}
              >
                {demands.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.domain} - Adiado {d.postponementCount}x)
                  </option>
                ))}
              </select>
            </div>

            {/* Friendly Diagnostic */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                2. Diagnóstico Rápido: O que mais se aproxima do seu sentimento agora?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {[
                  { id: 'vague', label: 'É grande ou vago demais', icon: '🌫️', desc: 'Não sei exatamente por onde começar' },
                  { id: 'perfectionism', label: 'Perfeccionismo / Medo', icon: '🎯', desc: 'Quero fazer perfeito e travo' },
                  { id: 'fatigue', label: 'Cansaço / Pouca Energia', icon: '🔋', desc: 'Minha bateria biológica está no fim' },
                  { id: 'friction', label: 'Atrito Chato / Mecânico', icon: '🧱', desc: 'Ação burocrática ou física irritante' }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setProcrastinationCause(item.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem',
                      borderRadius: '4px',
                      background: procrastinationCause === item.id ? 'var(--accent-amber-dim)' : 'var(--bg-secondary)',
                      border: `1px solid ${procrastinationCause === item.id ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                      color: 'var(--text-main)'
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{item.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intervention Box */}
            <div style={{ background: 'rgba(212, 163, 89, 0.05)', border: '1px solid rgba(212, 163, 89, 0.25)', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-amber-soft)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} /> Intervenção Comportamental Personalizada da IA:
              </h3>

              {procrastinationCause === 'vague' && (
                <div>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Estratégia do "Draft Zero":</strong> Não tente resolver a tarefa inteira. Seu único objetivo hoje é abrir o documento e escrever 3 palavras imperfeitas.
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Intenção de Implementação: "Quando eu abrir o computador, vou apenas rodar 3 minutos. Se eu quiser fechar depois, tenho autorização total."
                  </p>
                </div>
              )}

              {procrastinationCause === 'perfectionism' && (
                <div>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Estratégia da Versão Provisória Tolerável:</strong> Um rascunho de 60% hoje vale 10 vezes mais do que uma obra-prima teórica.
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Intenção de Implementação: "Vou fazer a versão mais rápida e imperfeita possível nos próximos 10 minutos."
                  </p>
                </div>
              )}

              {procrastinationCause === 'fatigue' && (
                <div>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Diagnóstico Biológico:</strong> Seu cérebro está sem glicose e foco. Forçar agora só gera frustração e retrabalho.
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Recomendação da IA: "Remarque essa tarefa para amanhã cedo no seu pico de energia e tire 20 minutos de caminhada ou descompressão agora."
                  </p>
                </div>
              )}

              {procrastinationCause === 'friction' && (
                <div>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Estratégia do Micro-Ritmo (5 Minutos):</strong>
                    {selectedProcrastinationDemand === 'dem-3' 
                      ? ' Pegue apenas a chave de fenda e deixe na pia do banheiro. Só essa ação física quebra o atrito de começar.' 
                      : ' Vamos rodar um cronômetro de apenas 5 minutos de baixa pressão. Quando apitar, você tem total liberdade de parar sem culpa.'}
                  </p>
                </div>
              )}
            </div>

            {/* Low-Pressure Focus Timer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '1rem 1.5rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Cronômetro de Descompressão de Inércia
                </span>
                <div style={{ fontSize: '1.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: timerSeconds > 0 ? 'var(--accent-amber-soft)' : 'var(--accent-sage-soft)' }}>
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => setTimerActive(!timerActive)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  {timerActive ? <Pause size={16} /> : <Play size={16} />} {timerActive ? 'Pausar' : 'Iniciar 5 Min'}
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => { setTimerActive(false); setTimerSeconds(300); }}
                  style={{ padding: '0.5rem 0.8rem' }}
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Advanced Anti-Sabotage Arsenal for Chronic Procrastinators & Adrenaline Junkies */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <Flame size={20} color="var(--accent-amber)" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                    Arsenal Anti-Sabotagem: Para Viciados em Adrenalina & Síndrome do Impostor
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Táticas clínicas e neuro-hacks desenvolvidos para desarmar a paralisia do ego, a miopia temporal e o vício no pânico de última hora.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem', marginBottom: '1.25rem' }}>
                {antiSabotageTactics.map(tactic => (
                  <button 
                    key={tactic.id}
                    className={`tactic-tab-btn ${activeTacticId === tactic.id ? 'active' : ''}`}
                    onClick={() => setActiveTacticId(tactic.id)}
                  >
                    <span>{tactic.title}</span>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>

              {/* Active Tactic Detail Card */}
              {(() => {
                const cur = antiSabotageTactics.find(t => t.id === activeTacticId) || antiSabotageTactics[0];
                return (
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--accent-amber-soft)' }}>{cur.title}</strong>
                      <span className="badge badge-amber">{cur.subtitle}</span>
                    </div>

                    <div style={{ marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Causa Raiz Oculta (Por que você faz isso):
                      </span>
                      <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.55 }}>
                        {cur.psychologicalRoot}
                      </p>
                    </div>

                    <div style={{ background: 'rgba(212, 163, 89, 0.08)', border: '1px solid rgba(212, 163, 89, 0.25)', borderRadius: '4px', padding: '0.85rem', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber-soft)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        🧠 Como o Neuro-Hack engana o cérebro:
                      </span>
                      <p style={{ fontSize: '0.83rem', color: 'var(--text-main)', marginTop: '0.2rem', lineHeight: 1.55 }}>
                        {cur.neuroHack}
                      </p>
                    </div>

                    {/* Interactive Special Tool for Crappy Draft */}
                    {cur.id === 'tactic-1' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(12, 14, 18, 0.8)', padding: '0.85rem 1rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber-soft)', fontWeight: 700, textTransform: 'uppercase' }}>
                            CRONÔMETRO: 7 MINUTOS PARA FAZER MALFEITO
                          </div>
                          <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            {Math.floor(crappyDraftTimer / 60)}:{(crappyDraftTimer % 60).toString().padStart(2, '0')}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Proibido editar ou apagar. Apenas produza o rascunho cru.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            className="btn-primary" 
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                            onClick={() => setCrappyDraftRunning(!crappyDraftRunning)}
                          >
                            {crappyDraftRunning ? 'Pausar' : 'Iniciar Rascunho Podre'}
                          </button>
                          <button 
                            className="btn-secondary" 
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.6rem' }}
                            onClick={() => { setCrappyDraftRunning(false); setCrappyDraftTimer(420); }}
                          >
                            <RefreshCw size={12} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ fontSize: '0.84rem', color: 'var(--text-main)' }}>
                      <strong>⚡ Ação Imediata Obrigatória:</strong> {cur.actionStep}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: DIZER NÃO & DELEGAÇÃO ----------------- */}
        {activeTab === 'boundaries' && (
          <div>
            <div className="columns-layout">
              {/* Left Column: Saying No Studio */}
              <div className="wizard-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'rgba(224, 108, 117, 0.15)', padding: '0.6rem', borderRadius: '4px', color: 'var(--accent-rose)' }}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Gerador de Recusas & Negociações</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      Diga "não" de maneira elegante, mantendo relacionamentos e protegendo sua capacidade real.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quem pediu?</label>
                    <select 
                      value={recipientType}
                      onChange={(e) => setRecipientType(e.target.value as any)}
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '0.25rem' }}
                    >
                      <option value="boss">Líder / Diretoria</option>
                      <option value="client">Cliente Externo</option>
                      <option value="peer">Colega de Outra Área</option>
                      <option value="friend">Amigo / Família</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tipo de Demanda</label>
                    <select 
                      value={requestContext}
                      onChange={(e) => setRequestContext(e.target.value as any)}
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '0.25rem' }}
                    >
                      <option value="extraTask">Tarefa Nova Fora do Escopo</option>
                      <option value="meeting">Reunião sem Pauta Clara</option>
                      <option value="tightDeadline">Prazo Irrealista</option>
                    </select>
                  </div>
                </div>

                {/* 3 Ready Templates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Template 1: O Não Direto */}
                  <div className="prompt-copy-box">
                    <button 
                      className="copy-btn" 
                      onClick={() => copyToClipboard(
                        recipientType === 'boss' 
                          ? 'Obrigado por trazer isso. No momento estou 100% focado na entrega do Projeto Alfa até sexta. Para garantir a qualidade dessa entrega principal, não consigo assumir essa nova frente agora.' 
                          : 'Agradeço o convite! Estou com a capacidade da semana totalmente alocada nos compromissos prioritários e não vou conseguir contribuir como gostaria.', 
                        't1'
                      )}
                    >
                      {copiedKey === 't1' ? <Check size={14} color="var(--accent-sage-soft)" /> : <Copy size={14} />} Copiar
                    </button>
                    <div style={{ color: 'var(--accent-amber-soft)', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                      Opção 1: O Não Claro & Elegante
                    </div>
                    {recipientType === 'boss' 
                      ? '"Obrigado por trazer isso. No momento estou 100% focado na entrega do Projeto Alfa até sexta. Para garantir a qualidade dessa entrega principal, não consigo assumir essa nova frente agora."'
                      : '"Agradeço o convite! Estou com a capacidade da semana totalmente alocada nos compromissos prioritários e não vou conseguir contribuir como gostaria."'}
                  </div>

                  {/* Template 2: O Sim Condicional */}
                  <div className="prompt-copy-box">
                    <button 
                      className="copy-btn" 
                      onClick={() => copyToClipboard(
                        'Consigo assumir isso sim, desde que adiemos a entrega do relatório da filial para a próxima semana. Faz sentido essa troca para você?',
                        't2'
                      )}
                    >
                      {copiedKey === 't2' ? <Check size={14} color="var(--accent-sage-soft)" /> : <Copy size={14} />} Copiar
                    </button>
                    <div style={{ color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                      Opção 2: O "Sim Condicional" (Trade-off Explícito)
                    </div>
                    "Consigo assumir isso sim, desde que adiemos a entrega do relatório da filial para a próxima semana. Faz sentido essa troca para você?"
                  </div>

                  {/* Template 3: A Delegação Orientada */}
                  <div className="prompt-copy-box">
                    <button 
                      className="copy-btn" 
                      onClick={() => copyToClipboard(
                        'Não tenho margem para conduzir a execução direta, mas posso orientar a Lívia para estruturar o rascunho e eu reviso os pontos críticos em 15 minutos na quinta.',
                        't3'
                      )}
                    >
                      {copiedKey === 't3' ? <Check size={14} color="var(--accent-sage-soft)" /> : <Copy size={14} />} Copiar
                    </button>
                    <div style={{ color: 'var(--accent-sage-soft)', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                      Opção 3: Delegação com Apoio Cirúrgico
                    </div>
                    "Não tenho margem para conduzir a execução direta, mas posso orientar a Lívia para estruturar o rascunho e eu reviso os pontos críticos em 15 minutos na quinta."
                  </div>
                </div>
              </div>

              {/* Right Column: Delegation Manager */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'var(--accent-sage-dim)', padding: '0.6rem', borderRadius: '4px', color: 'var(--accent-sage-soft)' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Acompanhamento de Delegação Lúcida</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      Defina autonomia (níveis 1, 2, 3 de Michael Hyatt), critério de sucesso e perguntas de apoio em vez de fiscalização constante.
                    </p>
                  </div>
                </div>

                <div className="demand-list">
                  {delegations.map(del => (
                    <div key={del.id} className="demand-card">
                      <div className="demand-top">
                        <div>
                          <span className="badge badge-mist">{del.assignee}</span>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.35rem' }}>{del.taskTitle}</h4>
                        </div>
                        <span className="badge badge-sage">Autonomia {del.autonomyLevel.split(' ')[0]}</span>
                      </div>

                      <div style={{ background: 'rgba(12, 14, 18, 0.6)', padding: '0.6rem 0.8rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>ENTREGÁVEL COMBINADO (DONE)</div>
                        <p style={{ color: 'var(--text-secondary)' }}>{del.definitionOfDone}</p>
                      </div>

                      <div className="prompt-copy-box" style={{ padding: '0.75rem', fontSize: '0.78rem' }}>
                        <button 
                          className="copy-btn" 
                          onClick={() => copyToClipboard(del.supportPrompt, del.id)}
                        >
                          {copiedKey === del.id ? <Check size={12} color="var(--accent-sage-soft)" /> : <Copy size={12} />} Copiar
                        </button>
                        <div style={{ color: 'var(--accent-amber-soft)', fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.72rem' }}>
                          Mensagem de Apoio (Check-in {del.checkInDate}):
                        </div>
                        "{del.supportPrompt}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 6: COACH & SPARRING IA ----------------- */}
        {activeTab === 'sparring' && (
          <div className="chat-shell">
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2.2rem', height: '2.2rem', borderRadius: '4px', background: 'linear-gradient(135deg, #D4A359, #8C6A30)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0C0E12' }}>
                  <BrainCircuit size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Coach KAIROS: Sparring & Decisão</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Postura Ativa: <strong style={{ color: 'var(--accent-amber-soft)' }}>{coachPosture}</strong> • Conectado à IA com persistência local.
                  </p>
                </div>
              </div>
              <span className="badge badge-sage">Sessão Cognitiva</span>
            </div>

            <div className="chat-messages">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  <div style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'rgba(0,0,0,0.6)' : 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{msg.sender === 'user' ? 'Você' : `KAIROS (${msg.posture || coachPosture})`}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
              {isAiLoading && (
                <div className="chat-bubble bubble-ai" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  KAIROS está analisando sua capacidade e ponderando o trade-off...
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="chat-quick-prompts">
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Atalhos:</span>
              <button className="quick-prompt-btn" onClick={() => handleSendChatMessage('Estou me sentindo sobrecarregado hoje, me ajude a cortar 50% da agenda')}>
                ⚡ Cortar 50% por Sobrecarga
              </button>
              <button className="quick-prompt-btn" onClick={() => handleSendChatMessage('Por que estou adiando arrumar a porta do banheiro?')}>
                🧱 Desvendar Procrastinação da Porta
              </button>
              <button className="quick-prompt-btn" onClick={() => handleSendChatMessage('Como recusar uma demanda urgente do diretor sem gerar atrito?')}>
                🛡️ Recusa Diplomática ao Diretor
              </button>
              <button className="quick-prompt-btn" onClick={() => handleSendChatMessage('Quero fazer meu ritual de encerramento do dia (Shutdown)')}>
                🌙 Ritual de Fechamento (Shutdown)
              </button>
            </div>

            {/* Input Bar */}
            <div className="chat-input-bar">
              <input 
                type="text" 
                placeholder={`Converse com o Sparring Coach (${coachPosture})...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
              />
              <button className="btn-primary" onClick={() => handleSendChatMessage()} disabled={isAiLoading}>
                <Send size={15} /> Enviar
              </button>
            </div>
          </div>
        )}

        {/* ----------------- TAB 7: RETOMADA SEM CULPA ----------------- */}
        {activeTab === 'softLanding' && (
          <div className="wizard-box" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '3.75rem', height: '3.75rem', borderRadius: '4px', background: 'var(--accent-sage-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-sage-soft)', border: '1px solid rgba(118, 142, 122, 0.4)' }}>
              <RotateCcw size={28} />
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Protocolo de Retomada sem Culpa ("Soft Landing")
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              A vida aconteceu e você ficou dias ou semanas sem abrir o app? <strong>Tudo bem.</strong><br />
              Nenhum alerta vermelho piscando. Nenhum sermão moralista. Apenas um recomeço lúcido.
            </p>

            {!softLandingCleaned ? (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--accent-amber-soft)' }}>
                  A IA preparou uma repactuação em 3 passos para você:
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-sage-soft)" />
                    <strong>Arquivar sem culpa:</strong> 3 tarefas antigas que perderam relevância foram movidas para o histórico sem julgamento.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-sage-soft)" />
                    <strong>Salvar na incubadora:</strong> Projetos abertos voltaram para a lista "Algum Dia" para desocupar a mente.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-sage-soft)" />
                    <strong>Apenas 1 vitória hoje:</strong> Sugerimos focar exclusivamente na <em>Prova de Habilitação (12 min)</em> para retomar o ritmo.
                  </li>
                </ul>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem', padding: '0.75rem' }}
                  onClick={() => setSoftLandingCleaned(true)}
                >
                  🌿 Executar Limpeza e Reiniciar Leve
                </button>
              </div>
            ) : (
              <div style={{ background: 'var(--accent-sage-dim)', border: '1px solid rgba(118, 142, 122, 0.4)', borderRadius: '6px', padding: '1.5rem', color: 'var(--accent-sage-soft)' }}>
                <h4 style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                  ✨ Mesa Limpa e Energia Restaurada!
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Pendências acumuladas foram reorganizadas. Sua agenda de hoje tem apenas 1 ação simples. Respire e siga no seu ritmo.
                </p>
                <button 
                  className="btn-secondary" 
                  style={{ marginTop: '1rem', fontSize: '0.85rem' }}
                  onClick={() => { setSoftLandingCleaned(false); setActiveTab('today'); }}
                >
                  Ir para o Cockpit de Hoje
                </button>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 8: EVOLUÇÃO & CONQUISTAS ----------------- */}
        {activeTab === 'evolution' && (
          <div>
            <div className="evolution-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={20} color="var(--accent-amber-soft)" /> Dashboard de Evolução & Conquistas
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    O sucesso aqui é medido pela lucidez das suas decisões e pelo foco protegido, não pela quantidade vazia de tarefas riscadas.
                  </p>
                </div>
                <div className="period-switcher">
                  <button 
                    className={`period-btn ${evolutionPeriod === 'daily' ? 'active' : ''}`}
                    onClick={() => setEvolutionPeriod('daily')}
                  >
                    Hoje (Diário)
                  </button>
                  <button 
                    className={`period-btn ${evolutionPeriod === 'weekly' ? 'active' : ''}`}
                    onClick={() => setEvolutionPeriod('weekly')}
                  >
                    Esta Semana
                  </button>
                  <button 
                    className={`period-btn ${evolutionPeriod === 'monthly' ? 'active' : ''}`}
                    onClick={() => setEvolutionPeriod('monthly')}
                  >
                    Este Mês
                  </button>
                </div>
              </div>
            </div>

            {/* DAILY VIEW */}
            {evolutionPeriod === 'daily' && (
              <div>
                <div className="kpi-grid">
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-amber)' }}>
                    <div className="kpi-title"><Target size={14} color="var(--accent-amber-soft)" /> The Big One (Foco Nobre)</div>
                    <div className="kpi-value" style={{ color: 'var(--accent-amber-soft)' }}>100%</div>
                    <div className="kpi-sub">SLA 10:30 cumprido sem invasão de agenda</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-sage)' }}>
                    <div className="kpi-title"><Shield size={14} color="var(--accent-sage-soft)" /> Buffer Preservado</div>
                    <div className="kpi-value" style={{ color: 'var(--accent-sage-soft)' }}>28%</div>
                    <div className="kpi-sub">1h30m intacta para imprevistos e descanso</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-amber)' }}>
                    <div className="kpi-title"><Clock size={14} color="var(--accent-amber-soft)" /> Foco Nobre Sustentado</div>
                    <div className="kpi-value">2h45m</div>
                    <div className="kpi-sub">Dentro do teto biológico saudável (máx 3h30m)</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-sage)' }}>
                    <div className="kpi-title"><Flame size={14} color="var(--accent-amber-soft)" /> Sabotagens Desarmadas</div>
                    <div className="kpi-value">3x</div>
                    <div className="kpi-sub">Impulsos de adiamento neutralizados pelo SOS</div>
                  </div>
                </div>

                <div className="wizard-box" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-amber-soft)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} /> Registro de Vitórias Reais do Dia
                  </h3>
                  <div className="victories-list">
                    {evolutionMetrics.daily.victories.map((v, i) => (
                      <div key={i} className="victory-item">
                        <span style={{ color: 'var(--accent-sage-soft)', fontWeight: 700 }}>✓</span>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WEEKLY VIEW */}
            {evolutionPeriod === 'weekly' && (
              <div>
                <div className="kpi-grid">
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-sage)' }}>
                    <div className="kpi-title"><BrainCircuit size={14} color="var(--accent-sage-soft)" /> Índice de Clareza Decisória</div>
                    <div className="kpi-value" style={{ color: 'var(--accent-sage-soft)' }}>84 / 100</div>
                    <div className="kpi-sub">+12% vs. semana anterior</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-amber)' }}>
                    <div className="kpi-title"><TrendingUp size={14} color="var(--accent-amber-soft)" /> Proporção Estratégica (Q2)</div>
                    <div className="kpi-value">68%</div>
                    <div className="kpi-sub">Tempo dedicado a metas nobres vs. apagar incêndios</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-amber)' }}>
                    <div className="kpi-title"><ShieldAlert size={14} color="var(--accent-amber-soft)" /> Nãos Diplomáticos Dados</div>
                    <div className="kpi-value">3</div>
                    <div className="kpi-sub">Demandas tóxicas ou fora de escopo barradas</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-sage)' }}>
                    <div className="kpi-title"><Users size={14} color="var(--accent-sage-soft)" /> Liderança com Autonomia</div>
                    <div className="kpi-value">4</div>
                    <div className="kpi-sub">Contratos de delegação formalizados sem microgestão</div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-sage-soft)', marginBottom: '0.5rem' }}>
                    🌿 Síntese da Semana: Zero Ilusão de Capacidade Infinita
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Em 5 dos 5 dias úteis, você respeitou o fechamento de agenda às 18:30 e não invadiu o descanso noturno. Sua equipe operou com clareza nos entregáveis e você manteve 28% de margem intocável contra imprevistos.
                  </p>
                </div>
              </div>
            )}

            {/* MONTHLY VIEW */}
            {evolutionPeriod === 'monthly' && (
              <div>
                <div className="kpi-grid">
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-amber)' }}>
                    <div className="kpi-title"><Sparkles size={14} color="var(--accent-amber-soft)" /> Projetos de Vida Destravados</div>
                    <div className="kpi-value">3</div>
                    <div className="kpi-sub">Mural da Vida, Processo do Squad, Exame Detran</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-sage)' }}>
                    <div className="kpi-title"><ShieldCheck size={14} color="var(--accent-sage-soft)" /> Colapsos de Burnout Evitados</div>
                    <div className="kpi-value" style={{ color: 'var(--accent-sage-soft)' }}>7x</div>
                    <div className="kpi-sub">Alertas do Guardião KAIROS que protegeram sua sanidade</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-amber)' }}>
                    <div className="kpi-title"><Users size={14} color="var(--accent-amber-soft)" /> Crescimento da Equipe</div>
                    <div className="kpi-value">+2 Níveis</div>
                    <div className="kpi-sub">Liderados promovidos a autonomia de decisão</div>
                  </div>
                  <div className="kpi-card" style={{ borderTop: '2px solid var(--accent-sage)' }}>
                    <div className="kpi-title"><RotateCcw size={14} color="var(--accent-sage-soft)" /> Retomadas sem Culpa</div>
                    <div className="kpi-value">1</div>
                    <div className="kpi-sub">Zero acúmulo punitivo após períodos de folga</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 9: MEMÓRIA & INTEGRAÇÕES ----------------- */}
        {activeTab === 'memory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={20} color="var(--accent-amber-soft)" /> Canais, Integrações & Memória
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Conecte seu WhatsApp (+55 11 97555-6111), e-mail Hostinger (lud@mktcx.com.br), Google Workspace e publique na Apple App Store.
                </p>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => setShowAppStoreModal(true)}
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}
              >
                <Apple size={16} /> Como Publicar na Apple App Store
              </button>
            </div>

            {/* SEÇÃO 1: HUB DE INTEGRAÇÕES EXECUTIVAS */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Share2 size={18} color="var(--accent-amber-soft)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Canais de Captura & Assistência Contínua</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                
                {/* CARD WHATSAPP */}
                <div className="wizard-box" style={{ background: 'var(--bg-card)', border: '1px solid rgba(37, 211, 102, 0.25)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Smartphone size={20} color="#25D366" />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-main)' }}>WhatsApp Executive Assistant</strong>
                        <span style={{ fontSize: '0.75rem', color: '#25D366', fontWeight: 600 }}>{integrations.whatsapp.phoneNumber}</span>
                      </div>
                    </div>
                    <span className="badge badge-sage" style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', borderColor: 'rgba(37, 211, 102, 0.3)' }}>
                      ● Conectado
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    Envie áudios gravados na rua ou mensagens rápidas. A IA transcreve em tempo real e extrai a Próxima Ação Física sem ruído cognitivo.
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🎙️ Transcrição Whisper AI:</span>
                      <strong style={{ color: 'var(--accent-sage-soft)' }}>Ativa (Voz → GTD)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🌅 Briefing Matinal:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{integrations.whatsapp.morningBriefingTime} (Top 3 Prioridades)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🌙 Shutdown Noturno:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{integrations.whatsapp.eveningShutdownTime} (Blindagem de Sono)</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-primary" 
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: '#25D366', color: '#000', fontWeight: 600 }}
                      onClick={handleSimulateWhatsAppAudio}
                    >
                      🎙️ Simular Áudio Recebido
                    </button>
                    <button 
                      className="btn-ghost" 
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                      onClick={() => updateIntegration('whatsapp', { enabled: !integrations.whatsapp.enabled })}
                    >
                      {integrations.whatsapp.enabled ? 'Pausar Notificações' : 'Reativar'}
                    </button>
                  </div>
                </div>

                {/* CARD HOSTINGER */}
                <div className="wizard-box" style={{ background: 'var(--bg-card)', border: '1px solid rgba(212, 163, 89, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(212, 163, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mail size={20} color="var(--accent-amber-soft)" />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-main)' }}>Hostinger Webmail</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber-soft)', fontWeight: 600 }}>{integrations.hostinger.email}</span>
                      </div>
                    </div>
                    <span className="badge badge-amber">
                      ● IMAP Ativo
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    Monitora sua caixa postal oficial Hostinger. E-mails com tag <code style={{ color: 'var(--accent-amber-soft)' }}>#kairos</code> ou de remetentes VIP são destrinchados sem o pânico da falsa urgência.
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🌐 Servidor IMAP:</span>
                      <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>imap.hostinger.com:993</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>📤 Servidor SMTP:</span>
                      <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>smtp.hostinger.com:465</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🏷️ Tag de Extração:</span>
                      <strong style={{ color: 'var(--accent-amber-soft)' }}>{integrations.hostinger.filterTag}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-primary" 
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                      onClick={handleSimulateHostingerEmail}
                    >
                      ✉️ Simular E-mail #kairos
                    </button>
                    <button 
                      className="btn-ghost" 
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                      onClick={() => alert('Filtro Hostinger configurado para lud@mktcx.com.br. E-mails de clientes serão automaticamente avaliados contra falsas urgências.')}
                    >
                      Configurar Regras
                    </button>
                  </div>
                </div>

                {/* CARD GMAIL & GOOGLE WORKSPACE */}
                <div className="wizard-box" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(66, 133, 244, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={20} color="#4285F4" />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-main)' }}>Google Workspace</strong>
                        <span style={{ fontSize: '0.75rem', color: '#4285F4' }}>Gmail & Google Agenda</span>
                      </div>
                    </div>
                    <span className="badge badge-sage">
                      ● Sincronizado
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    Bloqueio automático de Deep Work para impedir reuniões de terceiros e exportação de eventos para o app nativo do iPhone.
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🛡️ Bloqueio Auto de Deep Work:</span>
                      <strong style={{ color: 'var(--accent-sage-soft)' }}>Ativo (Manhãs protegidas)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>📅 Formato de Exportação:</span>
                      <strong style={{ color: 'var(--text-main)' }}>iCalendar (.ics) Universal</strong>
                    </div>
                  </div>

                  <button 
                    className="btn-secondary" 
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                    onClick={() => calendarService.exportToICS(demands)}
                  >
                    <Download size={13} style={{ marginRight: '0.3rem' }} /> Baixar Calendário Atual (.ics)
                  </button>
                </div>

                {/* CARD OUTLOOK */}
                <div className="wizard-box" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 120, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe size={20} color="#0078D4" />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-main)' }}>Microsoft 365 / Outlook</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{integrations.outlook.accountEmail}</span>
                      </div>
                    </div>
                    <span className="badge badge-gray">
                      Disponível
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    Conexão corporativa para leitura de compromissos no Microsoft Exchange/Outlook e detecção de reuniões consecutivas sem respiro.
                  </p>

                  <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sincronização:</span>
                      <strong style={{ color: 'var(--text-muted)' }}>Pronto para ativar</strong>
                    </div>
                  </div>

                  <button 
                    className="btn-ghost" 
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                    onClick={() => alert('Conexão Microsoft 365 pronta para OAuth Corporativo.')}
                  >
                    Conectar Conta Microsoft
                  </button>
                </div>

              </div>
            </div>

            {/* SEÇÃO 2: APPLE APP STORE BANNER */}
            <div style={{ background: 'linear-gradient(135deg, rgba(212,163,89,0.12) 0%, rgba(20,24,30,0.95) 100%)', border: '1px solid rgba(212,163,89,0.35)', borderRadius: '8px', padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ maxWidth: '640px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Apple size={20} color="var(--accent-amber-soft)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-amber-soft)' }}>
                    Aplicativo Nativo na Loja da Apple (App Store)
                  </h3>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Você pode usar o KAIROS hoje mesmo como PWA no Safari (100% grátis, tela cheia e ícone nativo) ou publicar o pacote oficial assinado na App Store da Apple via Capacitor.
                </p>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => setShowAppStoreModal(true)}
                style={{ fontSize: '0.8rem', padding: '0.55rem 1.1rem' }}
              >
                Ver Custos & Passo a Passo
              </button>
            </div>

            {/* SEÇÃO 3: GEMINI API KEY */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Key size={16} color="var(--accent-amber-soft)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Conexão com Google Gemini API (Opcional)</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Se desejar respostas em tempo real pelo modelo generativo da Google, insira sua chave. Se não tiver, o app continua funcionando com o motor cognitivo local sem interrupção.
              </p>
              <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '0.6rem', maxWidth: '600px' }}>
                <input 
                  type="password" 
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.55rem 0.85rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1rem' }}>
                  {isSavingKey ? 'Salvo!' : 'Salvar Chave'}
                </button>
              </form>
            </div>

            {/* SEÇÃO 4: MEMÓRIA COGNITIVA TRANSPARENTE */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>Fatos & Premissas Aprendidas pela IA</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Aqui está o que o KAIROS infere sobre seus padrões. Você tem soberania total para validar ou questionar qualquer premissa.
              </p>
              
              <div className="demand-list">
                {memoryFacts.map(fact => (
                  <div key={fact.id} className="demand-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, paddingRight: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span className="badge badge-amber">{fact.category}</span>
                        <span className={`badge ${fact.confidence === 'Alta' ? 'badge-sage' : 'badge-gray'}`}>
                          Confiança: {fact.confidence}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        "{fact.insight}"
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className={`btn-ghost ${fact.userApproved ? 'badge-sage' : ''}`}
                        onClick={() => setMemoryFacts(memoryFacts.map(f => f.id === fact.id ? { ...f, userApproved: !f.userApproved } : f))}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {fact.userApproved ? '✓ Confirmado por Você' : 'Questionar Premissa'}
                      </button>
                      <button 
                        className="btn-ghost" 
                        style={{ color: 'var(--accent-rose)' }}
                        onClick={() => setMemoryFacts(memoryFacts.filter(f => f.id !== fact.id))}
                        title="Apagar esta memória"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-sage-soft)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} /> Privacidade & Fronteira Estrita de Dados
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Seus sentimentos, reflexões, check-ins de energia, áudios do WhatsApp e tarefas pessoais (como a porta do banheiro ou mural da vida) são hermeticamente isolados e nunca são exibidos para membros da sua equipe ou em relatórios compartilhados.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* ----------------- MODAL: NOTIFICAÇÕES INTELIGENTES ----------------- */}
      {showNotificationsModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="wizard-box modal-sheet" style={{ width: '100%', maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} color="var(--accent-amber-soft)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Notificações & Empurrões Comportamentais</h3>
              </div>
              <button className="btn-ghost" onClick={() => setShowNotificationsModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              O KAIROS só envia alertas quando há risco biológico real de sobrecarga, deadline iminente ou oportunidade de desarmar a procrastinação.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {notifications.map(n => (
                <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markNotificationAsRead(n.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>{n.title}</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {n.body}
                  </p>
                  {n.actionTab && (
                    <button 
                      className="btn-ghost" 
                      style={{ alignSelf: 'flex-start', fontSize: '0.75rem', color: 'var(--accent-amber-soft)', padding: 0, marginTop: '0.2rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNotificationsModal(false);
                        setActiveTab(n.actionTab as any);
                      }}
                    >
                      Acessar no App →
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.85rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <strong style={{ fontSize: '0.82rem', display: 'block', color: 'var(--text-main)' }}>Notificações no iOS / Safari</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Receba empurrões mesmo com o navegador fechado</span>
              </div>
              <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }} onClick={requestNotificationPermission}>
                Ativar Alertas Nativos
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowNotificationsModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: HISTÓRICO DE VERSÕES ----------------- */}
      {showVersionModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="wizard-box modal-sheet" style={{ width: '100%', maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} color="var(--accent-amber-soft)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Configurações & Histórico de Versões</h3>
              </div>
              <button className="btn-ghost" onClick={() => setShowVersionModal(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Mobile Fast Controls for Energy & Posture */}
            <div style={{ background: 'rgba(212, 163, 89, 0.08)', border: '1px solid rgba(212, 163, 89, 0.3)', borderRadius: '6px', padding: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Ajuste Biológico & Postura da IA
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Energia Atual</label>
                  <select 
                    value={currentEnergy} 
                    onChange={(e) => setCurrentEnergy(e.target.value as EnergyState)}
                    style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '0.4rem', color: 'var(--text-main)', fontSize: '0.8rem' }}
                  >
                    <option value="Alta">Alta ⚡ (Foco Nobre)</option>
                    <option value="Média">Média ⚖️ (Coordenação)</option>
                    <option value="Baixa">Baixa 🔋 (Recarga)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Postura do Coach</label>
                  <select 
                    value={coachPosture} 
                    onChange={(e) => setCoachPosture(e.target.value as CoachPosture)}
                    style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '0.4rem', color: 'var(--text-main)', fontSize: '0.8rem' }}
                  >
                    <option value="Guardião Firme">Guardião Firme 🛡️</option>
                    <option value="Parceiro Empático">Parceiro Empático 🤝</option>
                    <option value="Assistente Pragmático">Assistente Pragmático ⚙️</option>
                  </select>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Conforme sua diretriz, mantemos sempre as versões anteriores salvas com garantia total de retorno (Git Tags e Snapshots em disco):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(212, 163, 89, 0.4)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--accent-amber-soft)', fontSize: '0.85rem' }}>v1.5 Executive Integrations & App Store (Atual)</strong>
                  <span className="badge badge-amber">Ativa</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Integração WhatsApp (+55 11 97555-6111), Hostinger (lud@mktcx.com.br), Google Workspace, Outlook e Guia Apple App Store.
                </p>
                <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Tag: v1.5-integrations-appstore • snapshots/v1.5-integrations-appstore/
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>v1.4 Evolution Dashboard & Neuro-Hacks</strong>
                  <span className="badge badge-sage">Snapshot</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Dashboard de evolução temporal (diário/semanal/mensal), neuro-hacks anti-sabotagem, timer Crappy Draft de 7 min e central de notificações inteligentes.
                </p>
                <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Tag: v1.4-anti-sabotage-dashboard • snapshots/v1.4-anti-sabotage-dashboard/
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>v1.3 iOS Pixel-Perfect</strong>
                  <span className="badge badge-sage">Snapshot</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Mobile-first iOS Safari: Safe Area Insets, Telemetria Buffer 28%, The Big One, bottom navigation e modal sheets.
                </p>
                <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Tag: v1.3-ios-pixel-perfect • snapshots/v1.3-ios-pixel-perfect/
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>v1.2 iOS Ready</strong>
                  <span className="badge badge-sage">Snapshot</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  PWA Web App Manifest, metatags iOS status bar preta e suporte de instalação.
                </p>
                <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Tag: v1.2-ios-ready • snapshots/v1.2-ios-ready/
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>v1.1 Executive Sanctuary</strong>
                  <span className="badge badge-sage">Snapshot</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Design System do Stitch (Newsreader + Inter), LocalStorage, Gemini API e exportação ICS.
                </p>
                <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Tag: v1.1-executive-sanctuary • snapshots/v1.1-executive-sanctuary/
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>v1.0 Baseline</strong>
                  <span className="badge badge-sage">Snapshot</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Versão inicial estável com os 8 módulos e 5 casos de estudo.
                </p>
                <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Tag: v1.0-baseline • snapshots/v1.0-baseline/
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button className="btn-secondary" onClick={() => setShowVersionModal(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: GUIA APPLE APP STORE & CUSTOS ----------------- */}
      {showAppStoreModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1rem' }}>
          <div className="wizard-box modal-sheet" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'var(--accent-amber-soft)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Apple size={18} color="#000" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>KAIROS na Loja da Apple (App Store)</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Análise técnica e financeira de viabilidade</span>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setShowAppStoreModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Para você ter o KAIROS no seu iPhone como um aplicativo da Apple, existem <strong>dois caminhos</strong> disponíveis. Avaliamos a viabilidade, a experiência do usuário e os custos exatos:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              
              {/* Opção 1: PWA */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(118, 142, 122, 0.4)', borderRadius: '6px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--accent-sage-soft)' }}>
                    Caminho 1: PWA Nativo no iPhone (Adicionar à Tela de Início)
                  </strong>
                  <span className="badge badge-sage">Custo: R$ 0,00 (Gratuito)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                  <strong>Já está 100% pronto e funcionando agora!</strong> No Safari do iPhone, toque no botão <em>Compartilhar</em> (ícone com a seta) e escolha <em>"Adicionar à Tela de Início"</em>:
                </p>
                <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                  <li><strong>Aparência idêntica a app nativo</strong>: Abre em tela cheia (Standalone) sem nenhuma barra de URL ou botões do navegador.</li>
                  <li><strong>Ícone exclusivo no iPhone</strong>: O ícone preto e dourado do KAIROS fica na sua tela principal como qualquer app.</li>
                  <li><strong>Notificações Push nativas</strong>: Desde o iOS 16.4, o Safari do iPhone recebe notificações push na tela de bloqueio.</li>
                  <li><strong>Instantâneo & Sem Burocracia</strong>: Não precisa esperar semanas por aprovações de comitês da Apple.</li>
                </ul>
              </div>

              {/* Opção 2: App Store Oficial */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(212, 163, 89, 0.4)', borderRadius: '6px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--accent-amber-soft)' }}>
                    Caminho 2: Aplicativo Oficial na Apple App Store (Arquivo .IPA)
                  </strong>
                  <span className="badge badge-amber">Custo: US$ 99/ano Apple</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                  Para que qualquer pessoa possa procurar por "KAIROS" na busca da App Store e clicar no botão "Obter":
                </p>

                {/* Box de Custos */}
                <div style={{ background: 'rgba(212, 163, 89, 0.08)', border: '1px solid rgba(212, 163, 89, 0.25)', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                  <strong style={{ color: 'var(--accent-amber-soft)', display: 'block', marginBottom: '0.4rem' }}>
                    Custos Financeiros Detalhados:
                  </strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>1. Taxa Apple Developer Program:</span>
                    <strong style={{ color: 'var(--text-main)' }}>US$ 99 / ano (~R$ 550 a R$ 600 anuais)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>2. Framework de Empacotamento (Capacitor / Swift):</span>
                    <strong style={{ color: 'var(--accent-sage-soft)' }}>R$ 0,00 (Gratuito / Open Source)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>3. Hospedagem & Domínio (mktcx.com.br / Hostinger):</span>
                    <strong style={{ color: 'var(--accent-sage-soft)' }}>R$ 0 adicional (já contratado)</strong>
                  </div>
                </div>

                <strong style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                  Passo a passo técnico necessário:
                </strong>
                <ol style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                  <li><strong>Empacotamento com Capacitor.js</strong>: Rodamos <code>npx cap add ios</code> neste projeto para gerar um container nativo em Swift/Xcode.</li>
                  <li><strong>Inscrição no Apple Developer</strong>: Cadastro como Pessoa Física ou Jurídica (D-U-N-S da sua empresa) em <code>developer.apple.com</code> e pagamento da anuidade de US$ 99.</li>
                  <li><strong>Build no Xcode</strong>: Compilação do arquivo <code>.ipa</code> assinado com seu certificado de desenvolvedor.</li>
                  <li><strong>TestFlight (Fase Beta)</strong>: Disponibilização imediata no seu iPhone para validação de produção.</li>
                  <li><strong>Revisão & Aprovação da Apple</strong>: Submissão com Política de Privacidade (em <code>mktcx.com.br/privacidade</code>) e capturas de tela para aprovação na App Store (24h a 48h).</li>
                </ol>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button className="btn-secondary" onClick={() => setShowAppStoreModal(false)}>
                Fechar Guia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Simulation Toasts */}
      {showSimulateWhatsAppToast && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 120, background: '#102219', border: '1px solid #25D366', color: '#fff', padding: '0.85rem 1.25rem', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ background: '#25D366', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Smartphone size={18} color="#000" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Áudio WhatsApp Recebido (+55 11 97555-6111)</div>
            <div style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>Convertido em microação de 5 min na sua agenda de hoje!</div>
          </div>
        </div>
      )}

      {showSimulateHostingerToast && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 120, background: '#262014', border: '1px solid var(--accent-amber)', color: '#fff', padding: '0.85rem 1.25rem', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ background: 'var(--accent-amber)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={18} color="#000" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>E-mail Hostinger Triado (lud@mktcx.com.br)</div>
            <div style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>Falsa urgência desarmada! Alocado no bloco nobre de amanhã.</div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: CAPTURA RÁPIDA ----------------- */}
      {showNewDemandModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="wizard-box modal-sheet" style={{ width: '100%', maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Capturar Pensamento / Demanda</h3>
              <button className="btn-ghost" onClick={() => setShowNewDemandModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDemand}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Tire da cabeça imediatamente por texto ou voz. A IA cuidará da triagem, energia e próxima ação.
              </p>

              <textarea 
                rows={3} 
                placeholder="Ex: Fazer alinhamento com a diretoria sobre o novo orçamento..."
                value={newDemandTitle}
                onChange={(e) => setNewDemandTitle(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '0.85rem', color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem', resize: 'none' }}
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  type="button" 
                  className={`btn-secondary ${isVoiceRecording ? 'recording-pulse' : ''}`}
                  onClick={handleVoiceCapture}
                  style={{ fontSize: '0.8rem', color: isVoiceRecording ? 'var(--accent-rose)' : 'inherit' }}
                >
                  <Mic size={14} color={isVoiceRecording ? 'var(--accent-rose)' : 'inherit'} />
                  {isVoiceRecording ? 'Ouvindo sua voz...' : 'Ditar por Voz'}
                </button>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowNewDemandModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={isClassifying}>
                    {isClassifying ? 'Classificando com IA...' : 'Classificar com IA'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: INSPECIONAR DEMANDA ----------------- */}
      {inspectDemand && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="wizard-box modal-sheet" style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-amber">{inspectDemand.category}</span>
                <span className="badge badge-sage" style={{ marginLeft: '0.4rem' }}>{inspectDemand.eisenhowerQuadrant}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.3rem' }}>{inspectDemand.title}</h3>
              </div>
              <button className="btn-ghost" onClick={() => setInspectDemand(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div className="next-action-box">
                <div className="next-action-label">Próxima Ação Física Inequívoca (GTD)</div>
                <p style={{ color: 'var(--text-main)' }}>{inspectDemand.nextAction}</p>
              </div>

              <div className="ai-reasoning-box">
                <div className="ai-reasoning-header">
                  <BrainCircuit size={14} /> Diagnóstico Consultivo da IA
                </div>
                <p>{inspectDemand.aiDiagnosis}</p>
              </div>

              <div style={{ background: 'var(--accent-amber-dim)', border: '1px solid rgba(212, 163, 89, 0.35)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber-soft)', fontWeight: 700 }}>PERGUNTA CIRÚRGICA DE DISCERNIMENTO</div>
                <p style={{ color: 'var(--text-main)', marginTop: '0.2rem', fontStyle: 'italic' }}>"{inspectDemand.surgicalQuestion}"</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORIGEM DO PRAZO</div>
                  <div>{inspectDemand.deadlineType}</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>ENERGIA EXIGIDA</div>
                  <div>{inspectDemand.energyLevel}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(224, 108, 117, 0.08)', border: '1px solid rgba(224, 108, 117, 0.3)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-rose)', fontWeight: 700 }}>CUSTO DO ATRASO (SE NÃO FIZER)</div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>{inspectDemand.costOfDelay}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn-secondary" onClick={() => setInspectDemand(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- iOS NATIVE BOTTOM TAB BAR ----------------- */}
      <nav className="ios-tab-bar" aria-label="Navegação iOS">
        <button 
          className={`ios-tab-item ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          <div className="ios-tab-icon"><Calendar size={20} /></div>
          <span>Cockpit</span>
        </button>

        <button 
          className={`ios-tab-item ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          <div className="ios-tab-icon"><Inbox size={20} /></div>
          <span>Triagem ({demands.length})</span>
        </button>

        <button 
          className={`ios-tab-item ${activeTab === 'sparring' ? 'active' : ''}`}
          onClick={() => setActiveTab('sparring')}
        >
          <div className="ios-tab-icon"><MessageSquare size={20} /></div>
          <span>Coach IA</span>
        </button>

        <button 
          className={`ios-tab-item ${activeTab === 'boundaries' ? 'active' : ''}`}
          onClick={() => setActiveTab('boundaries')}
        >
          <div className="ios-tab-icon"><Users size={20} /></div>
          <span>Liderança</span>
        </button>

        <button 
          className={`ios-tab-item ${activeTab === 'softLanding' ? 'active' : ''}`}
          onClick={() => setActiveTab('softLanding')}
        >
          <div className="ios-tab-icon"><RotateCcw size={20} /></div>
          <span>Retomada</span>
        </button>
      </nav>
    </div>
  );
}
