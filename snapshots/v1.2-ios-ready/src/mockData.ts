import type { Demand, DelegationItem, MemoryFact, ChatMessage } from './types';

export const INITIAL_DEMANDS: Demand[] = [
  {
    id: 'dem-1',
    title: 'Fazer mural da vida próspera',
    category: 'PROJECT',
    domain: 'Desenvolvimento',
    nextAction: 'Sessão de 20 min no sábado para selecionar 5 imagens inspiradoras e redigir 3 princípios no Notion/quadro físico.',
    energyLevel: 'Baixa (Mecânico/Descanso)',
    estimatedMinutes: 45,
    deadlineType: 'Sem Prazo Fixo',
    deadlineText: 'Sábado 10:00 (Protegido pela IA para não competir com a semana de trabalho)',
    costOfDelay: 'Nenhum dano prático ou financeiro imediato; risco de perda difusa de direcionamento de vida se esquecido.',
    definitionOfDone: 'Painel com 5 imagens e 3 diretrizes impresso ou salvo como fundo de tela.',
    aiDiagnosis: 'Desejo de alto valor inspiracional, porém sem prazo externo. Risco clássico: ser adiado indefinidamente OU ser usado como "procrastinação produtiva" para fugir de tarefas duras.',
    postponementCount: 3,
    status: 'AGENDADO',
    scheduledTime: 'Sáb 10:00',
    eisenhowerQuadrant: 'Q2 (Estratégico / Não Urgente)',
    surgicalQuestion: 'Qual a função desse mural hoje: direcionar decisões reais do trimestre ou servir de refúgio criativo enquanto você evita pendências duras?'
  },
  {
    id: 'dem-2',
    title: 'Estudar X (Tema Estratégico / Gestão)',
    category: 'PROJECT',
    domain: 'Desenvolvimento',
    nextAction: 'Ler o sumário executivo / assistir aos primeiros 25 min da aula e extrair 2 decisões aplicáveis à equipe nesta semana.',
    energyLevel: 'Alta (Foco Analítico)',
    estimatedMinutes: 45,
    deadlineType: 'Soft (Autoimposto)',
    deadlineText: 'Terça e Quinta 08:30',
    costOfDelay: 'Lentidão na evolução estratégica e perda de clareza nas decisões de liderança com a equipe.',
    definitionOfDone: '2 anotações com aplicação prática compartilhadas ou testadas na rotina de trabalho.',
    aiDiagnosis: '"Estudar X" é excessivamente amplo e gera paralisia por sobrecarga. Fatiado no menor bloco digerível com entrega prática imediata (Critério de Pronto claro).',
    postponementCount: 2,
    status: 'HOJE',
    scheduledTime: 'Hoje 08:30',
    eisenhowerQuadrant: 'Q2 (Estratégico / Não Urgente)',
    surgicalQuestion: 'X é requisito para uma decisão ou projeto deste mês, ou é curiosidade intelectual? Qual o menor resultado concreto que você precisa colher hoje?'
  },
  {
    id: 'dem-3',
    title: 'Arrumar a porta do banheiro',
    category: 'TASK',
    domain: 'Casa/Vida',
    nextAction: 'Pegar a chave Phillips e reapertar os 3 parafusos da dobradiça superior após o almoço (ou mandar WhatsApp para o marceneiro).',
    energyLevel: 'Baixa (Mecânico/Descanso)',
    estimatedMinutes: 15,
    deadlineType: 'Soft (Autoimposto)',
    deadlineText: 'Hoje 13:15 ou Sábado de manhã',
    costOfDelay: 'Microestresse diário subliminar: cada vez que a porta raspa no chão, rouba atenção e gera irritação silenciosa.',
    definitionOfDone: 'Porta abrindo e fechando livremente sem atrito no piso e sem emperrar.',
    aiDiagnosis: 'Demanda de microfricção física doméstica. Baixo esforço cognitivo. A inércia ocorre porque exige ferramenta física. Uma ação de 5 minutos encerra o ciclo de preocupação.',
    postponementCount: 4,
    status: 'HOJE',
    scheduledTime: 'Hoje 13:15',
    eisenhowerQuadrant: 'Q3 (Urgente / Não Importante)',
    surgicalQuestion: 'Isso precisa da sua habilidade manual ou você pode terceirizar em 2 minutos pelo WhatsApp para tirar de vez da cabeça?'
  },
  {
    id: 'dem-4',
    title: 'Marcar prova de habilitação',
    category: 'TASK',
    domain: 'Casa/Vida',
    nextAction: 'Acessar o portal do Detran/autoescola às 14:00, pagar o DAE pendente e selecionar a vaga de exame mais próxima.',
    energyLevel: 'Média (Coordenação)',
    estimatedMinutes: 12,
    deadlineType: 'Hard (Externo/Crítico)',
    deadlineText: 'Hoje até 17:00 (Risco de expiração do laudo e taxa de reinício)',
    costOfDelay: 'Risco real de expiração do processo, perda financeira e necessidade de refazer etapas burocráticas.',
    definitionOfDone: 'Comprovante oficial de agendamento baixado em PDF ou confirmado por e-mail.',
    aiDiagnosis: 'Urgência objetiva com prazo legal externo rígido. Tarefa curta, mas evitada por fricção burocrática ou ansiedade do teste. Deve ter prioridade máxima de execução hoje.',
    postponementCount: 1,
    status: 'HOJE',
    scheduledTime: 'Hoje 14:00',
    eisenhowerQuadrant: 'Q1 (Urgente & Importante)',
    surgicalQuestion: 'O que está impedindo você de agendar agora em 10 minutos: falta o boleto, há dúvida sobre a data ou há ansiedade em relação à prova?'
  },
  {
    id: 'dem-5',
    title: 'Acompanhar entrega da equipe (Relatório do Projeto Alfa)',
    category: 'DELEGATED',
    domain: 'Liderança',
    nextAction: 'Enviar mensagem de desbloqueio para Lívia: "Lívia, reservando nossos 15 min de quinta às 15:30. Algum dado da filial travando o consolidado? Precisa de apoio político meu?"',
    energyLevel: 'Média (Coordenação)',
    estimatedMinutes: 15,
    deadlineType: 'Hard (Externo/Crítico)',
    deadlineText: 'Quinta 15:30 (Ponto de controle prévio antes da entrega do conselho na sexta)',
    costOfDelay: 'Surpresa de última hora com entregável com inconsistências, forçando retrabalho na sexta à noite ou desgaste com diretoria.',
    definitionOfDone: 'Confirmação mútua de que não existem gargalos pendentes e que a estrutura atende o padrão exigido.',
    aiDiagnosis: 'Liderança lúcida preventiva. Evita a oscilação tóxica entre abandono negligente e microgestão sufocante. Transfere autonomia com pontos de checagem transparentes.',
    postponementCount: 0,
    status: 'AGENDADO',
    scheduledTime: 'Qui 15:30',
    eisenhowerQuadrant: 'Q1 (Urgente & Importante)',
    surgicalQuestion: 'Você precisa executar ou revisar? A Lívia possui a Definição de Pronto (DoD) e autoridade para decidir os detalhes operacionais?'
  }
];

