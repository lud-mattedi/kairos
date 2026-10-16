import React from 'react';
import { 
  X, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  Play, 
  Check 
} from 'lucide-react';
import type { Demand } from '../../types';

interface DemandDetailModalProps {
  demand: Demand | null;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onStartFocus: (demand: Demand) => void;
  onStartCrappyDraft: (title: string) => void;
}

export const DemandDetailModal: React.FC<DemandDetailModalProps> = ({
  demand,
  onClose,
  onToggleStatus,
  onStartFocus,
  onStartCrappyDraft
}) => {
  if (!demand) return null;

  const isDone = demand.status === 'CONCLUÍDO';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="badge badge-amber">{demand.category}</span>
              <span className="badge badge-gray">{demand.domain}</span>
              <span className="badge badge-sage">{demand.eisenhowerQuadrant}</span>
              {demand.postponementCount > 0 && (
                <span className="badge badge-rose">Adiado {demand.postponementCount}x</span>
              )}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
              {demand.title}
            </h2>
          </div>

          <button className="btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Detailed Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          
          {/* Pergunta Cirúrgica */}
          {demand.surgicalQuestion && (
            <div style={{ background: 'rgba(210, 173, 120, 0.08)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-champagne)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-champagne)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <BrainCircuit size={13} /> Pergunta Cirúrgica da IA:
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', margin: '0.25rem 0 0 0' }}>
                "{demand.surgicalQuestion}"
              </p>
            </div>
          )}

          {/* Próxima Ação Física Concreta */}
          <div style={{ background: 'rgba(16, 23, 19, 0.6)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-sage)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Zap size={13} /> Próxima Ação Física Concreta (GTD):
            </span>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 500, margin: '0.25rem 0 0 0' }}>
              {demand.nextAction}
            </p>
          </div>

          {/* Critério de Conclusão (Done) */}
          <div style={{ background: 'rgba(16, 23, 19, 0.6)', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} /> Critério Inequívoco de Conclusão (Definition of Done):
            </span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              {demand.definitionOfDone}
            </p>
          </div>

          {/* Custo de Atraso & Estimativa */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(16, 23, 19, 0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: '#D97D7D', fontWeight: 600 }}>Custo de Atraso:</span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                {demand.costOfDelay}
              </p>
            </div>

            <div style={{ background: 'rgba(16, 23, 19, 0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tempo & Horário:</span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
                {demand.estimatedMinutes} min • {demand.scheduledTime || 'A definir'}
              </p>
            </div>
          </div>

          {/* Diagnóstico da IA */}
          {demand.aiDiagnosis && (
            <div style={{ background: 'rgba(16, 23, 19, 0.7)', padding: '0.75rem 0.95rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-champagne-hover)' }}>Diagnóstico Comportamental:</strong> {demand.aiDiagnosis}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn-sage"
            onClick={() => { onStartCrappyDraft(demand.title); onClose(); }}
          >
            <Zap size={14} />
            <span>Crappy Draft (7 min)</span>
          </button>

          <button
            className="btn-champagne"
            onClick={() => { onStartFocus(demand); onClose(); }}
          >
            <Play size={14} fill="currentColor" />
            <span>Iniciar Foco</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => { onToggleStatus(demand.id); onClose(); }}
          >
            <Check size={14} />
            <span>{isDone ? 'Reabrir' : 'Concluir'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
