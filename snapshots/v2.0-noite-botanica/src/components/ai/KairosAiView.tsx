import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Zap, 
  RotateCcw, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  Flame, 
  Play, 
  Pause, 
  RefreshCw, 
  Trash2, 
  Plus, 
  CheckCircle2
} from 'lucide-react';
import type { 
  CoachPosture, 
  ChatMessage, 
  MemoryFact, 
  Demand, 
  AntiSabotageTactic 
} from '../../types';

export type AiSubTab = 'coach' | 'procrastination' | 'softLanding' | 'memory';

interface KairosAiViewProps {
  coachPosture: CoachPosture;
  onPostureChange: (posture: CoachPosture) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (text?: string) => Promise<void>;
  isAiLoading: boolean;
  demands: Demand[];
  memoryFacts: MemoryFact[];
  onAddMemoryFact: (fact: MemoryFact) => void;
  onDeleteMemoryFact: (id: string) => void;
  antiSabotageTactics: AntiSabotageTactic[];
  activeTacticId: string;
  onSelectTactic: (id: string) => void;
  initialSubTab?: AiSubTab;
  onNavigateToToday: () => void;
}

export const KairosAiView: React.FC<KairosAiViewProps> = ({
  coachPosture,
  onPostureChange,
  chatMessages,
  onSendMessage,
  isAiLoading,
  demands,
  memoryFacts,
  onAddMemoryFact,
  onDeleteMemoryFact,
  antiSabotageTactics,
  activeTacticId,
  onSelectTactic,
  initialSubTab = 'coach',
  onNavigateToToday
}) => {
  const [subTab, setSubTab] = useState<AiSubTab>(initialSubTab);
  const [chatInput, setChatInput] = useState('');
  
  // Anti-procrastination state
  const [selectedProcrastinationDemand, setSelectedProcrastinationDemand] = useState<string>(
    demands[0]?.id || ''
  );
  const [procrastinationCause, setProcrastinationCause] = useState<string>('friction');
  const [timerSeconds, setTimerSeconds] = useState<number>(300);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Soft landing state
  const [softLandingCleaned, setSoftLandingCleaned] = useState(false);

  // New Memory Fact Form
  const [newFactCategory, setNewFactCategory] = useState<'Preferência' | 'Padrão Observado' | 'Limite Biológico' | 'Valor'>('Limite Biológico');
  const [newFactStatement, setNewFactStatement] = useState('');
  const [showAddFact, setShowAddFact] = useState(false);

  // Timer interval for the 5-min descompressor
  React.useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(sec => sec - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  const handleCreateFactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactStatement.trim()) return;
    onAddMemoryFact({
      id: `mem-${Date.now()}`,
      category: newFactCategory,
      insight: newFactStatement.trim(),
      confidence: 'Alta',
      userApproved: true
    });
    setNewFactStatement('');
    setShowAddFact(false);
  };

  const selectedTactic = antiSabotageTactics.find(t => t.id === activeTacticId) || antiSabotageTactics[0];

  return (
    <div className="tab-pane active" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Sub-Navigation Pills */}
      <div className="subnav-pills">
        <button
          onClick={() => setSubTab('coach')}
          className={`subnav-pill ${subTab === 'coach' ? 'active' : ''}`}
        >
          <BrainCircuit size={15} />
          <span>Coach & Sparring IA</span>
        </button>

        <button
          onClick={() => setSubTab('procrastination')}
          className={`subnav-pill ${subTab === 'procrastination' ? 'active' : ''}`}
        >
          <Zap size={15} />
          <span>SOS Anti-Procrastinação</span>
        </button>

        <button
          onClick={() => setSubTab('softLanding')}
          className={`subnav-pill ${subTab === 'softLanding' ? 'active' : ''}`}
        >
          <RotateCcw size={15} />
          <span>Retomada sem Culpa</span>
        </button>

        <button
          onClick={() => setSubTab('memory')}
          className={`subnav-pill ${subTab === 'memory' ? 'active' : ''}`}
        >
          <ShieldCheck size={15} />
          <span>Memória Transparente & Soberania</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: COACH & SPARRING IA
          ========================================================================= */}
      {subTab === 'coach' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Top Posture Selector Card */}
          <div className="botanical-card-highlight">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-amber" style={{ background: 'var(--accent-champagne)', color: 'var(--text-on-champagne)', fontWeight: 700 }}>
                  CONSULTOR DE DECISÃO
                </span>
                <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.2rem 0 0.3rem 0' }}>
                  Coach KAIROS: Sparring & Liderança
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Não é um chatbot passivo. O KAIROS questiona autoenganos, expõe trade-offs e protege seus limites executivos.
                </p>
              </div>

              {/* 3 Executive Postures Switcher */}
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '4px', gap: '4px' }}>
                {[
                  { id: 'Guardião Firme' as CoachPosture, label: 'Guardião Firme', desc: 'Confronta autoengano e prazos fictícios' },
                  { id: 'Assistente Pragmático' as CoachPosture, label: 'Estrategista', desc: 'Foco em ROI e alavancagem' },
                  { id: 'Parceiro Empático' as CoachPosture, label: 'Empático Firme', desc: 'Valida sobrecarga e protege' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => onPostureChange(p.id)}
                    title={p.desc}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: coachPosture === p.id ? 600 : 400,
                      background: coachPosture === p.id ? 'var(--accent-champagne)' : 'transparent',
                      color: coachPosture === p.id ? 'var(--text-on-champagne)' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(16, 23, 19, 0.6)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Postura Ativa:</strong> <span style={{ color: 'var(--accent-champagne-hover)' }}>{coachPosture}</span> — {
                coachPosture === 'Guardião Firme'
                  ? 'Expõe premissas frágeis, recusa prazos fictícios e pergunta o que você está fingindo não ver.'
                  : coachPosture === 'Assistente Pragmático'
                  ? 'Analisa capacidade disponível vs custo de oportunidade e propõe trade-offs explícitos.'
                  : 'Acolhe a sobrecarga biológica com firmeza, impede autocobrança destrutiva e força o micro-passo.'
              }
            </div>
          </div>

          {/* Interactive Chat Console */}
          <div className="botanical-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {/* Messages Log */}
            <div 
              style={{ 
                maxHeight: '380px', 
                minHeight: '260px', 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                paddingRight: '0.4rem'
              }}
            >
              {chatMessages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      background: isUser ? 'var(--accent-champagne)' : 'rgba(16, 23, 19, 0.7)',
                      color: isUser ? 'var(--text-on-champagne)' : 'var(--text-main)',
                      padding: '0.75rem 1rem',
                      borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      border: isUser ? 'none' : '1px solid var(--border-subtle)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.25rem', opacity: 0.75 }}>
                      <strong>{isUser ? 'Lud' : `KAIROS (${msg.posture || coachPosture})`}</strong>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '0.86rem', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isAiLoading && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(16, 23, 19, 0.7)', padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  KAIROS está avaliando sua capacidade e formulando a intervenção...
                </div>
              )}
            </div>

            {/* Quick Context Prompts */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
              <button 
                className="subnav-pill" 
                onClick={() => onSendMessage('Estou me sentindo sobrecarregada hoje, me ajude a cortar 50% da agenda')}
              >
                ⚡ Cortar 50% por Sobrecarga
              </button>
              <button 
                className="subnav-pill" 
                onClick={() => onSendMessage('Por que estou adiando a troca do box do banheiro?')}
              >
                🧱 Desvendar Inércia da Casa
              </button>
              <button 
                className="subnav-pill" 
                onClick={() => onSendMessage('Como negociar o prazo do relatório financeiro com a diretoria sem parecer despreparada?')}
              >
                🛡️ Recusa Diplomática à Diretoria
              </button>
              <button 
                className="subnav-pill" 
                onClick={() => onSendMessage('Quero fazer meu ritual de encerramento do dia (Shutdown)')}
              >
                🌙 Ritual de Fechamento (Shutdown)
              </button>
            </div>

            {/* Input Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
                placeholder={`Consulte seu Sparring (${coachPosture})...`}
                style={{
                  flex: 1,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.95rem',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              />
              <button
                className="btn-champagne"
                onClick={handleSendChat}
                disabled={isAiLoading}
                style={{ padding: '0.65rem 1.1rem' }}
              >
                <Send size={15} />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: SOS ANTI-PROCRASTINAÇÃO & CRAPPY DRAFT TIMER
          ========================================================================= */}
      {subTab === 'procrastination' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="botanical-card-highlight">
            <span className="badge badge-amber" style={{ background: 'var(--accent-champagne)', color: 'var(--text-on-champagne)', fontWeight: 700 }}>
              DESCOMPRESSOR DE INÉRCIA
            </span>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.2rem 0 0.3rem 0' }}>
              Modo "Me Ajude a Começar Agora" (Start Me Up)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Procrastinação é regulação emocional e sobrecarga cognitiva, nunca preguiça moral. Investigamos a fricção e reduzimos o atrito em 60 segundos.
            </p>
          </div>

          {/* Select Demand & Diagnostic */}
          <div className="botanical-card">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
              1. Em qual demanda você está travada ou postergando?
            </label>
            <select
              value={selectedProcrastinationDemand}
              onChange={e => setSelectedProcrastinationDemand(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                marginBottom: '1.25rem'
              }}
            >
              {demands.map(d => (
                <option key={d.id} value={d.id} style={{ background: '#222B27', color: '#F1EDE4' }}>
                  {d.title} ({d.domain} • Adiado {d.postponementCount}x)
                </option>
              ))}
            </select>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              2. Diagnóstico Rápido: O que mais se aproxima do que você está sentindo?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
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
                    borderRadius: '8px',
                    background: procrastinationCause === item.id ? 'var(--accent-champagne-dim)' : 'var(--bg-secondary)',
                    border: `1px solid ${procrastinationCause === item.id ? 'var(--accent-champagne)' : 'var(--border-subtle)'}`,
                    color: 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{item.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </button>
              ))}
            </div>

            {/* AI Prescription Box */}
            <div style={{ background: 'rgba(210, 173, 120, 0.08)', border: '1px solid rgba(210, 173, 120, 0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-champagne)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} /> Prescrição da IA para Destravar:
              </span>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: '0.4rem 0 0.2rem 0', lineHeight: 1.45 }}>
                {procrastinationCause === 'vague' && 'Estratégia do Draft Zero: Não tente resolver o todo. Seu único objetivo agora é abrir o documento e digitar 3 palavras imperfeitas.'}
                {procrastinationCause === 'perfectionism' && 'Estratégia da Versão Provisória Tolerável: Um rascunho de 60% hoje vale 10 vezes mais do que uma obra-prima teórica na gaveta.'}
                {procrastinationCause === 'fatigue' && 'Diagnóstico Biológico: Seu cérebro está sem glicose. Forçar agora só gera retrabalho. Remarque para o bloco matinal e faça 20 min de caminhada.'}
                {procrastinationCause === 'friction' && 'Estratégia da Micro-Ação de 5 Minutos: Quebre o atrito físico inicial. Deixe as ferramentas prontas e execute apenas 300 segundos.'}
              </p>
            </div>

            {/* 5-Min Low Pressure Timer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Cronômetro de Descompressão (5 Minutos)
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: timerSeconds > 0 ? 'var(--accent-champagne-hover)' : 'var(--accent-success)' }}>
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-champagne"
                  onClick={() => setTimerActive(!timerActive)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  {timerActive ? <Pause size={15} /> : <Play size={15} />}
                  <span>{timerActive ? 'Pausar' : 'Iniciar 5 Min'}</span>
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => { setTimerActive(false); setTimerSeconds(300); }}
                  style={{ padding: '0.5rem 0.75rem' }}
                  title="Reiniciar timer"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* 4 Anti-Sabotage Tactics */}
          <div className="botanical-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Flame size={18} color="var(--accent-champagne)" />
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                Arsenal Anti-Sabotagem: Para Viciados em Adrenalina & Síndrome do Impostor
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
              {antiSabotageTactics.map(tactic => (
                <button
                  key={tactic.id}
                  onClick={() => onSelectTactic(tactic.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    textAlign: 'left',
                    background: activeTacticId === tactic.id ? 'var(--accent-champagne-dim)' : 'var(--bg-secondary)',
                    border: `1px solid ${activeTacticId === tactic.id ? 'var(--accent-champagne)' : 'var(--border-subtle)'}`,
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontWeight: activeTacticId === tactic.id ? 600 : 400,
                    cursor: 'pointer'
                  }}
                >
                  {tactic.title}
                </button>
              ))}
            </div>

            {selectedTactic && (
              <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-champagne-hover)', margin: '0 0 0.4rem 0' }}>
                  {selectedTactic.title} • {selectedTactic.subtitle}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.6rem 0', lineHeight: 1.45 }}>
                  {selectedTactic.neuroHack}
                </p>
                <div style={{ background: 'rgba(34, 43, 39, 0.6)', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                  <strong style={{ color: 'var(--accent-success)' }}>Micro-Ação Imediata:</strong> {selectedTactic.actionStep}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: RETOMADA SEM CULPA (SOFT LANDING)
          ========================================================================= */}
      {subTab === 'softLanding' && (
        <div className="botanical-card" style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ width: '3.8rem', height: '3.8rem', borderRadius: '50%', background: 'var(--accent-sage-dim)', border: '1px solid rgba(138, 167, 142, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--accent-success)' }}>
            <RotateCcw size={28} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Protocolo de Retomada sem Culpa ("Soft Landing")
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
            A vida aconteceu e você passou dias sem abrir o app? <strong>Tudo bem.</strong><br />
            Sem notificações vermelhas alarmistas. Sem sermão moralista. Apenas uma reconexão lúcida.
          </p>

          {!softLandingCleaned ? (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-champagne-hover)', marginBottom: '0.75rem' }}>
                A IA preparou uma repactuação em 3 passos para você:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-main)', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-success)" style={{ flexShrink: 0 }} />
                  <span><strong>Arquivar sem culpa:</strong> Tarefas antigas que perderam o momento foram desativadas sem julgamento.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-success)" style={{ flexShrink: 0 }} />
                  <span><strong>Projetos na Incubadora:</strong> Demandas abertas voltaram para a incubadora "Algum Dia" para desocupar a mente.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-success)" style={{ flexShrink: 0 }} />
                  <span><strong>Apenas 1 vitória hoje:</strong> Sugerimos focar exclusivamente na menor tarefa de 15 minutos para retomar o ritmo.</span>
                </li>
              </ul>

              <button
                className="btn-champagne"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem', padding: '0.75rem' }}
                onClick={() => setSoftLandingCleaned(true)}
              >
                🌿 Executar Limpeza e Reiniciar Leve
              </button>
            </div>
          ) : (
            <div style={{ background: 'rgba(44, 61, 51, 0.5)', border: '1px solid rgba(138, 167, 142, 0.4)', borderRadius: '10px', padding: '1.5rem', color: 'var(--text-main)' }}>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--accent-success)', marginBottom: '0.4rem' }}>
                ✨ Mesa Limpa e Energia Restaurada!
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Pendências foram reorganizadas. Sua agenda de hoje tem apenas 1 ação simples. Respire e siga no seu ritmo.
              </p>
              <button
                className="btn-champagne"
                style={{ marginTop: '1rem', fontSize: '0.85rem' }}
                onClick={() => { setSoftLandingCleaned(false); onNavigateToToday(); }}
              >
                Ir para o Cockpit de Hoje
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: MEMÓRIA TRANSPARENTE & SOBERANIA
          ========================================================================= */}
      {subTab === 'memory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="botanical-card-highlight">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-sage">SOBERANIA TOTAL DE DADOS</span>
                <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.2rem 0 0.3rem 0' }}>
                  Memória Auditável & Regras de Decisão
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Veja tudo o que a IA aprendeu sobre você. Você tem poder absoluto para apagar fatos, editar princípios ou ensinar novas regras.
                </p>
              </div>

              <button className="btn-champagne" onClick={() => setShowAddFact(true)}>
                <Plus size={16} />
                <span>Adicionar Princípio</span>
              </button>
            </div>
          </div>

          {/* Privacy & Boundary Declaration */}
          <div className="botanical-card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-success)', margin: '0 0 0.3rem 0' }}>
              🛡️ Fronteira Ética de Privacidade
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              O KAIROS OS opera prioritariamente em <strong>armazenamento local (offline-first)</strong> no seu dispositivo. Nenhum dado de áudio do WhatsApp, e-mail Hostinger ou segredo empresarial é vendido ou compartilhado com terceiros.
            </p>
          </div>

          {/* Facts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {memoryFacts.map(fact => (
              <div 
                key={fact.id}
                className="botanical-card"
                style={{ padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>{fact.category}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confiança: {fact.confidence}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                    "{fact.insight}"
                  </p>
                </div>

                <button
                  className="btn-ghost"
                  onClick={() => onDeleteMemoryFact(fact.id)}
                  style={{ color: '#D97D7D', padding: '0.35rem' }}
                  title="Esquecer este fato da memória"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Modal Adicionar Princípio */}
          {showAddFact && (
            <div className="modal-backdrop" onClick={() => setShowAddFact(false)}>
              <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '1rem' }}>
                  Ensinar Novo Princípio à IA
                </h3>

                <form onSubmit={handleCreateFactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Categoria
                    </label>
                    <select
                      value={newFactCategory}
                      onChange={e => setNewFactCategory(e.target.value as any)}
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.55rem', color: 'var(--text-main)' }}
                    >
                      <option value="Preferência">Preferência</option>
                      <option value="Padrão Observado">Padrão Observado</option>
                      <option value="Limite Biológico">Limite Biológico</option>
                      <option value="Valor">Valor</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Declaração ou Regra
                    </label>
                    <textarea
                      value={newFactStatement}
                      onChange={e => setNewFactStatement(e.target.value)}
                      placeholder='Ex: "Não aceito reuniões sem pauta antes das 11:30 da manhã."'
                      required
                      rows={3}
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.55rem', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowAddFact(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-champagne">
                      Salvar na Memória
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
