import React from 'react';
import { 
  Clock, 
  Target, 
  Flame, 
  ShieldAlert, 
  Zap, 
  RotateCcw, 
  Play, 
  Check, 
  ArrowRight, 
  Eye, 
  Download
} from 'lucide-react';
import type { Demand, Habit, BrainHack } from '../../types';
import { calendarService } from '../../services/calendarService';

interface TodayViewProps {
  demands: Demand[];
  habits: Habit[];
  onToggleDemand: (id: string) => void;
  onToggleHabit: (id: string) => void;
  onInspectDemand: (demand: Demand) => void;
  onStartCrappyDraft: (demandTitle: string) => void;
  onStartFocus: (demand: Demand) => void;
  onNavigateTab: (tab: any, subTab?: string) => void;
  neuroHack?: BrainHack;
  onNextNeuroHack?: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  demands,
  habits,
  onToggleDemand,
  onToggleHabit,
  onInspectDemand,
  onStartCrappyDraft,
  onStartFocus,
  onNavigateTab,
  neuroHack,
  onNextNeuroHack
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Today Demands
  const todayDemands = demands.filter(d => d.status === 'HOJE' || d.status === 'CONCLUÍDO');
  const theBigOne = todayDemands.find(d => d.status !== 'CONCLUÍDO') || todayDemands[0];
  const otherPriorities = todayDemands.filter(d => d.id !== theBigOne?.id);
  const completedCount = todayDemands.filter(d => d.status === 'CONCLUÍDO').length;

  // Today Habits
  const activeHabits = habits.filter(h => h.active);
  const habitsDoneTodayCount = activeHabits.filter(h => !!h.history[todayStr]).length;

