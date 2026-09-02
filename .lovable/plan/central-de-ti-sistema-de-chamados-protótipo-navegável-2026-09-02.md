# Central de TI — sistema de chamados (protótipo navegável)

Aplicação web responsiva em português do Brasil, com duas experiências: abertura de chamado por conversa (pública) e dashboard operacional da equipe de TI (com login simulado). Tudo com dados fictícios, sem integrações reais.

## Identidade visual

- Azul corporativo como cor primária, fundo neutro claro, verde para sucesso/resolvido, âmbar para atenção, vermelho apenas para crítico/atraso/erro.
- Tipografia moderna e legível (fonte sem serifa geométrica para títulos + fonte de texto de alta legibilidade), boa hierarquia e contraste AA.
- Tokens semânticos no design system (cores, raios, sombras suaves), badges de status/prioridade padronizadas, transições curtas e discretas.
- Ícones discretos com rótulos textuais quando o significado não for óbvio.

## 1. Tela pública — abertura por conversa (`/`)

- Cabeçalho com logo "Central de TI" e link discreto "Acesso da equipe de TI".
- Área central de chat: mensagem inicial do assistente, balões distintos para usuário e assistente, indicador de digitação, campo fixo no rodapé.
- Sugestões rápidas clicáveis (computador não liga, internet, acesso a sistema, impressora, solicitar equipamento, outro).
- Indicador leve "Etapa X de 4".
- Fluxo guiado por script determinístico com ramificações por categoria: problema → detalhe objetivo → impacto/urgência ("Isso está impedindo você de trabalhar agora?") → local (unidade, andar/setor, sala/mesa ou remoto) → contato.
- Digitação livre permitida a qualquer momento; opções de múltipla escolha priorizadas.
- Aviso contextual de incidente geral quando a categoria coincidir com um incidente ativo mockado (ex.: instabilidade de internet na unidade).
- Cartão de confirmação (categoria, resumo, local, urgência, contato) antes do envio, com opção de corrigir.
- Tela de sucesso: número do chamado, expectativa de retorno sem prazo fixo, botões "Acompanhar chamado" e "Abrir outro chamado".
- Página de acompanhamento simples por número do chamado (`/acompanhar`), somente leitura.

## 2. Área da equipe de TI

- `/login`: página minimalista, e-mail corporativo, senha, "Lembrar de mim", "Esqueci minha senha", validações claras, foco de teclado correto. Autenticação simulada (usuário demo exibido na tela).
- Layout com barra lateral fixa no desktop e recolhível no mobile: Visão geral, Chamados, Novo chamado, Base de conhecimento, Relatórios, Equipe, Configurações.
- Topbar: busca global (número, solicitante, local, assunto), notificações, perfil, ação rápida "Novo chamado".

### Visão geral (`/app`)
- Saudação + resumo operacional do dia; filtros de período e unidade.
- Cards de indicadores: abertos, aguardando, em andamento, críticos/vencidos, resolvidos no período, tempo médio de primeira resposta, tempo médio de resolução, % SLA — com cor semântica e comparativo com período anterior.
- Painel "Requer atenção agora": críticos, atrasados e sem responsável, com ações rápidas Assumir / Atualizar status / Ver chamado.
- Gráficos (Recharts): volume por dia (área), por categoria (barras), por status (rosca), por unidade (barras horizontais), SLA dentro/fora do prazo.
- Tabela de chamados recentes com ordenação, filtro, busca, paginação, badges e linhas clicáveis.

### Chamados (`/app/chamados`)
- Lista filtrável: status, prioridade, categoria, responsável, solicitante, unidade, período, SLA, sem responsável.
- Alternância tabela ↔ cards (cards automáticos em telas pequenas), chips de filtros ativos, estado "sem resultados".

### Detalhe (`/app/chamados/$id`)
- Duas colunas no desktop, uma no mobile.
- Principal: número, título, status/prioridade/SLA em destaque, descrição original, dados estruturados do assistente, solicitante/contato/local, categoria/subcategoria/equipamento, linha do tempo completa, caixa de comentário (interno x resposta ao solicitante), anexos (mock).
- Ações: assumir, atribuir técnico, alterar prioridade, alterar status, solicitar informações, resolver, encerrar.
- Lateral: responsável, contagem regressiva de SLA, tags, chamados relacionados, artigos sugeridos, histórico do solicitante.
- Status: Novo, Triagem, Aguardando atendimento, Em andamento, Aguardando solicitante, Resolvido, Encerrado. Prioridades: Baixa, Média, Alta, Crítica.

### Demais telas
- `/app/novo`: abertura manual pela equipe (formulário curto em etapas).
- `/app/base-conhecimento` e detalhe do artigo: busca em destaque, categorias visuais, populares, recentes, criar/editar artigo.
- `/app/relatorios`: gráficos consolidados e exportação simulada.
- `/app/equipe`: analistas, carga de chamados, disponibilidade.
- `/app/configuracoes`: preferências, SLA, categorias, unidades (mock).

## Dados de demonstração

Conjunto fictício realista: ~40 chamados cobrindo internet, impressora, acesso a sistemas, computador lento, solicitação de equipamento e falha de e-mail; prioridades, status, responsáveis e unidades variados; alguns críticos, atrasados e com SLA próximo do vencimento; artigos da base; incidentes ativos; usuários da equipe.

## Detalhes técnicos

- TanStack Start + TanStack Router (rotas em `src/routes`), TanStack Query para leituras, Tailwind v4 + shadcn/ui, Recharts para gráficos, sonner para toasts.
- Estado mockado em memória (`src/data/*`) exposto por funções assíncronas simuladas, com pequeno atraso para exibir estados de carregamento; mutações (assumir, status, comentário) atualizam o store e invalidam as queries.
- Sessão simulada em `localStorage` + guarda de rota client-side para `/app/*`; nenhuma dependência de backend.
- Componentes reutilizáveis: `StatusBadge`, `PriorityBadge`, `SlaIndicator`, `KpiCard`, `TicketTable`, `TicketCard`, `EmptyState`, `LoadingState`, `ErrorState`, `ChatBubble`, `QuickReplies`.
- Metadados `head()` próprios por rota, foco visível, navegação por teclado e ARIA nos componentes interativos.
