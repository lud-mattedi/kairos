# KAIROS OS — Auditoria de Redesign & Matriz de Rastreabilidade
**Data da Auditoria:** 16 de Outubro de 2026  
**Direção Criativa:** Noite Botânica (Botanical Night)  
**Branch de Trabalho:** `redesign/noite-botanica`  
**Regra Suprema:** Preservação Integral de 100% das regras, dados, botões, modais e inteligência existente.

---

## 1. Inventário Funcional do Sistema Atual

### 1.1 Módulos Atuais no Sistema (9 Abas Originais)
1. **Cockpit do Dia (`today`)**:
   - Saudação contextual ("Bom dia/tarde/noite, Lud"), data e badges de telemetria biológica (Retomada sem Culpa, Buffer 28% Preservado, Energia Atual).
   - "The Big One" (Prioridade inegociável do dia) com tags de prazo, energia, próxima ação física e critério de pronto (DoD).
   - Orçamento Biológico & Timeboxing: Gráfico de Deep Work (2h45 planejadas vs 3h30 limite), Shallow Work (1h45) e Buffer Intocável de 28% (1h30).
   - Simulador de Trade-Off: Resolução de conflitos de agenda quando nova emergência surge.
   - Agenda Real do Dia com blocos de tempo e tarefas alocadas.
   - Tarefas Protegidas para a Semana.
   - Neuro-Hack do Dia com citação, mecanismo neurocientífico e micro-ação prática.
2. **Demonstração das 5 Demandas (`showcase`)**:
   - Os 5 casos reais do briefing original desdobrados pelo KAIROS:
     1. Mural da vida próspera (Projeto / Desenvolvimento / Q2).
     2. Estudar X (Projeto / Desenvolvimento / Q2).
     3. Arrumar a porta do banheiro (Tarefa / Casa e Vida / Q3).
     4. Marcar prova de habilitação (Tarefa / Casa e Vida / Q1).
     5. Acompanhar entrega da equipe / Projeto Alfa (Delegado / Liderança / Q1).
   - Cards com Diagnóstico Consultivo da IA, Pergunta Cirúrgica, Custo do Atraso e Definição de Pronto (DoD).
3. **Caixa de Entrada & Triagem Inteligente (`inbox`)**:
   - Captura rápida de demandas com suporte a entrada de texto e ditado por voz via Web Speech API.
   - Filtros por Domínio de Vida: *Todos, Trabalho, Liderança, Desenvolvimento, Casa/Vida, Saúde, Finanças*.
   - Triagem explicável na Matriz de Eisenhower (Q1 Urgente & Importante, Q2 Estratégico, Q3 Delegar/Rápido, Q4 Eliminar/Algum Dia).
   - Diagnósticos detalhados de cada demanda com botão de inspeção.
4. **SOS Anti-Procrastinação & Hacks Cognitivos (`procrastination`)**:
   - Diagnóstico das 5 causas reais de procrastinação: Fricção de Início, Perfeccionismo & Impostor, Sobrecarga, Falta de Sentido, Exaustão.
   - Protocolo Crappy Draft de 7 Minutos (Versão Malfeita Intencional) com cronômetro interativo decrescente.
   - As 4 táticas anti-sabotagem:
     - Tática 1: Crappy Draft (abaixar a régua para o chão).
     - Tática 2: Pânico Antecipado & Deadlines Sociais.
     - Tática 3: Regra dos 120 Segundos (quebra da inércia física).
     - Tática 4: Auditoria de Conforto vs Risco Real.
5. **Dizer Não & Delegação Lúcida (`boundaries`)**:
   - Gerador de "Não Diplomático" com 4 perfis de destinatário (*Chefe/Diretoria, Cliente, Colega/Par, Amigo/Família*) e 3 contextos (*Reunião desnecessária, Tarefa extra, Prazo irreal*).
   - Botão "Copiar Mensagem Pronta" com feedback visual.
   - 5 Níveis de Autonomia na Delegação de Liderança (Nível 1 Pesquise, Nível 2 Proponha, Nível 3 Decida).
   - Acompanhamento de entregas da equipe com data de check-in, suporte e status.
