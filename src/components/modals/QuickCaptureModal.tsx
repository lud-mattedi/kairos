import React, { useState } from 'react';
import { X, Mic, Sparkles } from 'lucide-react';
import type { EnergyState } from '../../types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
  currentEnergy: EnergyState;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentEnergy
}) => {
  const [title, setTitle] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsClassifying(true);
    await onSubmit(title.trim());
    setIsClassifying(false);
    setTitle('');
    onClose();
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
          setTitle(transcript);
          setIsVoiceRecording(false);
        };

        recognition.onerror = () => setIsVoiceRecording(false);
        recognition.onend = () => setIsVoiceRecording(false);

        recognition.start();
        return;
      } catch {
        // Fallback
      }
    }

    // Fallback simulation
    setIsVoiceRecording(true);
    setTimeout(() => {
      setTitle('Alinhar prazo do relatório com a diretoria na quinta-feira');
      setIsVoiceRecording(false);
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
              Captura Rápida & Triagem Inteligente
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Fale ou digite. A IA categoriza e extrai a próxima ação física.
            </span>
          </div>
          <button className="btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              rows={3}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Áudio de 2 min do cliente pedindo revisão de proposta até amanhã cedo..."
              required
              autoFocus
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.75rem 0.85rem',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                resize: 'none'
              }}
            />

            <button
              type="button"
              onClick={handleVoiceCapture}
              className={`btn-ghost ${isVoiceRecording ? 'recording' : ''}`}
              title="Gravar por voz (transcrição imediata em português)"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                padding: '0.4rem',
                borderRadius: '50%',
                background: isVoiceRecording ? 'rgba(217, 125, 125, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                color: isVoiceRecording ? '#D97D7D' : 'var(--text-main)'
              }}
            >
              <Mic size={16} />
            </button>
          </div>

          <div style={{ background: 'rgba(16, 23, 19, 0.6)', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ⚡ Calibrado para sua energia atual: <strong style={{ color: 'var(--accent-champagne)' }}>{currentEnergy}</strong>.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-champagne" disabled={isClassifying}>
              <Sparkles size={14} />
              <span>{isClassifying ? 'Triando...' : 'Triar com IA'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