  return (
    <div className="tab-pane active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Header KPIs Bar */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', 
          gap: '1rem' 
        }}
      >
        {/* KPI 1: The Big One & Prioridades */}
        <div className="botanical-card" style={{ padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Prioridades do Dia
            </span>
            <Target size={15} color="var(--accent-champagne)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--accent-champagne-hover)' }}>
              {completedCount}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              / {todayDemands.length} concluídas
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '0.6rem', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${todayDemands.length > 0 ? (completedCount / todayDemands.length) * 100 : 0}%`, 
                height: '100%', 
                background: 'var(--accent-champagne)',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
        </div>

        {/* KPI 2: Hábitos de Hoje */}
        <div className="botanical-card" style={{ padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Hábitos de Hoje
            </span>
            <Flame size={15} color="var(--accent-success)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--accent-success)' }}>
              {habitsDoneTodayCount}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              / {activeHabits.length} mantidos
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '0.6rem', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${activeHabits.length > 0 ? (habitsDoneTodayCount / activeHabits.length) * 100 : 0}%`, 
                height: '100%', 
                background: 'var(--accent-success)',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
        </div>

        {/* KPI 3: Foco Nobre & Capacidade */}
        <div className="botanical-card" style={{ padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Foco Nobre (Deep Work)
            </span>
            <Clock size={15} color="var(--accent-sage)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--accent-sage)' }}>
              2h45
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              alocadas no bloco matinal
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '0.6rem', overflow: 'hidden' }}>
            <div style={{ width: '78%', height: '100%', background: 'var(--accent-sage)' }} />
          </div>
        </div>

        {/* KPI 4: Proteção de Buffer */}
        <div className="botanical-card" style={{ padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Guardião de Buffer
            </span>
            <ShieldAlert size={15} color="var(--accent-success)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--accent-success)' }}>
              28%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              (1h30 intocada para imprevistos)
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '0.6rem', overflow: 'hidden' }}>
            <div style={{ width: '28%', height: '100%', background: 'var(--accent-success)' }} />
          </div>
        </div>
      </div>

      {/* 2. THE BIG ONE — O Marco Decisivo do Dia */}
      {theBigOne && (
        <section className="botanical-card-highlight">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span 
                  className="badge badge-amber"
                  style={{ 
                    background: 'var(--accent-champagne)', 
                    color: 'var(--text-on-champagne)', 
                    fontWeight: 700, 
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px'
                  }}
                >
                  THE BIG ONE • PRIORIDADE INEGOCIÁVEL
                </span>
                <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>{theBigOne.domain}</span>
                <span className="badge badge-sage" style={{ fontSize: '0.72rem' }}>{theBigOne.scheduledTime || '09:00 - 11:30'}</span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.3rem 0 0.5rem 0', lineHeight: 1.3 }}>
                {theBigOne.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className="btn-champagne"
                onClick={() => onStartFocus(theBigOne)}
                title="Iniciar sessão de foco imersivo no timer"
              >
                <Play size={14} fill="currentColor" />
                <span>Iniciar Foco</span>
              </button>
              <button
                className="btn-sage"
                onClick={() => onStartCrappyDraft(theBigOne.title)}
                title="Superar a inércia com o rascunho de 7 minutos"
              >
                <Zap size={14} />
                <span>Crappy Draft (7 min)</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => onToggleDemand(theBigOne.id)}
                title="Concluir demanda"
              >
                <Check size={15} />
                <span>{theBigOne.status === 'CONCLUÍDO' ? 'Reabrir' : 'Concluir'}</span>
              </button>
              <button
                className="btn-ghost"
                onClick={() => onInspectDemand(theBigOne)}
                title="Ver diagnóstico completo, DoD e Custo de Atraso"
              >
                <Eye size={15} />
              </button>
            </div>
          </div>

          {/* Micro-Ação Imediata & Diagnóstico Editorial */}
          <div 
            style={{ 
              background: 'rgba(16, 23, 19, 0.6)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '10px', 
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-champagne-hover)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Próxima Ação Física & Redutora de Inércia:
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 500 }}>
                {theBigOne.nextAction}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(54, 68, 60, 0.5)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Critério de Conclusão (DoD):</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>{theBigOne.definitionOfDone}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Custo de Atraso (Cost of Delay):</span>
                <p style={{ fontSize: '0.8rem', color: '#D97D7D', margin: '0.15rem 0 0 0' }}>{theBigOne.costOfDelay}</p>
              </div>
            </div>

            {theBigOne.aiDiagnosis && (
              <div style={{ background: 'rgba(210, 173, 120, 0.06)', borderRadius: '6px', padding: '0.6rem 0.8rem', borderLeft: '2px solid var(--accent-champagne)', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-champagne)', fontWeight: 600 }}>Diagnóstico Consultivo da IA:</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0', fontStyle: 'italic' }}>
                  "{theBigOne.aiDiagnosis}"
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Grid: Outras Prioridades + Checklist de Hábitos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Bloco A: Outras Prioridades do Dia */}
        <div className="botanical-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
              Prioridades Secundárias & Tarefas Rasas
            </h3>
            <button 
              className="btn-ghost" 
              onClick={() => onNavigateTab('planning', 'inbox')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
            >
              Ver Todas <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {otherPriorities.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Nenhuma outra tarefa alocada para hoje. Foco total em The Big One.
              </p>
            ) : (
              otherPriorities.map(demand => {
                const isDone = demand.status === 'CONCLUÍDO';
                return (
                  <div
                    key={demand.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: isDone ? 'rgba(16, 23, 19, 0.4)' : 'rgba(34, 43, 39, 0.7)',
                      border: '1px solid var(--border-subtle)',
                      opacity: isDone ? 0.6 : 1,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                      <button
                        onClick={() => onToggleDemand(demand.id)}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${isDone ? 'var(--accent-success)' : 'var(--border-subtle)'}`,
                          background: isDone ? 'var(--accent-success)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {isDone && <Check size={12} color="#101713" strokeWidth={3} />}
                      </button>
                      <div style={{ minWidth: 0 }}>
                        <span 
                          style={{ 
                            fontSize: '0.85rem', 
                            color: 'var(--text-main)', 
                            textDecoration: isDone ? 'line-through' : 'none',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {demand.title}
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.15rem' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{demand.estimatedMinutes}m</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--accent-champagne)' }}>• {demand.scheduledTime || 'Tarde'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-ghost"
                      onClick={() => onInspectDemand(demand)}
                      style={{ padding: '0.25rem', color: 'var(--text-muted)' }}
                      title="Ver detalhes da demanda"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bloco B: Checklist Rápido de Hábitos de Hoje */}
        <div className="botanical-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flame size={16} color="var(--accent-success)" />
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                Hábitos de Hoje
              </h3>
            </div>
            <button 
              className="btn-ghost" 
              onClick={() => onNavigateTab('habits')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
            >
              Ver Heatmaps <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {activeHabits.slice(0, 5).map(habit => {
              const isChecked = !!habit.history[todayStr];
              return (
                <div
                  key={habit.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: isChecked ? 'rgba(44, 61, 51, 0.35)' : 'rgba(34, 43, 39, 0.7)',
                    border: `1px solid ${isChecked ? 'rgba(138, 167, 142, 0.3)' : 'var(--border-subtle)'}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                    <button
                      onClick={() => onToggleHabit(habit.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        border: `2px solid ${isChecked ? 'var(--accent-success)' : 'var(--border-subtle)'}`,
                        background: isChecked ? 'var(--accent-success)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                      title="Marcar / desmarcar hábito de hoje"
                    >
                      {isChecked && <Check size={13} color="#101713" strokeWidth={3} />}
                    </button>
                    <div style={{ minWidth: 0 }}>
                      <span 
                        style={{ 
                          fontSize: '0.85rem', 
                          color: isChecked ? 'var(--accent-success)' : 'var(--text-main)',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {habit.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {habit.domain} • {habit.frequency}
                      </span>
                    </div>
                  </div>

                  <div className="streak-pill" style={{ flexShrink: 0 }}>
                    <Flame size={12} color="var(--accent-champagne)" />
                    <span>{habit.streak}d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Timeblocking & Proteção Biológica de Capacidade */}
      <section className="botanical-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
              Agenda do Dia & Proteção de Buffer
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              Limite biológico de 3h30 de alta demanda cognitiva respeitado.
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => calendarService.exportToICS(todayDemands)}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            title="Exportar blocos para Google Agenda, Outlook ou Apple Calendar"
          >
            <Download size={14} />
            <span>Exportar .ics</span>
          </button>
        </div>

        {/* Visual Allocation Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--accent-champagne-hover)' }}>Deep Work: 2h45 (46%)</span>
            <span style={{ color: 'var(--text-secondary)' }}>Shallow Work: 1h45 (26%)</span>
            <span style={{ color: 'var(--accent-success)' }}>Buffer Intocado: 1h30 (28%)</span>
          </div>
          <div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden', background: '#101713' }}>
            <div style={{ width: '46%', background: 'var(--accent-champagne)' }} title="Deep Work" />
            <div style={{ width: '26%', background: '#4E594C' }} title="Shallow Work" />
            <div style={{ width: '28%', background: 'var(--accent-success)' }} title="Buffer Protegido" />
          </div>
        </div>

        {/* Timeline Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(44, 61, 51, 0.4)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-champagne)', fontWeight: 600 }}>09:00 - 11:45 • Bloco Nobre</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500, margin: '0.2rem 0 0 0' }}>The Big One (Foco Estratégico)</p>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Sem notificações ou reuniões</span>
          </div>

          <div style={{ background: 'rgba(34, 43, 39, 0.5)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>14:00 - 15:45 • Bloco de Coordenação</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500, margin: '0.2rem 0 0 0' }}>Alinhamento com Marcos & Lívia</p>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Delegação nível 3 e 4</span>
          </div>

          <div style={{ background: 'rgba(169, 198, 155, 0.1)', border: '1px solid rgba(169, 198, 155, 0.3)', borderRadius: '8px', padding: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-success)', fontWeight: 600 }}>16:00 - 17:30 • Buffer Protetor</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500, margin: '0.2rem 0 0 0' }}>Espaço Livre para Imprevistos</p>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Evita transbordamento para a noite</span>
          </div>
        </div>
      </section>

      {/* 5. Neuro-Hack Diário & Acessos Rápidos de Resgate */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Neuro-hack */}
        {neuroHack && (
          <div className="botanical-card" style={{ borderLeft: '3px solid var(--accent-champagne)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={15} color="var(--accent-champagne)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-champagne)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Neurociência da Produtividade
                </span>
              </div>
              {onNextNeuroHack && (
                <button 
                  onClick={onNextNeuroHack} 
                  className="btn-ghost" 
                  style={{ fontSize: '0.72rem', padding: '0.15rem 0.4rem' }}
                  title="Carregar outro neuro-hack"
                >
                  Próximo <RotateCcw size={11} />
                </button>
              )}
            </div>
            <h4 style={{ fontSize: '0.98rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>
              {neuroHack.category}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.6rem 0', lineHeight: 1.45 }}>
              "{neuroHack.quote}"
            </p>
            <div style={{ background: 'rgba(16, 23, 19, 0.4)', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 600 }}>Micro-Ação de 30s:</span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.1rem 0 0 0' }}>{neuroHack.actionPrompt}</p>
            </div>
          </div>
        )}

        {/* Resgate Rápido: SOS & Retomada Sem Culpa */}
        <div className="botanical-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0 0 0.3rem 0' }}>
              Resgate Imediato & Apoio Comportamental
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.8rem 0' }}>
              Travou em uma demanda ou acumulou tarefas nos últimos dias? Recupere o controle em 1 clique.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              className="btn-sage"
              onClick={() => onNavigateTab('ai', 'procrastination')}
              style={{ flex: 1, minWidth: '150px', justifyContent: 'center' }}
            >
              <Zap size={14} />
              <span>🚨 Me Ajude a Começar</span>
            </button>
            <button
              className="btn-secondary"
              onClick={() => onNavigateTab('ai', 'softLanding')}
              style={{ flex: 1, minWidth: '150px', justifyContent: 'center' }}
            >
              <RotateCcw size={14} />
              <span>🔄 Retomar sem Culpa</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