6. **Coach IA & Sparring Estratégico (`sparring`)**:
   - Chat interativo com histórico persistido.
   - Seletor de Postura do Coach: *Guardião Firme 🛡️*, *Parceiro Empático 🤝*, *Assistente Pragmático ⚙️*.
   - Botões de ações sugeridas rápidas (Reagendar, Fatiar, Delegar, Dizer Não, Focar 5 min).
   - Suporte híbrido: Modelo heurístico avançado offline + Conexão real com Google Gemini 1.5 Flash API.
7. **Retomada sem Culpa (`softLanding`)**:
   - Protocolo de retorno sem acúmulo punitivo após períodos de folga ou sobrecarga.
   - Botão "Limpar Acúmulo de Culpa" e redefinição de buffer.
8. **Evolução & Conquistas (`evolution`)**:
   - Seletor de período temporal: Diário, Semanal e Mensal.
   - Métricas de Foco, Buffer preservado, Tarefas estratégicas vs incêndios, Procrastinações repelidas, Liderados promovidos a autonomia.
   - Histórico de vitórias e conquistas registradas.
9. **Memória Transparente & Hub de Integrações (`memory`)**:
   - Hub de Integrações Executivas:
     - 🟢 WhatsApp Gateway (`+55 11 97555-6111`) com Transcrição Whisper, Briefing Matinal 07:30 e Shutdown 18:30 + Botão de Simulação.
     - ✉️ Hostinger Corporate Webmail (`lud@mktcx.com.br`) com IMAP/SMTP, filtro `#kairos` e desarmador de falsas urgências + Botão de Simulação.
     - 📅 Google Workspace (Gmail & Calendar) com auto-bloqueio de Deep Work e exportação `.ics`.
     - 💼 Microsoft 365 / Outlook (OAuth corporativo).
   - Guia de Publicação na Apple App Store (PWA vs IPA, US$ 99/ano, passos Capacitor).
   - Conexão e armazenamento de API Key do Google Gemini.
   - Fatos de Memória Cognitiva com aprovação/questionamento pelo usuário ("✓ Confirmado por Você" / "Questionar Premissa").
   - Declaração de Fronteira Estrita de Privacidade.

### 1.2 Modais e Elementos Globais
- **Modal de Notificações Inteligentes (`showNotificationsModal`)**: Notificações por categoria (BUFFER_ALERT, NEURO_HACK, THE_BIG_ONE, etc.) com botão para ativar Web Push nativo no iOS.
- **Modal de Captura Rápida (`showNewDemandModal`)**: Input de texto e botão de ditado por voz, com classificação de IA em tempo real.
- **Modal de Inspeção de Demanda (`inspectDemand`)**: Próxima Ação GTD, Diagnóstico da IA, Custo do Atraso, Pergunta Cirúrgica, DoD e botões de ação (Iniciar, Concluir, Adiar).
- **Modal de Histórico de Versões (`showVersionModal`)**: Relação de todos os snapshots de versões (`v1.0` a `v1.6`) com comandos de restauração e controle rápido de energia/postura.
- **Modal Apple App Store (`showAppStoreModal`)**: Tabela comparativa detalhada, custos e roadmap técnico Capacitor.
- **Toasts Flutuantes**: Simulação de áudio WhatsApp e e-mail Hostinger.

### 1.3 Dados Persistidos no LocalStorage (Chaves Reais)
- `kairos_demands_v1`: Array de `Demand[]`
- `kairos_delegations_v1`: Array de `DelegationItem[]`
- `kairos_memory_v1`: Array de `MemoryFact[]`
- `kairos_chat_v1`: Array de `ChatMessage[]`
- `kairos_energy_v1`: `EnergyState` ('Alta' | 'Média' | 'Baixa')
- `kairos_posture_v1`: `CoachPosture` ('Guardião Firme' | 'Parceiro Empático' | 'Assistente Pragmático')
- `kairos_notifications_v1`: Array de `SmartNotification[]`
- `kairos_metrics_v1`: `EvolutionMetrics`
- `kairos_gemini_api_key`: String com a chave da API do Gemini
- `kairos_integrations_v1`: `IntegrationConfig` (WhatsApp, Hostinger, Gmail, Outlook)
- **Novas Chaves de Redesign**:
  - `kairos_habits_v1`: Array de `Habit[]`
  - `kairos_events_v1`: Array de `AnalyticsEvent[]` (eventos reais para gráficos de evolução)

