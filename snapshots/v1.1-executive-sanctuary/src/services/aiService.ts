import type { Demand, CoachPosture, EnergyState } from '../types';
import { storageService } from './storageService';

export const aiService = {
  async smartTriageDemand(title: string, currentEnergy: EnergyState): Promise<Partial<Demand>> {
    const apiKey = storageService.getApiKey();

    if (apiKey) {
      try {
        const systemPrompt = `Você é o KAIROS OS, um consultor cognitivo de decisão e coach de liderança.
Analise a demanda fornecida pelo usuário e retorne um objeto JSON estrito com as propriedades:
- category: "TASK" | "PROJECT" | "EVENT" | "GOAL" | "HABIT" | "SOMEDAY" | "REFERENCE" | "DELEGATED"
- domain: "Trabalho" | "Liderança" | "Desenvolvimento" | "Casa/Vida" | "Saúde" | "Finanças"
- nextAction: Próxima ação física concreta inequívoca de 5 a 15 minutos (estilo GTD)
- estimatedMinutes: Número inteiro (ex: 15, 30, 45)
- deadlineType: "Hard (Externo/Crítico)" | "Soft (Autoimposto)" | "Sem Prazo Fixo"
- costOfDelay: O que acontece se não fizer nesta semana
- definitionOfDone: Critério mensurável de pronto
- aiDiagnosis: Diagnóstico comportamental e risco de procrastinação/sobrecarga
- eisenhowerQuadrant: "Q1 (Urgente & Importante)" | "Q2 (Estratégico / Não Urgente)" | "Q3 (Urgente / Não Importante)" | "Q4 (Eliminar / Algum Dia)"
- surgicalQuestion: Pergunta cirúrgica de discernimento que desafia a prioridade.
Retorne APENAS o JSON válido.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nDemanda do usuário: "${title}". Energia atual: ${currentEnergy}.` }]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return {
              category: parsed.category || 'TASK',
              domain: parsed.domain || 'Trabalho',
              nextAction: parsed.nextAction || `Definir primeiro passo para "${title}"`,
              estimatedMinutes: Number(parsed.estimatedMinutes) || 30,
              deadlineType: parsed.deadlineType || 'Soft (Autoimposto)',
              costOfDelay: parsed.costOfDelay || 'Acúmulo de carga mental difusa.',
              definitionOfDone: parsed.definitionOfDone || 'Entregável verificado.',
              aiDiagnosis: parsed.aiDiagnosis || 'Triagem automática realizada pela IA.',
              eisenhowerQuadrant: parsed.eisenhowerQuadrant || 'Q2 (Estratégico / Não Urgente)',
              surgicalQuestion: parsed.surgicalQuestion || 'O que precisa acontecer primeiro e por quê?'
            };
          }
        }
      } catch (err) {
        console.warn('Fallback para heurística local:', err);
      }
    }

    // Heurística local determinística de alta fidelidade
    const lower = title.toLowerCase();
    const isMeeting = lower.includes('reunião') || lower.includes('alinhamento') || lower.includes('conversa');
    const isTeam = lower.includes('equipe') || lower.includes('time') || lower.includes('liderado') || lower.includes('delegar');
    const isHome = lower.includes('porta') || lower.includes('casa') || lower.includes('banheiro') || lower.includes('conserto');
    const isOfficial = lower.includes('prova') || lower.includes('detran') || lower.includes('banco') || lower.includes('imposto');
    const isReflective = lower.includes('mural') || lower.includes('sonho') || lower.includes('vida') || lower.includes('futuro');

    if (isReflective) {
      return {
        category: 'PROJECT',
        domain: 'Desenvolvimento',
        nextAction: 'Separar 15 minutos no fim de semana para selecionar 3 fotos e 2 diretrizes.',
        estimatedMinutes: 30,
        deadlineType: 'Sem Prazo Fixo',
        costOfDelay: 'Nenhum dano prático imediato; risco de perda de direcionamento se esquecido.',
        definitionOfDone: 'Painel visual conciso salvo ou impresso.',
        aiDiagnosis: 'Desejo de alto valor inspiracional, sem prazo externo. Proteger no sábado para não competir com a semana útil.',
        eisenhowerQuadrant: 'Q2 (Estratégico / Não Urgente)',
        surgicalQuestion: 'Qual a menor versão de 20 minutos que já traz clareza de visão?'
      };
    }

    if (isOfficial) {
      return {
        category: 'TASK',
        domain: 'Casa/Vida',
        nextAction: 'Acessar o portal oficial em 10 minutos, pagar a taxa e agendar a data mais próxima.',
        estimatedMinutes: 15,
        deadlineType: 'Hard (Externo/Crítico)',
        costOfDelay: 'Vencimento de prazos legais, multa ou retrabalho burocrático.',
        definitionOfDone: 'Comprovante de confirmação baixado em PDF.',
        aiDiagnosis: 'Prazo externo rígido com consequência real. Executar com prioridade máxima para desocupar a mente.',
        eisenhowerQuadrant: 'Q1 (Urgente & Importante)',
        surgicalQuestion: 'O que falta para resolver isso agora em 10 minutos e tirar de vez da cabeça?'
      };
    }

    if (isHome) {
      return {
        category: 'TASK',
        domain: 'Casa/Vida',
        nextAction: 'Pegar ferramenta necessária e reapertar os parafusos após o almoço (ou mandar WhatsApp para prestador).',
        estimatedMinutes: 15,
        deadlineType: 'Soft (Autoimposto)',
        costOfDelay: 'Microfricção diária contínua drenando paciência.',
        definitionOfDone: 'Funcionamento físico suave sem emperramento.',
        aiDiagnosis: 'Atrito doméstico com baixa carga mental. Ideal para intervalo do almoço ou sábado de manhã.',
        eisenhowerQuadrant: 'Q3 (Urgente / Não Importante)',
        surgicalQuestion: 'Isso precisa da sua mão de obra ou pode ser terceirizado pelo WhatsApp em 2 minutos?'
      };
    }

    if (isTeam) {
      return {
        category: 'DELEGATED',
        domain: 'Liderança',
        nextAction: 'Enviar mensagem de alinhamento com critério de aceite e data de check-in combinada.',
        estimatedMinutes: 15,
        deadlineType: 'Hard (Externo/Crítico)',
        costOfDelay: 'Entrega desalinhada ou retrabalho de última hora.',
        definitionOfDone: 'Liderado autônomo e sem bloqueios técnicos.',
        aiDiagnosis: 'Gestão preventiva. Evita microgestão e protege o tempo nobre do líder.',
        eisenhowerQuadrant: 'Q1 (Urgente & Importante)',
        surgicalQuestion: 'A pessoa sabe exatamente qual é o resultado esperado ou vai precisar de você a cada etapa?'
      };
    }

    return {
      category: isMeeting ? 'EVENT' : title.length > 28 ? 'PROJECT' : 'TASK',
      domain: 'Trabalho',
      nextAction: `Esclarecer o primeiro passo físico de 5 minutos para "${title}"`,
      estimatedMinutes: 30,
      deadlineType: 'Soft (Autoimposto)',
      costOfDelay: 'Adiar decisão gera acúmulo e sobrecarga mental.',
      definitionOfDone: 'Critério a definir no momento do agendamento consciente.',
      aiDiagnosis: 'Capturada instantaneamente. A IA recomenda esclarecer a próxima ação física e verificar o orçamento biológico.',
      eisenhowerQuadrant: 'Q2 (Estratégico / Não Urgente)',
      surgicalQuestion: 'O que precisa acontecer primeiro e o que você terá que adiar se aceitar isso hoje?'
    };
  },

  async getSparringResponse(userMessage: string, posture: CoachPosture, contextSummary: string): Promise<string> {
    const apiKey = storageService.getApiKey();

    if (apiKey) {
      try {
        const systemPrompt = `Você é o KAIROS OS, um sparring partner cognitivo para líderes e profissionais exigentes.
Sua postura configurada é: "${posture}".
Princípios fundamentais:
- Você é consultivo, lúcido, firme e respeitoso.
- Você discorda fundamentadamente do usuário quando ele assume compromissos além da sua capacidade biológica.
- Você investiga a procrastinação com curiosidade (medo de errar, perfeccionismo, tarefa vaga, cansaço), NUNCA presumindo preguiça.
- Você ajuda o usuário a dizer NÃO com diplomacia e a delegar com critérios de conclusão claros.
- Responda em 1 a 3 parágrafos curtos, objetivos e práticos, sem bajulação, positividade artificial ou clichês corporativos.

Contexto atual do usuário:
${contextSummary}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nMensagem do usuário: "${userMessage}"` }]
              }
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 350
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return reply;
        }
      } catch (err) {
        console.warn('Erro ao chamar Gemini, fallback local:', err);
      }
    }

    // Respostas offline comportamentais
    const lower = userMessage.toLowerCase();
    if (lower.includes('sobrecarregado') || lower.includes('corte') || lower.includes('cortar')) {
      return posture === 'Guardião Firme'
        ? '🛡️ Diagnóstico de Sobrecarga:\nQuando tudo é prioritário, nada é. Recomendo cancelar estudos hoje e manter estritamente: 1. Marcar a Prova do Detran (12 min, vence hoje); 2. Enviar a mensagem para a Lívia (5 min). O restante está formalmente autorizado a esperar amanhã. Respire e preserve sua energia.'
        : '🤝 Compreendo a pressão. Vamos tirar o peso das costas: escolha apenas 1 única vitória leve para o resto do dia e libere a culpa pelas outras demandas.';
    }

    if (lower.includes('banheiro') || lower.includes('porta')) {
      return '🔍 Análise de Fricção:\nVocê adiou arrumar a porta 4 vezes pelo atrito de buscar a chave de fenda e quebrar seu fluxo mental. Decisão binária: ou você faz uma intervenção de 5 minutos logo após o almoço hoje, ou delega/terceiriza por WhatsApp agora. Qual das duas opções desocupa sua cabeça mais rápido?';
    }

    if (lower.includes('fechamento') || lower.includes('shutdown') || lower.includes('encerrar')) {
      return '🌙 Ritual de Encerramento (Shutdown Ritual):\n1. Nenhuma pendência crítica de hoje ficou sem próximo passo definido.\n2. Sua equipe tem autonomia até o check-in de quinta.\n3. Desconecte o modo trabalho. Descanso e lazer são requisitos biológicos inegociáveis para sua liderança amanhã.';
    }

    if (lower.includes('recusa') || lower.includes('diretor') || lower.includes('não')) {
      return '🛡️ Estratégia do Sim Condicional:\n"Diretor, consigo assumir a revisão dessa proposta sim! Como minha tarde já possui compromissos de prazo fixo inadiáveis, proponho entregá-la até amanhã às 10h. Faz sentido para você essa troca de prioridade?"';
    }

    return `Entendido. Sob a postura de ${posture}, pergunto: Qual é a única coisa que, se você fizer hoje, tornará seu dia um sucesso real e desatará o maior nó da sua semana?`;
  }
};
