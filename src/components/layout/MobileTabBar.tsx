import React from 'react';
import { 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  Calendar, 
  BrainCircuit 
} from 'lucide-react';
import type { MainTab } from './DesktopNavigation';

interface MobileTabBarProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  inboxCount?: number;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onTabChange,
  inboxCount = 0
}) => {
  const tabs = [
    { id: 'today' as MainTab, label: 'Hoje', icon: CheckCircle2 },
    { id: 'habits' as MainTab, label: 'Hábitos', icon: Flame },
    { id: 'evolution' as MainTab, label: 'Evolução', icon: TrendingUp },
    { id: 'planning' as MainTab, label: 'Planejar', icon: Calendar, badge: inboxCount > 0 ? inboxCount : null },
    { id: 'ai' as MainTab, label: 'Kairos IA', icon: BrainCircuit }
  ];

  return (
    <nav className="ios-bottom-tabbar" aria-label="Navegação Principal Mobile">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`ios-tab-item ${isActive ? 'active' : ''}`}
            style={{
              position: 'relative',
              color: isActive ? 'var(--accent-champagne-hover)' : 'var(--text-muted)'
            }}
          >
            <div className="ios-tab-icon">
              <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              {tab.badge && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '18%',
                    background: 'var(--accent-champagne)',
                    color: 'var(--text-on-champagne)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
