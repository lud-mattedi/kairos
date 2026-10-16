import React, { useState } from 'react';
import { 
  Inbox, 
  Calendar, 
  Users, 
  Sparkles, 
  Plus, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Download,
  Eye,
  Layers
} from 'lucide-react';
import type { Demand, DelegationItem, LifeDomain } from '../../types';
import { calendarService } from '../../services/calendarService';

export type PlanningSubTab = 'inbox' | 'schedule' | 'leadership' | 'projects' | 'showcase';

interface PlanningViewProps {
  demands: Demand[];
  delegations: DelegationItem[];
  initialSubTab?: PlanningSubTab;
  onOpenNewDemandModal: () => void;
  onInspectDemand: (demand: Demand) => void;
}

export const PlanningView: React.FC<PlanningViewProps> = ({
  demands,
  delegations,
  initialSubTab = 'inbox',
  onOpenNewDemandModal,
  onInspectDemand
}) => {
  const [subTab, setSubTab] = useState<PlanningSubTab>(initialSubTab);
  const [inboxDomainFilter, setInboxDomainFilter] = useState<LifeDomain | 'Todos'>('Todos');
  const [eisenhowerFilter, setEisenhowerFilter] = useState<string>('Todos');

  // Saying No Generator state
  const [recipientType, setRecipientType] = useState<'boss' | 'client' | 'peer' | 'friend'>('boss');
  const [requestContext, setRequestContext] = useState<'extraTask' | 'meeting' | 'tightDeadline'>('extraTask');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const domains: (LifeDomain | 'Todos')[] = ['Todos', 'Trabalho', 'Liderança', 'Desenvolvimento', 'Casa/Vida'];

  const filteredDemands = demands.filter(d => {
    const matchDomain = inboxDomainFilter === 'Todos' || d.domain === inboxDomainFilter;
    const matchEisenhower = eisenhowerFilter === 'Todos' || (d.eisenhowerQuadrant ? d.eisenhowerQuadrant.includes(eisenhowerFilter) : false);
    return matchDomain && matchEisenhower;
  });

  const projects = demands.filter(d => d.category === 'PROJECT');
  const somedays = demands.filter(d => d.deadlineType === 'Sem Prazo Fixo' || d.category === 'REFERENCE');

  return (
    <div className="tab-pane active" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Sub-Navigation Pills */}
      <div className="subnav-pills">
        <button
          onClick={() => setSubTab('inbox')}
          className={`subnav-pill ${subTab === 'inbox' ? 'active' : ''}`}
        >
          <Inbox size={15} />
          <span>Caixa de Entrada & Triagem ({demands.length})</span>
        </button>

        <button
          onClick={() => setSubTab('schedule')}
          className={`subnav-pill ${subTab === 'schedule' ? 'active' : ''}`}
        >
          <Calendar size={15} />
          <span>Agenda & Timeblocking</span>
        </button>

        <button
          onClick={() => setSubTab('leadership')}
          className={`subnav-pill ${subTab === 'leadership' ? 'active' : ''}`}
        >
          <Users size={15} />
          <span>Liderança, Dizer Não & Delegação</span>
        </button>

        <button
          onClick={() => setSubTab('projects')}
          className={`subnav-pill ${subTab === 'projects' ? 'active' : ''}`}
        >
          <Layers size={15} />
          <span>Projetos & Incubadora</span>
        </button>

        <button
          onClick={() => setSubTab('showcase')}
          className={`subnav-pill ${subTab === 'showcase' ? 'active' : ''}`}
        >
          <Sparkles size={15} />
          <span>5 Casos do Briefing</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: CAIXA DE ENTRADA & TRIAGEM GTD
          ========================================================================= */}
      {subTab === 'inbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="botanical-card-highlight">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-amber" style={{ background: 'var(--accent-champagne)', color: 'var(--text-on-champagne)', fontWeight: 700 }}>
                  TRIAGEM CONSULTIVA
                </span>
                <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.25rem 0 0.35rem 0' }}>
                  Caixa de Entrada & Classificação Progressiva
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Nem toda ideia é uma obrigação imediata. A IA traduz angústias em Próximas Ações Físicas e filtra ruído de ansiedade.
                </p>
              </div>

              <button className="btn-champagne" onClick={onOpenNewDemandModal}>
                <Plus size={16} />
                <span>Nova Demanda</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Domínio:</span>
              {domains.map(dom => (
                <button
                  key={dom}
                  onClick={() => setInboxDomainFilter(dom)}
                  className={`badge ${inboxDomainFilter === dom ? 'badge-amber' : 'badge-gray'}`}
                  style={{ cursor: 'pointer', padding: '0.35rem 0.7rem' }}
                >
                  {dom}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Matriz:</span>
              {['Todos', 'Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                <button
                  key={q}
                  onClick={() => setEisenhowerFilter(q)}
                  className={`badge ${eisenhowerFilter === q ? 'badge-sage' : 'badge-gray'}`}
                  style={{ cursor: 'pointer', padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Demands List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredDemands.map(item => (
              <div key={item.id} className="botanical-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-amber">{item.category}</span>
                      <span className="badge badge-gray">{item.domain}</span>
                      <span className="badge badge-sage">{item.eisenhowerQuadrant}</span>
                      {item.postponementCount > 1 && (
                        <span className="badge badge-rose" title={`Adiado ${item.postponementCount} vezes`}>
                          ⚠️ Adiado {item.postponementCount}x
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                      {item.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                      onClick={() => onInspectDemand(item)}
                    >
                      <Eye size={13} />
                      <span>Diagnóstico Completo</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.65rem 0.85rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-sage)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Próxima Ação Física Concreta (GTD)
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
                      {item.nextAction}
                    </p>
                  </div>

                  <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.65rem 0.85rem', borderRadius: '6px', borderLeft: '3px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Critério de Conclusão (Done)
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                      {item.definitionOfDone}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(54, 68, 60, 0.5)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Custo do Atraso: <em style={{ color: '#D97D7D' }}>{item.costOfDelay}</em></span>
                  <span>Prazo: <strong style={{ color: 'var(--text-main)' }}>{item.deadlineType}</strong> ({item.estimatedMinutes}m)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: AGENDA & TIMEBLOCKING
          ========================================================================= */}
      {subTab === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="botanical-card-highlight">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-sage">PROTEÇÃO DE CAPACIDADE</span>
                <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.25rem 0 0.35rem 0' }}>
                  Agenda Executiva & Timeblocking Biológico
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Respeito estrito ao limite de 3h30 de foco profundo e proteção de 28% de buffer para emergências.
                </p>
              </div>

              <button
                className="btn-champagne"
                onClick={() => calendarService.exportToICS(demands)}
              >
                <Download size={15} />
                <span>Exportar Calendário (.ics)</span>
              </button>
            </div>
          </div>

          {/* Allocation Bar */}
          <div className="botanical-card">
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '0.6rem' }}>
              Distribuição de Capacidade do Dia (6 horas totais)
            </h3>
            <div style={{ height: '12px', display: 'flex', borderRadius: '6px', overflow: 'hidden', background: '#101713', marginBottom: '0.6rem' }}>
              <div style={{ width: '46%', background: 'var(--accent-champagne)' }} title="Deep Work: 2h45 (46%)" />
              <div style={{ width: '26%', background: 'var(--accent-sage)' }} title="Shallow Work: 1h45 (26%)" />
              <div style={{ width: '28%', background: 'var(--accent-success)' }} title="Buffer Protegido: 1h30 (28%)" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent-champagne-hover)' }}>● Deep Work: 2h45</span>
              <span style={{ color: 'var(--accent-sage)' }}>● Shallow Work: 1h45</span>
              <span style={{ color: 'var(--accent-success)' }}>● Buffer Sagrado: 1h30 (28%)</span>
            </div>
          </div>

          {/* Day Timeblocks Detail */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="botanical-card" style={{ borderLeft: '4px solid var(--accent-champagne)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-champagne)', fontWeight: 700 }}>BLOCO NOBRE MATINAL • 09:00 - 11:45</span>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '0.3rem 0' }}>The Big One (Foco Sem Interrupções)</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Janela biológica de pico de dopamina e serotonina. Zero e-mails ou mensagens antes das 11:45.
              </p>
            </div>

            <div className="botanical-card" style={{ borderLeft: '4px solid var(--accent-sage)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-sage)', fontWeight: 700 }}>BLOCO DE COORDENAÇÃO • 14:00 - 15:45</span>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '0.3rem 0' }}>Reuniões Cirúrgicas & Liderança</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Alinhamento com Lívia e Marcos em autonomia nível 3. Desbloqueio de gargalos da equipe.
              </p>
            </div>

            <div className="botanical-card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-success)', fontWeight: 700 }}>BUFFER PROTETOR • 16:00 - 17:30</span>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '0.3rem 0' }}>Espaço Livre para Imprevistos</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Se nada explodir, usado para shutdown calmo, leitura estratégica ou encerramento às 18:30 sem culpa.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: LIDERANÇA, DIZER NÃO & DELEGAÇÃO
          ========================================================================= */}
      {subTab === 'leadership' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Saying No Studio */}
          <div className="botanical-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.15rem' }}>
              <div style={{ background: 'rgba(217, 125, 125, 0.15)', padding: '0.5rem', borderRadius: '6px', color: '#D97D7D' }}>
                <ShieldAlert size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                  Gerador de Recusas & Negociações
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  Diga "não" preservando relacionamentos e autoridade executiva.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Interlocutor:</label>
                <select
                  value={recipientType}
                  onChange={e => setRecipientType(e.target.value as any)}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.45rem', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.8rem', marginTop: '0.2rem' }}
                >
                  <option value="boss">Líder / Diretoria</option>
                  <option value="client">Cliente Externo</option>
                  <option value="peer">Colega de Outra Área</option>
                  <option value="friend">Amigo / Família</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tipo de Demanda:</label>
                <select
                  value={requestContext}
                  onChange={e => setRequestContext(e.target.value as any)}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.45rem', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.8rem', marginTop: '0.2rem' }}
                >
                  <option value="extraTask">Tarefa Nova Fora do Escopo</option>
                  <option value="meeting">Reunião sem Pauta Clara</option>
                  <option value="tightDeadline">Prazo Irrealista</option>
                </select>
              </div>
            </div>

            {/* 3 Copyable Templates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-champagne-hover)', fontWeight: 700 }}>Opção 1: O Não Claro & Elegante</span>
                  <button
                    className="btn-ghost"
                    onClick={() => copyToClipboard(
                      recipientType === 'boss'
                        ? 'Obrigado por trazer isso. No momento estou 100% alocada na entrega estratégica até sexta. Para garantir o padrão de qualidade, não posso assumir essa nova frente agora.'
                        : 'Agradeço o convite! Minha capacidade desta semana está integralmente alocada nos compromissos prioritários e não vou conseguir contribuir com a atenção necessária.',
                      't1'
                    )}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                  >
                    {copiedKey === 't1' ? <Check size={12} color="var(--accent-success)" /> : <Copy size={12} />}
                    <span>Copiar</span>
                  </button>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                  {recipientType === 'boss'
                    ? '"Obrigado por trazer isso. No momento estou 100% alocada na entrega estratégica até sexta. Para garantir o padrão de qualidade, não posso assumir essa nova frente agora."'
                    : '"Agradeço o convite! Minha capacidade desta semana está integralmente alocada nos compromissos prioritários e não vou conseguir contribuir com a atenção necessária."'}
                </p>
              </div>

              <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-champagne)', fontWeight: 700 }}>Opção 2: O Sim Condicional (Trade-off)</span>
                  <button
                    className="btn-ghost"
                    onClick={() => copyToClipboard(
                      'Consigo assumir isso sim, desde que adiemos a entrega do relatório da filial para a próxima semana. Faz sentido essa troca para você?',
                      't2'
                    )}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                  >
                    {copiedKey === 't2' ? <Check size={12} color="var(--accent-success)" /> : <Copy size={12} />}
                    <span>Copiar</span>
                  </button>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                  "Consigo assumir isso sim, desde que adiemos a entrega do relatório da filial para a próxima semana. Faz sentido essa troca para você?"
                </p>
              </div>

              <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-success)', fontWeight: 700 }}>Opção 3: Delegação com Apoio Cirúrgico</span>
                  <button
                    className="btn-ghost"
                    onClick={() => copyToClipboard(
                      'Não tenho margem para conduzir a execução direta, mas posso orientar a Lívia para estruturar o rascunho e eu reviso os pontos críticos em 15 minutos na quinta.',
                      't3'
                    )}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                  >
                    {copiedKey === 't3' ? <Check size={12} color="var(--accent-success)" /> : <Copy size={12} />}
                    <span>Copiar</span>
                  </button>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                  "Não tenho margem para conduzir a execução direta, mas posso orientar a Lívia para estruturar o rascunho e eu reviso os pontos críticos em 15 minutos na quinta."
                </p>
              </div>
            </div>
          </div>

          {/* Delegation Manager */}
          <div className="botanical-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.15rem' }}>
              <div style={{ background: 'rgba(138, 167, 142, 0.18)', padding: '0.5rem', borderRadius: '6px', color: 'var(--accent-success)' }}>
                <Users size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                  Acompanhamento de Delegação Lúcida
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  Autonomia de 5 níveis (Michael Hyatt) com perguntas de apoio.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {delegations.map(del => (
                <div key={del.id} style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="badge badge-sage">{del.assignee}</span>
                    <span className="badge badge-amber">Autonomia {del.autonomyLevel.split(' ')[0]}</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: '0.2rem 0' }}>{del.taskTitle}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0.5rem 0' }}>
                    <strong>Done:</strong> {del.definitionOfDone}
                  </p>
                  <div style={{ background: 'rgba(34, 43, 39, 0.6)', padding: '0.55rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--accent-champagne-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>"{del.supportPrompt}"</span>
                    <button
                      className="btn-ghost"
                      onClick={() => copyToClipboard(del.supportPrompt, del.id)}
                      style={{ padding: '0.15rem 0.35rem' }}
                    >
                      {copiedKey === del.id ? <Check size={12} color="var(--accent-success)" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: PROJETOS & INCUBADORA
          ========================================================================= */}
      {subTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="botanical-card-highlight">
            <span className="badge badge-amber" style={{ background: 'var(--accent-champagne)', color: 'var(--text-on-champagne)', fontWeight: 700 }}>
              DESDOBRAMENTO ESTRATÉGICO
            </span>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.25rem 0 0.35rem 0' }}>
              Projetos Multi-Passos & Incubadora de Ideias
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Projetos exigem mais de uma ação para serem concluídos. Não os coloque na lista de hoje como se fossem tarefas de 15 minutos.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <div className="botanical-card">
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--accent-champagne-hover)', marginBottom: '0.75rem' }}>
                Projetos Ativos ({projects.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {projects.map(p => (
                  <div key={p.id} style={{ background: 'rgba(16, 23, 19, 0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{p.title}</span>
                      <span className="badge badge-gray">{p.domain}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                      Próxima ação: {p.nextAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="botanical-card">
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--accent-success)', marginBottom: '0.75rem' }}>
                Incubadora "Algum Dia / Talvez" ({somedays.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {somedays.length === 0 ? (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Nenhuma ideia represada na incubadora.
                  </p>
                ) : (
                  somedays.map(s => (
                    <div key={s.id} style={{ background: 'rgba(16, 23, 19, 0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{s.title}</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                        Sem prazo iminente • Revisão semanal recomendada
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 5: DEMONSTRAÇÕES DO BRIEFING (OS 5 CASOS EMBLEMÁTICOS)
          ========================================================================= */}
      {subTab === 'showcase' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="botanical-card-highlight">
            <span className="badge badge-amber" style={{ background: 'var(--accent-champagne)', color: 'var(--text-on-champagne)', fontWeight: 700 }}>
              ESTUDO DE CASO PRÁTICO DO BRIEFING
            </span>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0.25rem 0 0.35rem 0' }}>
              Demonstração Prática com as 5 Demandas Reais
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Veja exatamente como o KAIROS OS analisa, questiona, desdobra em ações físicas e aloca cada uma das 5 demandas do seu briefing.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {demands.slice(0, 5).map((item, index) => (
              <div key={item.id} className="botanical-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-champagne)', color: 'var(--text-on-champagne)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <span className="badge badge-amber">{item.category}</span>
                        <span className="badge badge-gray">{item.domain}</span>
                        <span className="badge badge-sage">{item.eisenhowerQuadrant}</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <span className="badge badge-gray">{item.estimatedMinutes} min estimativa</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-champagne)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-champagne-hover)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <BrainCircuit size={12} /> Pergunta Cirúrgica da IA
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontStyle: 'italic', margin: '0.2rem 0 0 0' }}>
                      "{item.surgicalQuestion}"
                    </p>
                  </div>

                  <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-sage)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Zap size={12} /> Próxima Ação Física Concreta (GTD)
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500, margin: '0.2rem 0 0 0' }}>
                      {item.nextAction}
                    </p>
                  </div>

                  <div style={{ background: 'rgba(16, 23, 19, 0.5)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={12} /> Critério Inequívoco de Conclusão (Done)
                    </span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                      {item.definitionOfDone}
                    </p>
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 23, 19, 0.7)', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--accent-champagne-hover)' }}>Diagnóstico Comportamental:</strong> {item.aiDiagnosis}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