---

## 2. Matriz de Rastreabilidade (Onde cada recurso viverá)

| Módulo Original | Novo Posicionamento na Arquitetura Noite Botânica | Nível de Acesso |
| :--- | :--- | :--- |
| **Cockpit do Dia** | **Tab 1: HOJE** | Visão principal inicial |
| **The Big One & Capacidade** | **Tab 1: HOJE** (Card Herói de Prioridade + Orçamento de Foco) | 1º plano |
| **Orçamento Deep Work / Buffer 28%** | **Tab 1: HOJE** (Card de Telemetria de Foco) + **Tab 4: PLANEJAR** | 1º plano |
| **Neuro-Hacks & Dica do Cérebro** | **Tab 1: HOJE** (Card Compacto de Orientação Cognitiva) + **Tab 5: KAIROS IA** | 1º plano e atalho |
| **Demonstração das 5 Demandas** | **Tab 4: PLANEJAR** ➔ Sub-aba *Demonstrações do Briefing* | Aba Planejar |
| **Caixa de Entrada & Triagem** | **Tab 4: PLANEJAR** ➔ Sub-aba *Caixa de Entrada & Matriz GTD* | Aba Planejar |
| **SOS Anti-Procrastinação** | **Tab 1: HOJE** (Botão "Me ajude a começar") + **Tab 5: KAIROS IA** | Modal e Aba IA |
| **Timer Crappy Draft (7 min)** | **Modal Executivo Global** acessível do The Big One, do SOS e da IA | Qualquer tela |
| **Dizer Não & Delegação** | **Tab 4: PLANEJAR** ➔ Sub-aba *Liderança & Delegação* | Aba Planejar |
| **Coach IA & Sparring** | **Tab 5: KAIROS IA** | Aba IA dedicada |
| **Configuração de Postura IA** | **Tab 5: KAIROS IA** + Header Desktop + Menu Configurações | Múltiplos pontos |
| **Retomada sem Culpa** | **Tab 1: HOJE** (Ação rápida no topo) + **Tab 4: PLANEJAR** | Card de emergência |
| **Evolução & Conquistas** | **Tab 3: EVOLUÇÃO** (Métricas reais + períodos 7d/30d/90d + histórico demo) | Aba Evolução |
| **Novo Módulo de Hábitos** | **Tab 2: HÁBITOS** + Card compacto na **Tab 1: HOJE** | Aba Hábitos + Home |
| **Memória Transparente da IA** | **Tab 5: KAIROS IA** (Painel de Soberania & Fatos) + **Configurações** | Aba IA / Modal |
| **Hub de Integrações Executivas** | **Menu de Configurações ➔ Canais & Conexões** | Header / Perfil |
| **Guia Apple App Store** | **Menu de Configurações ➔ Aplicativo Apple iOS** | Header / Perfil |
| **Backup & Restauração (Export/Import)**| **Menu de Configurações ➔ Segurança de Dados (JSON)** | Header / Perfil |
| **Histórico de Snapshots de Versão** | **Menu de Configurações ➔ Histórico de Versões** | Header / Perfil |

---

## 3. Arquitetura de Componentes Modular (Adeus Arquivo Monolítico)

A pasta `src/` será desmembrada em módulos coesos e reutilizáveis:

