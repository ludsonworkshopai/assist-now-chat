import type {
  Analyst,
  Article,
  Incident,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TimelineEvent,
} from "./types";

const H = 3600000;
const now = Date.now();
const iso = (hoursFromNow: number) => new Date(now + hoursFromNow * H).toISOString();

export const analysts: Analyst[] = [
  {
    id: "a1",
    nome: "Marina Alves",
    email: "marina.alves@empresa.com.br",
    cargo: "Analista de Suporte N2",
    unidade: "Matriz - São Paulo",
    disponivel: true,
  },
  {
    id: "a2",
    nome: "Rafael Costa",
    email: "rafael.costa@empresa.com.br",
    cargo: "Técnico de Campo",
    unidade: "Filial - Campinas",
    disponivel: true,
  },
  {
    id: "a3",
    nome: "Juliana Prado",
    email: "juliana.prado@empresa.com.br",
    cargo: "Analista de Infraestrutura",
    unidade: "Matriz - São Paulo",
    disponivel: false,
  },
  {
    id: "a4",
    nome: "Diego Martins",
    email: "diego.martins@empresa.com.br",
    cargo: "Coordenador de TI",
    unidade: "Matriz - São Paulo",
    disponivel: true,
  },
];

export const unidades = [
  "Matriz - São Paulo",
  "Filial - Campinas",
  "Filial - Belo Horizonte",
  "Centro de Distribuição",
  "Remoto",
];

const solicitantes: [string, string, string][] = [
  ["Carla Ribeiro", "carla.ribeiro@empresa.com.br", "Financeiro"],
  ["Paulo Henrique", "paulo.h@empresa.com.br", "Comercial"],
  ["Fernanda Lima", "fernanda.lima@empresa.com.br", "RH"],
  ["Bruno Tavares", "bruno.tavares@empresa.com.br", "Logística"],
  ["Aline Souza", "aline.souza@empresa.com.br", "Marketing"],
  ["Ricardo Nunes", "ricardo.nunes@empresa.com.br", "Operações"],
  ["Tatiane Rocha", "tatiane.rocha@empresa.com.br", "Jurídico"],
  ["Marcos Vinícius", "marcos.v@empresa.com.br", "Compras"],
];

interface Seed {
  titulo: string;
  descricao: string;
  categoria: TicketCategory;
  subcategoria: string;
  equipamento?: string;
  status: TicketStatus;
  prioridade: TicketPriority;
  criadoHa: number; // horas
  slaEm: number; // horas a partir de agora
  responsavel: string | null;
  tags: string[];
  impacto: string;
}

