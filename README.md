# Assistente de TI Amigo

Crie uma aplicação web moderna e responsiva para gestão de chamados de TI corporativa. O foco é tornar a abertura de chamados extremamente simples para qualquer colaborador e fornecer à equipe de TI uma visão operacional clara, rápida e orientada à ação.

Nome provisório do sistema: Central de TI

Diretrizes gerais de UX/UI:

Interface em português do Brasil.

Design clean, corporativo e acolhedor, com aparência SaaS moderna.

Priorizar clareza, baixa carga cognitiva, hierarquia visual e acessibilidade.

Layout totalmente responsivo para desktop, tablet e celular.

Utilizar componentes consistentes, feedbacks visuais, estados de carregamento, mensagens de sucesso/erro e empty states bem desenhados.

Evitar excesso de informações, textos longos e formulários tradicionais cansativos.

Paleta sugerida: azul como cor primária, tons neutros claros para fundo, verde para concluído/sucesso, amarelo ou laranja para atenção e vermelho apenas para urgências, erros e atrasos.

Tipografia moderna, legível e com ótimo contraste.

Ícones intuitivos e discretos; use rótulos textuais junto dos ícones quando necessário.

Aplicar design pré-cognitivo: destacar visualmente o que exige ação, agrupar informações relacionadas, usar padrões conhecidos e reduzir decisões desnecessárias.

Estruture a aplicação em duas experiências principais:

1. Tela pública: abertura de chamado por conversa

Esta é a página inicial do sistema e não requer login. Ela deve funcionar como uma conversa guiada com um assistente virtual de TI, semelhante a um chat moderno e amigável.

Objetivo: entender o problema com poucas perguntas, de forma direta, inteligente e contextual, sem fazer o usuário preencher um formulário longo.

Layout:

Cabeçalho simples com logo “Central de TI” e uma opção discreta “Acesso da equipe de TI”.

Área central em formato de chat, com largura confortável e foco total na conversa.

Mensagem inicial do assistente: “Olá! Vou ajudar você a registrar seu chamado. O que está acontecendo?”

Balões de conversa distintos para usuário e assistente.

Campo de mensagem fixo na parte inferior, com botão de enviar.

Sugestões rápidas clicáveis abaixo da primeira pergunta, por exemplo:

“Meu computador não liga”

“Problema com internet”

“Não consigo acessar um sistema”

“Impressora com erro”

“Solicitar equipamento”

“Outro problema”

Indicador discreto de progresso, por exemplo “Etapa 2 de 4”, sem tornar a experiência burocrática.

O assistente deve adaptar as perguntas conforme a resposta do usuário.

Fluxo de perguntas esperado:

Entender o problema relatado pelo usuário.

Solicitar detalhes objetivos apenas quando necessário, como mensagem de erro, equipamento envolvido ou impacto no trabalho.

Identificar a urgência de maneira humana e simples, por exemplo: “Isso está impedindo você de trabalhar agora?”

Perguntar o local do atendimento, usando opções rápidas e alternativa de texto:

Escritório / unidade

Andar ou setor

Sala ou mesa

Atendimento remoto

Solicitar uma forma de contato, se ainda não estiver identificada.

Mostrar uma confirmação resumida antes de enviar:

Categoria identificada

Resumo do problema

Local

Urgência

Contato

Ao finalizar:

Exibir uma tela de sucesso clara e agradável.

Informar o número do chamado.

Mostrar expectativa de retorno, sem prometer prazo fixo.

Botões: “Acompanhar chamado” e “Abrir outro chamado”.

Caso exista um incidente geral já identificado, mostrar uma mensagem contextual antes de criar um chamado duplicado, por exemplo: “Já identificamos uma instabilidade de internet nesta unidade. A equipe está trabalhando nisso.”

Tom do assistente:

Direto, educado, empático e objetivo.

Não fazer perguntas redundantes.

Usar linguagem simples e não técnica.

Priorizar perguntas de múltipla escolha quando isso acelerar a coleta de informações.

Permitir que o usuário digite livremente a qualquer momento.

2. Área autenticada: dashboard da equipe de TI

Criar uma área protegida por login e senha para analistas, técnicos e gestores de TI.

Tela de login

Página minimalista e profissional.

Logo do sistema, campo de e-mail corporativo, senha, opção “Lembrar de mim”, “Esqueci minha senha” e botão principal “Entrar”.

Exibir mensagens de validação claras.

Aplicar boa acessibilidade em campos e foco de teclado.

Estrutura da dashboard

Criar uma barra lateral fixa no desktop e recolhível no mobile, contendo:

Visão geral

Chamados

Novo chamado

Base de conhecimento

Relatórios

Equipe

Configurações

No topo, incluir:

