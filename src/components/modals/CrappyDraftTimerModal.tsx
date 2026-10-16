import React from 'react';
import { X, Play, Pause, RefreshCw, Zap } from 'lucide-react';

interface CrappyDraftTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  secondsRemaining: number;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
}

export const CrappyDraftTimerModal: React.FC<CrappyDraftTimerModalProps> = ({
  isOpen,
  onClose,
  taskTitle,
  secondsRemaining,
  isRunning,
  onToggleRun,
  onReset
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '2rem 1.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button className="btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-champagne-dim)', border: '1px solid rgba(210, 173, 120, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-champagne)' }}>
          <Zap size={24} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
          Protocolo Crappy Draft (7 Minutos)
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
          {taskTitle || 'Tarefa Selecionada'}
        </p>

        {/* Big Timer Display */}
        <div 
          style={{ 
            fontSize: '3.6rem', 
            fontWeight: 700, 
            fontFamily: 'var(--font-mono)', 
            color: isRunning ? 'var(--accent-champagne-hover)' : 'var(--text-main)',
            margin: '0.5rem 0 1.25rem 0',
            letterSpacing: '0.05em'
          }}
        >
          {minutes}:{(seconds).toString().padStart(2, '0')}
        </div>

        {/* Permission Quote */}
        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--accent-champagne)', margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>
            "Você tem permissão oficial para produzir o rascunho mais imperfeito, tosco e incompleto da sua vida pelos próximos 7 minutos. Quando apitar, você pode parar sem culpa."
          </p>
        </div>

        {/* Timer Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <button
            className="btn-champagne"
            onClick={onToggleRun}
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            <span>{isRunning ? 'Pausar' : 'Começar Agora'}</span>
          </button>

          <button
            className="btn-secondary"
            onClick={onReset}
            style={{ padding: '0.65rem 0.95rem' }}
            title="Reiniciar 7 minutos"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