```
src/
├── types.ts                      # Tipos centrais expandidos com Habit e AnalyticsEvent
├── mockData.ts                   # Dados iniciais e demonstrações preservadas
├── index.css                     # Tokens Noite Botânica e estilos base
├── App.css                       # Layout do app-shell, sidebar e navegação
├── services/
│   ├── storageService.ts         # Leitura/escrita segura, migração e exportação JSON
│   ├── aiService.ts              # Heurística cognitiva + conector Google Gemini
│   ├── calendarService.ts        # Geração e exportação iCalendar (.ics)
│   └── habitAnalyticsService.ts  # Registro de eventos reais de foco, hábitos e tarefas
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx         # Topbar com saudação Lud, Buffer, energia e sino
│   │   ├── DesktopSidebar.tsx    # Sidebar Noite Botânica com as 5 abas
│   │   └── MobileTabBar.tsx      # Barra inferior iOS com 5 abas e safe-area
│   ├── today/
│   │   ├── TodayHeroPriorities.tsx # The Big One com botões de ação e Crappy Draft
│   │   ├── TodayMetricsBar.tsx     # 4 indicadores visuais (Prioridades, Hábitos, Foco, Consistência)
│   │   ├── TodayHabitsMini.tsx     # Checklist rápido dos hábitos do dia
│   │   ├── TodayTimeboxing.tsx     # Deep Work, Buffer 28% e conflitos de agenda
│   │   └── TodayNeuroHackCard.tsx  # Orientação cognitiva do dia
│   ├── habits/
│   │   ├── HabitsList.tsx          # Lista de hábitos com filtros e edição
│   │   ├── HabitHeatmap.tsx        # Calendário de consistência visual Noite Botânica
│   │   └── HabitFormModal.tsx      # Criação e personalização de hábitos
│   ├── evolution/
│   │   ├── EvolutionDashboard.tsx  # Métricas reais 7d/30d/90d com alternador
│   │   ├── FocusTimeChart.tsx      # Minutos de foco por dia/semana (SVG nativo)
│   │   ├── PostponementAudit.tsx   # Análise de padrões de adiamento e causas
│   │   └── MilestonesList.tsx      # Vitórias e conquistas registradas
│   ├── planning/
│   │   ├── PlanningHub.tsx         # Navegação por sub-abas (Caixa de Entrada, Agenda, Liderança, Projetos, Demonstração)
│   │   ├── InboxView.tsx           # Triagem GTD + Matriz Eisenhower
│   │   ├── DelegationView.tsx      # Liderança, 5 níveis de autonomia e Dizer Não
│   │   ├── ProjectsIncubator.tsx   # Projetos e Algum Dia
│   │   └── BriefingShowcase.tsx    # As 5 demandas clássicas do briefing
│   ├── ai/
│   │   ├── KairosCoachView.tsx     # Chat, postura, atalhos contextuais e Gemini
│   │   ├── ProcrastinationSOS.tsx  # Investigação de atrito e Crappy Draft
│   │   └── AiMemoryManager.tsx     # Memória transparente e soberania de premissas
│   └── modals/
│       ├── QuickCaptureModal.tsx   # Captura rápida de demandas (texto e voz)
│       ├── CrappyDraftTimerModal.tsx # Cronômetro de 7 minutos anti-impostor
│       ├── DemandDetailModal.tsx   # Inspeção detalhada de tarefas
│       ├── SettingsHubModal.tsx    # Hub de Integrações, Gemini Key, Backup JSON e Versões
│       └── NotificationsModal.tsx  # Notificações inteligentes e Web Push
```

---

## 4. Garantia de Integridade de Dados
- Nenhuma chave `kairos_*` existente será renomeada ou apagada.
- Adicionadas funções de segurança em `storageService.ts`:
  - `exportFullBackupJSON()`: gera arquivo `kairos-backup-[data].json` com todos os dados do usuário.
  - `importFullBackupJSON(jsonString)`: valida e restaura sem perda.
  - `loadHabits()` / `saveHabits()`: persiste novos hábitos sem conflitar com tarefas.
  - `logEvent()` / `loadEvents()`: registra eventos reais com timestamps para alimentação dos gráficos da aba Evolução.
