import React from 'react';
import { 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  Calendar, 
  BrainCircuit 
} from 'lucide-react';

export type MainTab = 'today' | 'habits' | 'evolution' | 'planning' | 'ai';

interface DesktopNavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  inboxCount?: number;
  habitsDueToday?: number;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  activeTab,
  onTabChange,
  inboxCount = 0,
  habitsDueToday = 0
}) => {
  const tabs = [
    {
      id: 'today' as MainTab,
      label: 'HOJE',
      icon: CheckCircle2,
      badge: null,
      description: 'Cockpit do dia & The Big One'
    },
    {
      id: 'habits' as MainTab,
      label: 'HÁBITOS',
      icon: Flame,
      badge: habitsDueToday > 0 ? `${habitsDueToday} pendentes` : null,
      description: 'Consistência & Heatmaps'
    },
    {
      id: 'evolution' as MainTab,
      label: 'EVOLUÇÃO',
      icon: TrendingUp,
      badge: null,
      description: 'Analytics reais & Conquistas'
    },
    {
      id: 'planning' as MainTab,
      label: 'PLANEJAR',
      icon: Calendar,
      badge: inboxCount > 0 ? `${inboxCount}` : null,
      description: 'Triagem, Timeblocking & Delegação'
    },
    {
      id: 'ai' as MainTab,
      label: 'KAIROS IA',
      icon: BrainCircuit,
      badge: 'Coach',
      description: 'Sparring, SOS Foco & Memória'
    }
  ];

  return (
    <nav className="desktop-navigation" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', padding: '0.5rem 0' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflowX: 'auto' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                background: isActive ? 'var(--accent-champagne-dim)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--accent-champagne)' : 'transparent'}`,
                color: isActive ? 'var(--accent-champagne-hover)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.86rem',
                letterSpacing: '0.01em',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={17} color={isActive ? 'var(--accent-champagne)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span 
                  style={{
                    fontSize: '0.68rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    background: isActive ? 'var(--accent-champagne)' : 'rgba(255,255,255,0.08)',
                    color: isActive ? 'var(--text-on-champagne)' : 'var(--text-muted)',
                    fontWeight: 600
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