Busca global por número, usuário, local ou assunto do chamado.

Botão de notificações.

Perfil do usuário logado.

Ação rápida “Novo chamado”.

Página inicial da dashboard: visão geral

A primeira tela deve mostrar imediatamente o que precisa ser tratado. O conteúdo prioritário é a operação do dia.

Topo da página:

Saudação curta, como “Bom dia, equipe”.

Resumo operacional: “Você possui 12 chamados pendentes de atendimento hoje.”

Filtros de período e unidade/localização.

Cards de indicadores:

Chamados abertos

Chamados aguardando atendimento

Chamados em andamento

Chamados críticos ou vencidos

Chamados resolvidos no período

Tempo médio de primeira resposta

Tempo médio de resolução

Percentual de SLA atendido

Usar indicadores com cores semânticas, ícones sutis e comparativos com o período anterior.

Seção de prioridade máxima:

Um painel destacado chamado “Requer atenção agora”.

Listar chamados críticos, atrasados ou sem responsável.

Cada item deve mostrar: prioridade, número do chamado, resumo, solicitante, local, responsável, tempo em aberto e status.

Permitir ações rápidas: “Assumir”, “Atualizar status” e “Ver chamado”.

Gráficos:

Gráfico de linha ou área: volume de chamados por dia.

Gráfico de barras: chamados por categoria.

Gráfico de rosca: distribuição por status.

Gráfico de barras horizontais: chamados por unidade/local.

Gráfico ou indicador de SLA: atendidos dentro e fora do prazo.

Os gráficos devem ter tooltips claros e filtros aplicáveis.

Tabela de chamados recentes:

Colunas: prioridade, número, título/resumo, solicitante, categoria, local, responsável, status, SLA e última atualização.

Permitir ordenação, filtros, busca e paginação.

Usar badges coloridas para prioridade e status.

Linhas clicáveis para abrir o detalhe completo do chamado.

Destacar chamados críticos, atrasados ou próximos do vencimento sem prejudicar a leitura.

Tela de lista de chamados

Criar uma lista completa e filtrável de chamados.

Filtros principais:

Status

Prioridade

Categoria

Responsável

Solicitante

Unidade/local

Período

SLA

Chamados sem responsável

Incluir visualização em tabela e opção de visualização em cards para dispositivos menores.

Tela de detalhes do chamado

Ao abrir um chamado, apresentar uma página organizada em duas colunas no desktop e uma coluna no celular.

Conteúdo principal:

Número e título do chamado.

Status, prioridade e SLA em destaque.

Descrição original fornecida pelo usuário.

Informações estruturadas capturadas pelo assistente virtual.

Solicitante, contato e local de atendimento.

Categoria, subcategoria e equipamento envolvido.

Linha do tempo completa: criação, atribuições, comentários, mudanças de status e resolução.

Área para adicionar comentário interno ou resposta ao solicitante.

Possibilidade de anexar arquivos.

Ações principais: assumir chamado, atribuir técnico, alterar prioridade, alterar status, solicitar mais informações, resolver e encerrar.

Painel lateral:

Responsável atual.

Prazo/SLA e contagem regressiva visual.

Tags.

Chamados relacionados.

Sugestões de artigos da base de conhecimento.

Histórico do solicitante, quando aplicável.

Status sugeridos:

Novo

Triagem

Aguardando atendimento

Em andamento

Aguardando solicitante

Resolvido

Encerrado

Prioridades sugeridas:

Baixa

Média

Alta

Crítica

Base de conhecimento

Criar uma tela de artigos e soluções frequentes:

Busca em destaque.

Categorias visuais.

Cards de artigos populares.

Área de artigos recentes.

Ação para criar ou editar artigo pela equipe de TI.

Os artigos devem poder ser sugeridos automaticamente no detalhe de um chamado.

Dados de demonstração

Preencher a interface com dados fictícios realistas para demonstrar a experiência:

Chamados de internet, impressora, acesso a sistemas, computador lento, solicitação de equipamento e falha de e-mail.

Diferentes níveis de prioridade, status, responsáveis e unidades.

Incluir alguns chamados críticos e com SLA próximo do vencimento para demonstrar os alertas.

Critérios finais:

A abertura de chamado deve parecer rápida e natural, não um formulário disfarçado.

A dashboard deve permitir que um técnico identifique as prioridades em poucos segundos.

Criar transições suaves e discretas.

Garantir contraste adequado, navegação por teclado e textos legíveis.

Construir a interface com componentes reutilizáveis e estados completos: vazio, carregando, erro, sucesso e sem resultados.

Não implementar integrações reais neste momento; utilizar dados mockados e fluxos navegáveis.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c6ac853d-abcc-4dce-861c-d1cb94f3ca2b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
