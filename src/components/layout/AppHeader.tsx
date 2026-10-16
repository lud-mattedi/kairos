import React from 'react';
import { 
  Bell, 
  Plus, 
  Settings, 
  ShieldCheck, 
  Zap
} from 'lucide-react';
import type { EnergyState, SmartNotification } from '../../types';

interface AppHeaderProps {
  currentEnergy: EnergyState;
  onEnergyChange: (energy: EnergyState) => void;
  notifications: SmartNotification[];
  onOpenNotifications: () => void;
  onOpenQuickCapture: () => void;
  onOpenSettings: () => void;
  bufferMinutes?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentEnergy,
  onEnergyChange,
  notifications,
  onOpenNotifications,
  onOpenQuickCapture,
  onOpenSettings,
  bufferMinutes = 90
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 18) return 'Boa noite, Lud';
    if (hour >= 12) return 'Boa tarde, Lud';
    return 'Bom dia, Lud';
  };

  return (
    <header className="app-header">
      <div className="container header-inner">
        {/* Brand & Identity */}
        <div className="brand">
          <div 
            className="brand-icon" 
            style={{ 
              overflow: 'hidden', 
              padding: 0, 
              border: '1px solid rgba(210, 173, 120, 0.4)', 
              background: '#101713', 
              borderRadius: '9px', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <img 
              src="./apple-touch-icon.png" 
              alt="KAIROS OS" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 className="brand-title" style={{ fontSize: '1.2rem', margin: 0 }}>KAIROS OS</h1>
              <span 
                className="badge badge-amber" 
                style={{ 
                  fontSize: '0.65rem', 
                  padding: '0.15rem 0.45rem', 
                  borderRadius: '4px',
                  background: 'rgba(210, 173, 120, 0.12)',
                  borderColor: 'rgba(210, 173, 120, 0.3)'
                }}
              >
                Noite Botânica
              </span>
            </div>
            <p className="brand-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
              {getGreeting()} • Executive Sanctuary
            </p>
          </div>
        </div>

        {/* Telemetry & Quick Actions */}
        <div className="header-controls">
          {/* Buffer Guard Pill */}
          <div 
            className="selector-pill desktop-only-control" 
            title="Capacidade biológica protegida para imprevistos e emergências reais"
            style={{ borderColor: 'rgba(138, 167, 142, 0.35)', background: 'rgba(44, 61, 51, 0.4)' }}
          >
            <ShieldCheck size={14} color="var(--accent-success)" />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Buffer:</span>
            <strong style={{ color: 'var(--accent-success)', fontSize: '0.78rem' }}>28% ({bufferMinutes}m)</strong>
          </div>

          {/* Energy State Pill */}
          <div 
            className="selector-pill" 
            title="Nível de energia atual — calibra o agendamento de tarefas analíticas e rasas"
            style={{ borderColor: 'rgba(210, 173, 120, 0.35)' }}
          >
            <Zap size={14} color="var(--accent-champagne)" />
            <select 
              value={currentEnergy} 
              onChange={(e) => onEnergyChange(e.target.value as EnergyState)}
              aria-label="Nível de Energia Atual"
              style={{ color: 'var(--text-main)', background: 'transparent' }}
            >
              <option value="Alta" style={{ background: '#222B27', color: '#F1EDE4' }}>Alta (Foco Analítico)</option>
              <option value="Média" style={{ background: '#222B27', color: '#F1EDE4' }}>Média (Coordenação)</option>
              <option value="Baixa" style={{ background: '#222B27', color: '#F1EDE4' }}>Baixa (Tarefas Rasas)</option>
              <option value="Esgotada" style={{ background: '#222B27', color: '#F1EDE4' }}>Esgotada (Recuperação)</option>
            </select>
          </div>

          {/* Quick Capture Button */}
          <button 
            className="btn-champagne"
            onClick={onOpenQuickCapture}
            title="Capturar nova demanda com triagem de voz ou texto"
            style={{ padding: '0.42rem 0.85rem', fontSize: '0.8rem' }}
          >
            <Plus size={15} />
            <span className="desktop-only-control">Capturar</span>
          </button>

          {/* Notifications Bell */}
          <button 
            className="btn-secondary" 
            onClick={onOpenNotifications}
            title="Central de Alertas Inteligentes"
            style={{ position: 'relative', padding: '0.45rem 0.65rem' }}
            aria-label="Notificações"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: 'var(--accent-champagne)',
                  color: 'var(--text-on-champagne)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(210, 173, 120, 0.6)'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings Hub Button */}
          <button 
            className="btn-secondary" 
            onClick={onOpenSettings}
            title="Configurações & Hub de Integrações (WhatsApp, Hostinger, Calendário, Backup)"
            style={{ padding: '0.45rem 0.65rem' }}
            aria-label="Configurações"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
