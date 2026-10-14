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
  History
} from 'lucide-react';
import type { Demand, CoachPosture, EnergyState, DelegationItem, MemoryFact, ChatMessage, LifeDomain } from './types';
import { storageService } from './services/storageService';
import { aiService } from './services/aiService';
import { calendarService } from './services/calendarService';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'showcase' | 'inbox' | 'procrastination' | 'boundaries' | 'sparring' | 'softLanding' | 'memory'>('today');
  
  // Persistent State
  const [coachPosture, setCoachPosture] = useState<CoachPosture>(storageService.loadPosture);
  const [currentEnergy, setCurrentEnergy] = useState<EnergyState>(storageService.loadEnergy);
  const [demands, setDemands] = useState<Demand[]>(storageService.loadDemands);
  const [delegations] = useState<DelegationItem[]>(storageService.loadDelegations);
  const [memoryFacts, setMemoryFacts] = useState<MemoryFact[]>(storageService.loadMemory);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(storageService.loadChat);
  const [apiKey, setApiKey] = useState<string>(storageService.getApiKey);
  const [isSavingKey, setIsSavingKey] = useState(false);

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

  // Auto-save to LocalStorage
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
            {/* Version Snapshot Pill */}
            <button 
              className="selector-pill" 
              onClick={() => setShowVersionModal(true)}
              title="Clique para ver o histórico de snapshots e restaurar versões anteriores"
              style={{ cursor: 'pointer' }}
            >
              <History size={13} color="var(--accent-amber-soft)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>v1.1 Executive</span>
            </button>

            {/* Energy Selector */}
            <div className="selector-pill" title="Seu estado biológico atual ajusta as recomendações da IA">
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

            {/* Coach Posture Selector */}
            <div className="selector-pill" title="Ajuste como a IA interage e desafia suas escolhas">
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

            <button 
              className="btn-primary" 
              onClick={() => setShowNewDemandModal(true)}
            >
              <Plus size={16} /> Capturar Demanda
            </button>
          </div>
        </div>
      </header>

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
            className={`nav-tab ${activeTab === 'memory' ? 'active' : ''}`}
            onClick={() => setActiveTab('memory')}
          >
            <Eye size={15} /> 8. Memória & Integrações
          </button>
        </div>
      </nav>

      {/* Main Views */}
      <main className="main-view container">

        {/* ----------------- TAB 1: COCKPIT DO DIA & CAPACIDADE ----------------- */}
        {activeTab === 'today' && (
          <div>
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

        {/* ----------------- TAB 8: MEMÓRIA & INTEGRAÇÕES ----------------- */}
        {activeTab === 'memory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={20} color="var(--accent-amber-soft)" /> Memória Transparente & Conexões
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Controle total sobre o que o sistema aprende e infere sobre você, e configuração da chave da API do Google Gemini.
                </p>
              </div>
            </div>

            {/* Gemini API Key Integration Box */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.75rem' }}>
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

            {/* Memory List */}
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

            <div style={{ marginTop: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-sage-soft)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} /> Privacidade & Fronteira Estrita de Dados
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Seus sentimentos, reflexões, check-ins de energia e tarefas pessoais (como a porta do banheiro ou mural da vida) são hermeticamente isolados e nunca são exibidos para membros da sua equipe ou em relatórios compartilhados.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* ----------------- MODAL: HISTÓRICO DE VERSÕES ----------------- */}
      {showVersionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="wizard-box" style={{ width: '100%', maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} color="var(--accent-amber-soft)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Histórico de Versões & Garantia de Retorno</h3>
              </div>
              <button className="btn-ghost" onClick={() => setShowVersionModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Você pediu que sempre mantivéssemos a versão anterior acessível. O repositório possui controle de versão duplo (Git Tags e pasta física de snapshots):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.85rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--accent-amber-soft)', fontSize: '0.88rem' }}>v1.1 Executive Sanctuary (Atual)</strong>
                  <span className="badge badge-amber">Ativa</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Adoção da paleta e tipografia do Google Stitch (Newsreader + Inter), persistência LocalStorage, integração Gemini API e exportação ICS de agenda.
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.85rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>v1.0 Baseline (Snapshot Arquivado)</strong>
                  <span className="badge badge-sage">Tag Git: v1.0-baseline</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Versão inicial estável com os 8 módulos interativos e demonstração prática das 5 demandas.
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Local físico salvo em: snapshots/v1.0-baseline/
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

      {/* ----------------- MODAL: CAPTURA RÁPIDA ----------------- */}
      {showNewDemandModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="wizard-box" style={{ width: '100%', maxWidth: '520px' }}>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="wizard-box" style={{ width: '100%', maxWidth: '600px' }}>
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
    </div>
  );
}
