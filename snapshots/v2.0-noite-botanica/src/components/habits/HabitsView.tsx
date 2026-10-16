import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Check, 
  Pause, 
  Play, 
  Trash2, 
  X
} from 'lucide-react';
import type { Habit, LifeDomain } from '../../types';

interface HabitsViewProps {
  habits: Habit[];
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onToggleHabitActive: (habitId: string) => void;
  onCreateHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'history' | 'createdAt'>) => void;
  onDeleteHabit?: (habitId: string) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onToggleHabitDay,
  onToggleHabitActive,
  onCreateHabit,
  onDeleteHabit
}) => {
  const [selectedDomain, setSelectedDomain] = useState<LifeDomain | 'Todos'>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState<LifeDomain>('Trabalho');
  const [newFrequency, setNewFrequency] = useState<'Diário' | 'Dias Úteis' | 'Semanal' | '3x por semana'>('Dias Úteis');
  const [newIdentity, setNewIdentity] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Generate last 14 days dates array
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });

  const domains: (LifeDomain | 'Todos')[] = ['Todos', 'Trabalho', 'Saúde', 'Liderança', 'Desenvolvimento', 'Casa/Vida'];

  const filteredHabits = habits.filter(h => {
    if (selectedDomain === 'Todos') return true;
    return h.domain === selectedDomain;
  });

  // Calculate consistency level for a day (0 to 4)
  const getDayIntensity = (dateStr: string): number => {
    const active = habits.filter(h => h.active);
    if (active.length === 0) return 0;
    const completedCount = active.filter(h => !!h.history[dateStr]).length;
    const ratio = completedCount / active.length;
    if (ratio === 0) return 0;
    if (ratio <= 0.3) return 1;
    if (ratio <= 0.6) return 2;
    if (ratio <= 0.85) return 3;
    return 4;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateHabit({
      title: newTitle.trim(),
      domain: newDomain,
      frequency: newFrequency,
      targetDaysPerWeek: newFrequency === 'Diário' ? 7 : newFrequency === 'Dias Úteis' ? 5 : 3,
      active: true,
      identityAnchor: newIdentity.trim() || undefined
    });
    setNewTitle('');
    setNewIdentity('');
    setShowAddModal(false);
  };

  return (
    <div className="tab-pane active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="botanical-card-highlight">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-amber" style={{ background: 'var(--accent-champagne)', color: 'var(--text-on-champagne)', fontWeight: 700 }}>
                ARQUITETURA DE HÁBITOS
              </span>
              <span className="badge badge-sage">Constância Sem Culpa</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.2rem 0 0.4rem 0' }}>
              Consistência & Identidade Sustentável
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: 0, lineHeight: 1.45 }}>
              Hábitos não são tarefas para sobrecarregar sua lista. São âncoras de identidade para proteger sua energia e liderança a longo prazo.
            </p>
          </div>

          <button 
            className="btn-champagne"
            onClick={() => setShowAddModal(true)}
            style={{ padding: '0.55rem 1.1rem' }}
          >
            <Plus size={16} />
            <span>Novo Hábito</span>
          </button>
        </div>

        {/* Global 14-Day Heatmap Strip */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(54, 68, 60, 0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Calor de Consistência dos Últimos 14 Dias:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>Menos</span>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--habit-l1)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--habit-l2)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--habit-l3)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--habit-l4)' }} />
              <span>Mais</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: '6px' }}>
            {last14Days.map((d) => {
              const intensity = getDayIntensity(d);
              const isToday = d === todayStr;
              const dateObj = new Date(d + 'T12:00:00');
              const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'narrow' });
              const dayNum = dateObj.getDate();

              let bg = 'rgba(54, 68, 60, 0.25)';
              if (intensity === 1) bg = 'var(--habit-l1)';
              if (intensity === 2) bg = 'var(--habit-l2)';
              if (intensity === 3) bg = 'var(--habit-l3)';
              if (intensity === 4) bg = 'var(--habit-l4)';

              return (
                <div 
                  key={d} 
                  title={`${d} (${dayName}): Nível ${intensity} de consistência`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <div 
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '4px',
                      background: bg,
                      border: isToday ? '1px solid var(--accent-champagne)' : 'none',
                      boxShadow: intensity === 4 ? '0 0 6px rgba(182, 200, 162, 0.4)' : 'none',
                      transition: 'transform 0.15s ease'
                    }}
                  />
                  <span style={{ fontSize: '0.62rem', color: isToday ? 'var(--accent-champagne)' : 'var(--text-muted)', fontWeight: isToday ? 700 : 400 }}>
                    {dayNum}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        {domains.map(dom => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`subnav-pill ${selectedDomain === dom ? 'active' : ''}`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredHabits.map(habit => {
          const isDoneToday = !!habit.history[todayStr];
          return (
            <div 
              key={habit.id}
              className="botanical-card"
              style={{
                opacity: habit.active ? 1 : 0.65,
                borderLeft: habit.active ? '3px solid var(--accent-sage)' : '3px solid var(--border-subtle)',
                padding: '1.1rem 1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
                  {/* Today Toggle Button */}
                  <button
                    onClick={() => onToggleHabitDay(habit.id, todayStr)}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      border: `2px solid ${isDoneToday ? 'var(--accent-success)' : 'var(--border-subtle)'}`,
                      background: isDoneToday ? 'var(--accent-success)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}
                    title={isDoneToday ? 'Hábito concluído hoje! Clique para desmarcar' : 'Clique para marcar como feito hoje'}
                  >
                    {isDoneToday && <Check size={16} color="#101713" strokeWidth={3} />}
                  </button>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                        {habit.title}
                      </h3>
                      <span className="badge badge-gray" style={{ fontSize: '0.68rem' }}>{habit.domain}</span>
                      <span className="badge badge-sage" style={{ fontSize: '0.68rem' }}>{habit.frequency}</span>
                      {!habit.active && (
                        <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>Pausado sem culpa</span>
                      )}
                    </div>

                    {habit.identityAnchor && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--accent-champagne-hover)', margin: '0.3rem 0 0 0', fontStyle: 'italic' }}>
                        "{habit.identityAnchor}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Streaks & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="streak-pill" title={`Sequência atual: ${habit.streak} dias consecutivas`}>
                    <Flame size={13} color="var(--accent-champagne)" />
                    <span>{habit.streak} dias</span>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} title="Melhor sequência histórica">
                    Recorde: {habit.bestStreak}d
                  </span>

                  <button
                    className="btn-ghost"
                    onClick={() => onToggleHabitActive(habit.id)}
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                    title={habit.active ? 'Pausar hábito sem penalidade de culpa' : 'Retomar hábito'}
                  >
                    {habit.active ? <Pause size={13} /> : <Play size={13} />}
                    <span>{habit.active ? 'Pausar' : 'Retomar'}</span>
                  </button>

                  {onDeleteHabit && (
                    <button
                      className="btn-ghost"
                      onClick={() => onDeleteHabit(habit.id)}
                      style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
                      title="Excluir hábito"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Individual 14-day Mini History Bar */}
              <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(54, 68, 60, 0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginRight: '0.4rem', width: '50px' }}>Histórico:</span>
                {last14Days.map(dateStr => {
                  const done = !!habit.history[dateStr];
                  const isToday = dateStr === todayStr;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => onToggleHabitDay(habit.id, dateStr)}
                      title={`${dateStr}: ${done ? 'Concluído' : 'Não registrado'}. Clique para alternar.`}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '3px',
                        background: done ? 'var(--habit-l3)' : 'rgba(54, 68, 60, 0.25)',
                        border: isToday ? '1px solid var(--accent-champagne)' : 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Adicionar Novo Hábito */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                Construir Novo Hábito
              </h3>
              <button className="btn-ghost" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Nome do Hábito (Claro e Específico)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Leitura Estratégica de 20 min sem celular"
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Domínio de Vida
                  </label>
                  <select
                    value={newDomain}
                    onChange={e => setNewDomain(e.target.value as LifeDomain)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Trabalho">Trabalho</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Liderança">Liderança</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Casa/Vida">Casa/Vida</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Frequência Alvo
                  </label>
                  <select
                    value={newFrequency}
                    onChange={e => setNewFrequency(e.target.value as any)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Dias Úteis">Dias Úteis (5x/sem)</option>
                    <option value="Diário">Diário (7x/sem)</option>
                    <option value="3x por semana">3x por semana</option>
                    <option value="Semanal">Semanal (1x/sem)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Âncora de Identidade (Psicologia de Hábitos)
                </label>
                <input
                  type="text"
                  value={newIdentity}
                  onChange={e => setNewIdentity(e.target.value)}
                  placeholder='Ex: "Eu sou uma executiva que protege seu foco antes de atender ao mundo."'
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-champagne"
                >
                  Criar Hábito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
