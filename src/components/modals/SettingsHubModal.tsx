import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Smartphone, 
  Mail, 
  Calendar, 
  Key, 
  Download, 
  Upload, 
  Apple, 
  History, 
  Check, 
  Share2
} from 'lucide-react';
import type { IntegrationConfig } from '../../types';
import { storageService } from '../../services/storageService';

interface SettingsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrations: IntegrationConfig;
  onUpdateIntegrations: (updates: Partial<IntegrationConfig>) => void;
  onSimulateWhatsApp: () => void;
  onSimulateHostinger: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onRestoreSuccess: () => void;
}

export const SettingsHubModal: React.FC<SettingsHubModalProps> = ({
  isOpen,
  onClose,
  integrations,
  onUpdateIntegrations,
  onSimulateWhatsApp,
  onSimulateHostinger,
  apiKey,
  onSaveApiKey,
  onRestoreSuccess
}) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'integrations' | 'ai' | 'backup' | 'apple' | 'versions'>('integrations');
  const [localKey, setLocalKey] = useState(apiKey);
  const [keySaved, setKeySaved] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleKeySave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(localKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleExportJSON = () => {
    const jsonStr = storageService.exportFullBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kairos-backup-lud-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storageService.importFullBackupJSON(content);
      if (res.success) {
        setRestoreMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          onRestoreSuccess();
          onClose();
        }, 1200);
      } else {
        setRestoreMessage({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-champagne-dim)', color: 'var(--accent-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                Configurações & Integrações
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Perfil Executivo • Lud</span>
            </div>
          </div>

          <button className="btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Sub-nav inside modal */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', marginBottom: '1.25rem', paddingBottom: '0.2rem' }}>
          {[
            { id: 'integrations', label: 'Canais & E-mail', icon: Share2 },
            { id: 'ai', label: 'Chave Gemini IA', icon: Key },
            { id: 'backup', label: 'Backup JSON', icon: Download },
            { id: 'apple', label: 'Apple Web App', icon: Apple },
            { id: 'versions', label: 'Versões', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSettingsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSettingsTab(tab.id as any)}
                className={`subnav-pill ${active ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================= TAB 1: INTEGRAÇÕES ======================= */}
        {activeSettingsTab === 'integrations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* WhatsApp */}
            <div className="botanical-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Smartphone size={18} color="#25D366" />
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>WhatsApp Executivo</strong>
                </div>
                <span className="badge badge-sage" style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.3)' }}>
                  ● Conectado
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Número: <strong style={{ color: '#25D366' }}>{integrations.whatsapp.phoneNumber}</strong>
              </p>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
                <div>🎙️ Transcrição Whisper AI: <span style={{ color: 'var(--accent-success)' }}>Ativa (Voz → GTD)</span></div>
                <div>🌅 Briefing Matinal: {integrations.whatsapp.morningBriefingTime}</div>
                <div>🌙 Shutdown Noturno: {integrations.whatsapp.eveningShutdownTime}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn-primary"
                  style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem', background: '#25D366', color: '#000', fontWeight: 600 }}
                  onClick={() => { onSimulateWhatsApp(); onClose(); }}
                >
                  🎙️ Simular Mensagem de Áudio Recebida
                </button>
                <button
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => onUpdateIntegrations({ whatsapp: { ...integrations.whatsapp, enabled: !integrations.whatsapp.enabled } })}
                >
                  {integrations.whatsapp.enabled ? 'Pausar WhatsApp' : 'Reativar'}
                </button>
              </div>
            </div>

            {/* Hostinger Webmail */}
            <div className="botanical-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} color="var(--accent-champagne)" />
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Hostinger Webmail</strong>
                </div>
                <span className="badge badge-amber">● IMAP Ativo</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                E-mail corporativo: <strong style={{ color: 'var(--accent-champagne-hover)' }}>{integrations.hostinger.email}</strong>
              </p>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Filtro automático <code>#kairos</code> e triagem anti-pânico de falsas urgências de clientes.
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn-champagne"
                  style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                  onClick={() => { onSimulateHostinger(); onClose(); }}
                >
                  ✉️ Simular E-mail Triado sem Pânico
                </button>
                <button
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => onUpdateIntegrations({ hostinger: { ...integrations.hostinger, enabled: !integrations.hostinger.enabled } })}
                >
                  {integrations.hostinger.enabled ? 'Pausar Hostinger' : 'Reativar'}
                </button>
              </div>
            </div>

            {/* Google Calendar & Outlook */}
            <div className="botanical-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Calendar size={18} color="var(--accent-sage)" />
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Calendários & Agendas</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Sincronização bidirecional via arquivo universal <code>.ics</code> para Google Calendar, Microsoft Outlook e Apple Calendar.
              </p>
            </div>

          </div>
        )}

        {/* ======================= TAB 2: GEMINI API ======================= */}
        {activeSettingsTab === 'ai' && (
          <div className="botanical-card">
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Chave da API do Google Gemini
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              O KAIROS possui inteligência heurística offline de alto nível integrada. Para respostas ainda mais profundas no Sparring Coach, insira uma chave gratuita da Google AI Studio.
            </p>

            <form onSubmit={handleKeySave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input
                type="password"
                value={localKey}
                onChange={e => setLocalKey(e.target.value)}
                placeholder="AIzaSy..."
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: 'var(--text-main)',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Status: {apiKey ? 'Chave configurada' : 'Modo heurístico offline ativo'}
                </span>
                <button type="submit" className="btn-champagne">
                  {keySaved ? <Check size={14} /> : <Key size={14} />}
                  <span>{keySaved ? 'Chave Salva!' : 'Salvar Chave'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================= TAB 3: BACKUP JSON ======================= */}
        {activeSettingsTab === 'backup' && (
          <div className="botanical-card">
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Backup & Restauração Completa em JSON
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Seus dados pertencem a você. Exporte um snapshot integral de tarefas, hábitos, memórias e configurações para manter em segurança ou migrar de aparelho.
            </p>

            {restoreMessage && (
              <div 
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  marginBottom: '1rem',
                  background: restoreMessage.type === 'success' ? 'rgba(169, 198, 155, 0.15)' : 'rgba(217, 125, 125, 0.15)',
                  border: `1px solid ${restoreMessage.type === 'success' ? 'var(--accent-success)' : '#D97D7D'}`,
                  color: restoreMessage.type === 'success' ? 'var(--accent-success)' : '#D97D7D',
                  fontSize: '0.82rem'
                }}
              >
                {restoreMessage.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn-champagne"
                onClick={handleExportJSON}
                style={{ flex: 1, minWidth: '180px', justifyContent: 'center' }}
              >
                <Download size={15} />
                <span>Exportar Backup (JSON)</span>
              </button>

              <label 
                className="btn-secondary"
                style={{ flex: 1, minWidth: '180px', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Upload size={15} />
                <span>Restaurar Backup (JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: APPLE WEB APP ======================= */}
        {activeSettingsTab === 'apple' && (
          <div className="botanical-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Apple size={20} color="var(--accent-champagne)" />
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', margin: 0 }}>
                Como usar como App Nativo no iPhone (PWA)
              </h3>
            </div>

            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.65rem', lineHeight: 1.5 }}>
              <li>Abra o Safari no seu iPhone e acesse a URL permanente: <code style={{ color: 'var(--accent-champagne-hover)' }}>https://lud-mattedi.github.io/kairos/</code></li>
              <li>Toque no botão de <strong>Compartilhar</strong> (ícone quadrado com seta apontando para cima na barra inferior do Safari).</li>
              <li>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</li>
              <li>Toque em <strong>"Adicionar"</strong> no canto superior direito.</li>
            </ol>

            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ✨ O app abrirá em tela cheia, sem barra de navegação do navegador e com o ícone oficial gerado no Stitch. Custo: R$ 0,00.
            </div>
          </div>
        )}

        {/* ======================= TAB 5: VERSÕES ======================= */}
        {activeSettingsTab === 'versions' && (
          <div className="botanical-card">
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Histórico de Versões & Snapshots
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { tag: 'v2.0-noite-botanica', title: 'Redesign Noite Botânica', desc: '5 áreas de navegação, Design System Noite Botânica, Heatmaps de hábitos, Preservação integral.' },
                { tag: 'v1.6-lud-stitch-icon', title: 'Personalização Lud & Ícone Stitch', desc: 'Identidade Lud, ícone 1024x1024 do Stitch, fix 404 GitHub Pages.' },
                { tag: 'v1.5-mobile-pwa', title: 'Mobile PWA & Hostinger', desc: 'Suporte a Safari iOS e filtro de e-mail corporativo.' },
                { tag: 'v1.0-baseline', title: 'Baseline Executiva', desc: 'Cockpit do dia, The Big One, 5 casos do briefing.' }
              ].map(v => (
                <div key={v.tag} style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-champagne-hover)' }}>{v.title}</strong>
                    <span className="badge badge-gray" style={{ fontSize: '0.68rem' }}>{v.tag}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