const seeds: Seed[] = [
  {
    titulo: "Internet instável no 3º andar",
    descricao:
      "A conexão cai a cada poucos minutos e não consigo participar das reuniões online. Já reiniciei o notebook.",
    categoria: "internet",
    subcategoria: "Wi-Fi corporativo",
    status: "em_andamento",
    prioridade: "critica",
    criadoHa: 5,
    slaEm: -1.5,
    responsavel: "Juliana Prado",
    tags: ["rede", "wi-fi", "recorrente"],
    impacto: "Impede o trabalho agora",
  },
  {
    titulo: "Impressora do setor com erro de papel",
    descricao: "A impressora mostra 'atolamento de papel' mesmo depois de retirar todas as folhas.",
    categoria: "impressora",
    subcategoria: "Atolamento",
    equipamento: "HP LaserJet M428",
    status: "aguardando_atendimento",
    prioridade: "media",
    criadoHa: 9,
    slaEm: 3,
    responsavel: null,
    tags: ["impressora"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Não consigo acessar o ERP",
    descricao: "Ao entrar no sistema aparece a mensagem 'usuário sem permissão' desde ontem à noite.",
    categoria: "acesso",
    subcategoria: "Permissão de sistema",
    status: "triagem",
    prioridade: "alta",
    criadoHa: 2,
    slaEm: 1.2,
    responsavel: null,
    tags: ["erp", "permissão"],
    impacto: "Impede o trabalho agora",
  },
  {
    titulo: "Computador muito lento ao abrir planilhas",
    descricao: "Demora mais de 5 minutos para abrir planilhas grandes e trava com frequência.",
    categoria: "hardware",
    subcategoria: "Desempenho",
    equipamento: "Dell OptiPlex 7090",
    status: "em_andamento",
    prioridade: "media",
    criadoHa: 26,
    slaEm: 6,
    responsavel: "Marina Alves",
    tags: ["desempenho"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Solicitação de notebook para novo colaborador",
    descricao: "Novo analista começa na próxima segunda e precisa de notebook, headset e monitor.",
    categoria: "equipamento",
    subcategoria: "Novo colaborador",
    status: "aguardando_solicitante",
    prioridade: "baixa",
    criadoHa: 40,
    slaEm: 28,
    responsavel: "Rafael Costa",
    tags: ["onboarding"],
    impacto: "Posso aguardar",
  },
  {
    titulo: "E-mails não estão sendo enviados",
    descricao: "Todas as mensagens ficam na caixa de saída com erro de servidor.",
    categoria: "email",
    subcategoria: "Envio de mensagens",
    status: "novo",
    prioridade: "alta",
    criadoHa: 0.6,
    slaEm: 1.8,
    responsavel: null,
    tags: ["outlook"],
    impacto: "Impede o trabalho agora",
  },
  {
    titulo: "Monitor secundário não é reconhecido",
    descricao: "Conectei o cabo HDMI e o segundo monitor continua sem sinal.",
    categoria: "hardware",
    subcategoria: "Periféricos",
    equipamento: "Monitor LG 24''",
    status: "aguardando_atendimento",
    prioridade: "baixa",
    criadoHa: 30,
    slaEm: 20,
    responsavel: null,
    tags: ["periférico"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "VPN desconecta ao acessar arquivos",
    descricao: "Trabalhando de casa, a VPN cai sempre que abro a pasta compartilhada.",
    categoria: "internet",
    subcategoria: "VPN",
    status: "em_andamento",
    prioridade: "alta",
    criadoHa: 12,
    slaEm: 0.7,
    responsavel: "Juliana Prado",
    tags: ["vpn", "remoto"],
    impacto: "Impede o trabalho agora",
  },
  {
    titulo: "Senha do sistema de ponto bloqueada",
    descricao: "Errei a senha três vezes e o acesso foi bloqueado.",
    categoria: "acesso",
    subcategoria: "Reset de senha",
    status: "resolvido",
    prioridade: "media",
    criadoHa: 20,
    slaEm: -8,
    responsavel: "Marina Alves",
    tags: ["senha"],
    impacto: "Impede o trabalho agora",
  },
  {
    titulo: "Toner da impressora acabando",
    descricao: "A impressora está avisando nível baixo de toner preto.",
    categoria: "impressora",
    subcategoria: "Suprimentos",
    equipamento: "Brother HL-L6400",
    status: "encerrado",
    prioridade: "baixa",
    criadoHa: 60,
    slaEm: -30,
    responsavel: "Rafael Costa",
    tags: ["suprimento"],
    impacto: "Posso aguardar",
  },
  {
    titulo: "Teclado com teclas sem resposta",
    descricao: "As teclas F5 e Enter pararam de funcionar.",
    categoria: "hardware",
    subcategoria: "Periféricos",
    equipamento: "Teclado Logitech K120",
    status: "novo",
    prioridade: "baixa",
    criadoHa: 3,
    slaEm: 22,
    responsavel: null,
    tags: ["periférico"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Acesso ao CRM negado após atualização",
    descricao: "Depois da atualização de ontem, o CRM não aceita meu login corporativo.",
    categoria: "acesso",
    subcategoria: "Login corporativo",
    status: "em_andamento",
    prioridade: "critica",
    criadoHa: 7,
    slaEm: -0.4,
    responsavel: null,
    tags: ["crm", "sso"],
    impacto: "Impede o trabalho agora",
  },
  {
    titulo: "Wi-Fi não aparece na recepção",
    descricao: "A rede corporativa sumiu da lista de redes disponíveis.",
    categoria: "internet",
    subcategoria: "Wi-Fi corporativo",
    status: "triagem",
    prioridade: "media",
    criadoHa: 4,
    slaEm: 4,
    responsavel: "Marina Alves",
    tags: ["wi-fi"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Solicitação de segundo monitor",
    descricao: "Preciso de um monitor adicional para trabalhar com planilhas e sistema ao mesmo tempo.",
    categoria: "equipamento",
    subcategoria: "Upgrade de estação",
    status: "aguardando_atendimento",
    prioridade: "baixa",
    criadoHa: 50,
    slaEm: 40,
    responsavel: null,
    tags: ["equipamento"],
    impacto: "Posso aguardar",
  },
  {
    titulo: "Caixa de e-mail cheia",
    descricao: "Recebo aviso de armazenamento esgotado e não consigo receber mensagens.",
    categoria: "email",
    subcategoria: "Armazenamento",
    status: "resolvido",
    prioridade: "media",
    criadoHa: 33,
    slaEm: -20,
    responsavel: "Diego Martins",
    tags: ["outlook", "quota"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Computador não liga após queda de energia",
    descricao: "Depois da queda de energia o computador não dá sinal nenhum.",
    categoria: "hardware",
    subcategoria: "Não liga",
    equipamento: "Lenovo ThinkCentre",
    status: "aguardando_atendimento",
    prioridade: "critica",
    criadoHa: 1.2,
    slaEm: 1,
    responsavel: null,
    tags: ["urgente"],
    impacto: "Impede o trabalho agora",
  },
  {
    titulo: "Impressora não conecta na rede",
    descricao: "A impressora aparece offline em todos os computadores do setor.",
    categoria: "impressora",
    subcategoria: "Conexão de rede",
    equipamento: "Epson L15150",
    status: "em_andamento",
    prioridade: "alta",
    criadoHa: 16,
    slaEm: 2.5,
    responsavel: "Rafael Costa",
    tags: ["impressora", "rede"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Solicitação de acesso à pasta compartilhada",
    descricao: "Preciso de acesso à pasta do time de Compras para conferir contratos.",
    categoria: "acesso",
    subcategoria: "Pasta de rede",
    status: "aguardando_solicitante",
    prioridade: "baixa",
    criadoHa: 22,
    slaEm: 12,
    responsavel: "Marina Alves",
    tags: ["arquivos"],
    impacto: "Posso aguardar",
  },
  {
    titulo: "Headset sem áudio nas reuniões",
    descricao: "O microfone funciona, mas não escuto nada pelo headset.",
    categoria: "hardware",
    subcategoria: "Áudio",
    equipamento: "Headset Jabra Evolve",
    status: "novo",
    prioridade: "media",
    criadoHa: 1.8,
    slaEm: 5,
    responsavel: null,
    tags: ["áudio"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Lentidão geral na rede do CD",
    descricao: "Todos os terminais do centro de distribuição estão lentos desde a manhã.",
    categoria: "internet",
    subcategoria: "Desempenho de rede",
    status: "em_andamento",
    prioridade: "critica",
    criadoHa: 6,
    slaEm: 0.3,
    responsavel: "Diego Martins",
    tags: ["rede", "incidente"],
    impacto: "Impede o trabalho agora",
  },
  {
    titulo: "Erro ao gerar relatório no BI",
    descricao: "Aparece a mensagem 'tempo limite excedido' ao gerar o relatório mensal.",
    categoria: "acesso",
    subcategoria: "Business Intelligence",
    status: "triagem",
    prioridade: "media",
    criadoHa: 10,
    slaEm: 7,
    responsavel: null,
    tags: ["bi"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Notebook com bateria viciada",
    descricao: "A bateria dura menos de 20 minutos fora da tomada.",
    categoria: "hardware",
    subcategoria: "Bateria",
    equipamento: "Dell Latitude 5420",
    status: "resolvido",
    prioridade: "baixa",
    criadoHa: 70,
    slaEm: -40,
    responsavel: "Rafael Costa",
    tags: ["notebook"],
    impacto: "Posso aguardar",
  },
  {
    titulo: "E-mails legítimos indo para spam",
    descricao: "Mensagens de clientes estão caindo na pasta de lixo eletrônico.",
    categoria: "email",
    subcategoria: "Filtro de spam",
    status: "em_andamento",
    prioridade: "media",
    criadoHa: 28,
    slaEm: 9,
    responsavel: "Juliana Prado",
    tags: ["spam"],
    impacto: "Atrapalha, mas consigo trabalhar",
  },
  {
    titulo: "Solicitação de celular corporativo",
    descricao: "Time comercial precisa de um aparelho para atendimento externo.",
    categoria: "equipamento",
    subcategoria: "Telefonia",
    status: "novo",
    prioridade: "baixa",
    criadoHa: 4.5,
    slaEm: 44,
    responsavel: null,
    tags: ["telefonia"],
    impacto: "Posso aguardar",
  },
];

function buildTicket(seed: Seed, index: number): Ticket {
  const [nome, email, setor] = solicitantes[index % solicitantes.length]!;
  const unidade = unidades[index % unidades.length]!;
  const criadoEm = iso(-seed.criadoHa);
  const timeline: TimelineEvent[] = [
    {
      id: `${index}-t0`,
      tipo: "criacao",
      autor: nome,
      mensagem: "Chamado registrado pelo assistente virtual da Central de TI.",
      data: criadoEm,
    },
  ];
  if (seed.responsavel) {
    timeline.push({
      id: `${index}-t1`,
      tipo: "atribuicao",
      autor: "Central de TI",
      mensagem: `Chamado atribuído a ${seed.responsavel}.`,
      data: iso(-seed.criadoHa + 0.4),
    });
    timeline.push({
      id: `${index}-t2`,
      tipo: "comentario",
      autor: seed.responsavel,
      mensagem: "Estamos analisando o caso e retornaremos em breve com uma atualização.",
      data: iso(-seed.criadoHa + 0.6),
    });
  }
  if (seed.status === "resolvido" || seed.status === "encerrado") {
    timeline.push({
      id: `${index}-t3`,
      tipo: "resolucao",
      autor: seed.responsavel ?? "Central de TI",
      mensagem: "Solução aplicada e validada com o solicitante.",
      data: iso(-seed.criadoHa + 3),
    });
  }
  const concluido = seed.status === "resolvido" || seed.status === "encerrado";
  return {
    id: String(index + 1),
    numero: `#${10240 + index}`,
    titulo: seed.titulo,
    descricao: seed.descricao,
    categoria: seed.categoria,
    subcategoria: seed.subcategoria,
    equipamento: seed.equipamento,
    status: seed.status,
    prioridade: seed.prioridade,
    solicitante: nome,
    contato: `${email} · ${setor}`,
    unidade,
    local: unidade === "Remoto" ? "Atendimento remoto" : `${(index % 5) + 1}º andar · Sala ${100 + index}`,
    responsavel: seed.responsavel,
    criadoEm,
    atualizadoEm: iso(-Math.max(0.2, seed.criadoHa / 3)),
    slaLimite: iso(seed.slaEm),
    primeiraRespostaMin: seed.responsavel ? 12 + (index % 7) * 9 : null,
    resolucaoMin: concluido ? 120 + (index % 6) * 65 : null,
    tags: seed.tags,
    impacto: seed.impacto,
    timeline,
  };
}

export const articles: Article[] = [
  {
    id: "kb1",
    titulo: "Como reconectar-se ao Wi-Fi corporativo",
    resumo: "Passo a passo para esquecer e reconectar a rede da empresa em Windows e macOS.",
    conteudo:
      "1. Abra as configurações de rede.\n2. Esqueça a rede 'Empresa-Corp'.\n3. Reconecte usando seu login corporativo.\n4. Se o problema persistir, reinicie o adaptador de rede e abra um chamado.",
    categoria: "internet",
    visualizacoes: 1284,
    atualizadoEm: iso(-70),
  },
  {
    id: "kb2",
    titulo: "Resolver atolamento de papel na impressora",
    resumo: "Como liberar o papel preso com segurança e reiniciar a fila de impressão.",
    conteudo:
      "1. Desligue a impressora.\n2. Abra as tampas frontal e traseira e retire o papel com cuidado, sem rasgar.\n3. Ligue novamente e limpe a fila de impressão no computador.",
    categoria: "impressora",
    visualizacoes: 942,
    atualizadoEm: iso(-120),
  },
  {
    id: "kb3",
    titulo: "Desbloquear senha de sistemas internos",
    resumo: "O que fazer quando o acesso é bloqueado após tentativas incorretas.",
    conteudo:
      "O bloqueio é liberado automaticamente após 30 minutos. Para liberação imediata, abra um chamado informando o sistema e seu usuário de rede.",
    categoria: "acesso",
    visualizacoes: 2310,
    atualizadoEm: iso(-40),
  },
  {
    id: "kb4",
    titulo: "Computador lento: primeiros cuidados",
    resumo: "Checklist rápido antes de abrir um chamado de desempenho.",
    conteudo:
      "Reinicie o computador, feche abas e programas não utilizados, verifique o espaço livre em disco e confirme se há atualizações pendentes.",
    categoria: "hardware",
    visualizacoes: 771,
    atualizadoEm: iso(-15),
  },
  {
    id: "kb5",
    titulo: "Configurar o e-mail corporativo no celular",
    resumo: "Guia de configuração do Outlook móvel com autenticação em dois fatores.",
    conteudo:
      "Baixe o Outlook, adicione a conta corporativa, informe o e-mail completo e aprove a autenticação em dois fatores pelo aplicativo Authenticator.",
    categoria: "email",
    visualizacoes: 528,
    atualizadoEm: iso(-8),
  },
  {
    id: "kb6",
    titulo: "Como solicitar novo equipamento",
    resumo: "Fluxo de solicitação, prazos médios e aprovações necessárias.",
    conteudo:
      "Abra um chamado da categoria 'Solicitação de equipamento' informando o item, a justificativa e o gestor aprovador.",
    categoria: "equipamento",
    visualizacoes: 305,
    atualizadoEm: iso(-3),
  },
];

export const incidents: Incident[] = [
  {
    id: "inc1",
    categoria: "internet",
    unidade: "Matriz - São Paulo",
    mensagem:
      "Já identificamos uma instabilidade de internet nesta unidade. A equipe está trabalhando nisso.",
    ativo: true,
  },
  {
    id: "inc2",
    categoria: "impressora",
    unidade: "Filial - Campinas",
    mensagem: "O servidor de impressão está em manutenção programada até o fim da tarde.",
    ativo: true,
  },
];

export const tickets: Ticket[] = seeds.map(buildTicket);

let counter = tickets.length;

export function nextTicketNumber() {
  counter += 1;
  return `#${10240 + counter}`;
}
