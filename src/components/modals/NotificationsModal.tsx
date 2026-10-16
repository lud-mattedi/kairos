import React from 'react';
import { X, Bell, ShieldAlert, Target, Zap } from 'lucide-react';
import type { SmartNotification } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SmartNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRequestPushPermission: () => Promise<void>;
  onNavigateTab: (tab: any) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRequestPushPermission,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '480px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-champagne-dim)', color: 'var(--accent-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                Alertas Executivos Inteligentes
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sem ruído de redes sociais</span>
            </div>
          </div>

          <button className="btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Web Push Prompt */}
        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <strong style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'block' }}>
              Notificações de Sistema
            </strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Apenas risco de buffer e The Big One.
            </span>
          </div>

          <button
            className="btn-sage"
            onClick={onRequestPushPermission}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}
          >
            Ativar Alertas
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
          {notifications.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', margin: '1.5rem 0' }}>
              Nenhuma notificação recente. Sua atenção está protegida.
            </p>
          ) : (
            notifications.map(n => {
              let Icon = Bell;
              if (n.category === 'BUFFER_ALERT') Icon = ShieldAlert;
              if (n.category === 'THE_BIG_ONE') Icon = Target;
              if (n.category === 'NEURO_HACK') Icon = Zap;

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    onMarkAsRead(n.id);
                    if (n.actionTab) {
                      onNavigateTab(n.actionTab);
                      onClose();
                    }
                  }}
                  style={{
                    background: n.read ? 'rgba(16, 23, 19, 0.4)' : 'rgba(44, 61, 51, 0.4)',
                    border: `1px solid ${n.read ? 'var(--border-subtle)' : 'rgba(210, 173, 120, 0.3)'}`,
                    borderRadius: '8px',
                    padding: '0.75rem 0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Icon size={14} color={n.read ? 'var(--text-muted)' : 'var(--accent-champagne)'} />
                      <strong style={{ fontSize: '0.82rem', color: n.read ? 'var(--text-secondary)' : 'var(--accent-champagne-hover)' }}>
                        {n.title}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {n.body}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {notifications.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-ghost"
              onClick={onMarkAllAsRead}
              style={{ fontSize: '0.75rem' }}
            >
              Marcar todas como lidas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