export const INITIAL_DELEGATIONS: DelegationItem[] = [
  {
    id: 'del-1',
    taskTitle: 'Consolidação de Dados e Relatório do Projeto Alfa',
    assignee: 'Lívia Mendes (Analista Sênior)',
    autonomyLevel: '2 (Proponha e eu aprovo)',
    definitionOfDone: 'Planilha conferida com gráficos de tendência e resumo executivo de 1 página com recomendações claras.',
    checkInDate: 'Quinta 15:30',
    deadline: 'Sexta 12:00',
    status: 'EM_ANDAMENTO',
    supportPrompt: 'Lívia, estou reservando quinta às 15:30 para ver se você encontrou alguma inconsistência nos dados da filial. Precisa que eu alinhe algo com a diretoria antes?'
  },
  {
    id: 'del-2',
    taskTitle: 'Configuração do Ambiente de Testes do Novo Sistema',
    assignee: 'Marcos Souza (Dev Pleno)',
    autonomyLevel: '3 (Decida e me mantenha informado)',
    definitionOfDone: 'Servidor de staging funcional com credenciais compartilhadas no cofre de senhas da equipe.',
    checkInDate: 'Sexta 10:00',
    deadline: 'Sexta 17:00',
    status: 'EM_ANDAMENTO',
    supportPrompt: 'Marcos, como está a subida do contêiner? Ficou alguma dúvida sobre o limite de recursos da infraestrutura?'
  }
];

export const INITIAL_MEMORY: MemoryFact[] = [
  {
    id: 'mem-1',
    category: 'Limite Biológico',
    insight: 'Seu limite diário saudável de Deep Work analítico contínuo é de aproximadamente 3h30. Acima disso, a precisão cai 40% e a irritabilidade aumenta.',
    confidence: 'Alta',
    userApproved: true
  },
  {
    id: 'mem-2',
    category: 'Padrão Observado',
    insight: 'Você tende a adiar tarefas burocráticas que envolvem portais do governo ou telefonemas quando estão agendadas no final da tarde.',
    confidence: 'Alta',
    userApproved: true
  },
  {
    id: 'mem-3',
    category: 'Preferência',
    insight: 'Prefere receber questionamentos diretos e racionais, sem rodeios diplomáticos excessivos ou positividade motivacional forçada.',
    confidence: 'Alta',
    userApproved: true
  },
  {
    id: 'mem-4',
    category: 'Valor',
    insight: 'Considera o desenvolvimento com autonomia da equipe como uma prioridade inegociável de longo prazo, evitando centralizar decisões operacionais.',
    confidence: 'Alta',
    userApproved: true
  },
  {
    id: 'mem-5',
    category: 'Padrão Observado',
    insight: 'Tarefas de organização física ou doméstica funcionam melhor como rituais de descompressão no sábado de manhã ou logo após o almoço.',
    confidence: 'Hipótese Inicial',
    userApproved: false
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Olá! Analisei sua manhã. Você tem 2h45min de trabalho nobre alocado (Estudar X + Planejamento) e o agendamento da Prova do Detran às 14h. Notei que você adiou a porta do banheiro 4 vezes. Em que posso atuar como sparring agora?',
    timestamp: '08:00',
    posture: 'Guardião Firme'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Recebi um pedido urgente da diretoria para revisar uma proposta até as 15h. Devo encaixar agora de manhã?',
    timestamp: '08:15'
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: 'Alerta de sobrecarga. Se você absorver isso agora de manhã, vai canibalizar seu bloco de estudo e empurrar o agendamento da prova (que vence hoje). Sugiro 2 caminhos:\n\n1. "Sim Condicional": Responda que entrega a revisão amanhã às 10h.\n2. Se for inegociável para hoje, delegue a triagem inicial para a Lívia e reserve apenas 20 min seus às 16h.',
    timestamp: '08:16',
    posture: 'Guardião Firme',
    suggestedAction: {
      label: 'Gerar mensagem de contraproposta para a diretoria',
      actionType: 'say_no'
    }
  }
];
