# PanteraBot

Este é o repositório do **PanteraBot**, um bot desenvolvido especialmente para a **FURIA** como parte de um desafio técnico. O projeto integra comunicação via WhatsApp, interações com Twitch e funcionalidades assistidas por IA, utilizando uma arquitetura moderna e escalável com o NestJS.

Repositório oficial: [https://github.com/Grillekkj/pantera-bot](https://github.com/Grillekkj/pantera-bot)

## 🚀 Tecnologias Utilizadas

* [NestJS](https://nestjs.com/) — Framework progressivo para construção de aplicações Node.js escaláveis
* [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional robusto e open-source, utilizando TypeORM como ORM
* [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) — API para interagir com o WhatsApp Web
* [Twurple](https://twurple.js.org/) — API para integração com a Twitch
  * [Wrapper em NestJs](https://github.com/stimulcross/nestjs-twurple) — Utilizado o wrapper do Twurple para NestJs
* [Gemini API](https://ai.google.dev/gemini-api/) — API de IA da Google para interações inteligentes
* [Puppeteer](https://pptr.dev/) — Biblioteca para automação de navegador, usada no webscraping de notícias

## 💡 Funcionalidades
> Todas as opções de todos os menus do PanteraBot são interpretadas com auxílio de IA. Isso permite que os usuários escrevam com erros, variações ou sinônimos das opções e ainda assim tenham sua intenção corretamente compreendida.
### 📱 WhatsApp

* Integração com WhatsApp Web para comunicação bidirecional

* Menu inicial com mensagem de boas-vindas e apresentação das opções

* Últimas notícias da FURIA, extraídas automaticamente do site Draft5

* Histórico de partidas da FURIA, também extraído do site Draft5

* Sistema de alerta e agenda de partidas: o usuário recebe a lista de jogos e escolhe quais deseja acompanhar. Quando o jogo começa, ele é notificado com uma mensagem personalizada

* Chat com jogadores da FURIA simulado via integração com a Gemini API

* Acesso ao link da loja oficial da FURIA

### 🎮 Twitch

* Conversação com IA do **Pantera Bot** na Twitch ao citar "Pantera" na mensagem ou ao marcar a conta do bot

## ⚙️ Como executar o projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/Grillekkj/pantera-bot.git
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd pantera-bot
   ```

3. Preencha as variáveis de ambiente no arquivo `.env` (baseie-se no `.env.example`)

4. Crie um banco de dados com o mesmo nome da `.env`

5. Instale as dependências:

   ```bash
   npm install
   ```
   
6. Rode as migrations do banco de dados:

   ```bash
   npm run migration:run
   ```

7. Rode as seeds do banco de dados:

   ```bash
   npm run seed:run
   ```

8. Caso esteja desenvolvendo, inicie o projeto com:

   ```bash
   npm run start:dev
   ```

   Caso seja para produção, primeiro faça o build do projeto e depois inicie o ambiente de produção:

   ```bash
   npm run build
   npm run start:prod
   ```

## 📁 Estrutura do Projeto

```
pantera-bot/
├── src/
│   ├── app.module.ts                 # Módulo principal da aplicação
│   ├── app.service.ts                # Serviço principal da aplicação (roteador de mensagens)
│   ├── main.ts                       # Ponto de entrada da aplicação
│   ├── common/                       # Interfaces comuns
│   │   └── message-handler/          # Interfaces para tratadores de mensagens
│   ├── configs/                      # Arquivos de configuração
│   │   ├── environment.ts            # Variáveis de ambiente
│   │   ├── gemini-client.config.ts   # Configuração do cliente Gemini AI
│   │   ├── typeorm.ts                # Configuração da conexão com o banco de dados
│   │   └── whatsapp-client.config.ts # Configuração do cliente WhatsApp
│   ├── infra/                        # Módulos de infraestrutura
│   │   ├── database/                 # Código relacionado ao banco de dados
│   │   ├── gemini-client/            # Cliente da API Gemini AI
│   │   ├── twitch-client/            # Integração com a Twitch
│   │   └── whatsapp-client/          # Cliente do WhatsApp
│   ├── modules/                      # Módulos de funcionalidades
│   │   ├── draft5-scrapper/          # Web scraper para notícias da FURIA
│   │   ├── furia-ai-chat/            # Chat de IA com jogadores da FURIA
│   │   ├── games-history/            # Funcionalidades de histórico de jogos
│   │   ├── latest-news/              # Funcionalidades de últimas notícias
│   │   ├── match-alerts-schedule/    # Alertas de partidas e agendamento
│   │   └── official-store/           # Integração com a loja oficial
│   └── utils/                        # Funções utilitárias
│       ├── menu.ts                   # Definição do menu principal
│       └── toCase.ts                 # Utilitários para conversão de string
├── .env                              # Variáveis de ambiente (não versionado)
├── .env.example                      # Exemplo de variáveis de ambiente
├── .gitignore                        # Arquivo de exclusão do Git
├── .prettierrc                       # Configuração do Prettier
├── eslint.config.mjs                 # Configuração do ESLint
├── nest-cli.json                     # Configuração do CLI do NestJS
├── package.json                      # Dependências do projeto
├── tsconfig.build.json               # Configuração de build do TypeScript
├── tsconfig.json                     # Configuração geral do TypeScript
```
## 📌 Próximos Passos

1. **Melhoria na Escuta de Mensagens e Gerenciamento de Menus**  
   - **Como faria:** Refatoraria o `WhatsappClientService` para expor uma função pública que recebe um handler externo responsável por lidar com mensagens recebidas. Isso permite desacoplar a lógica de escuta do WhatsApp da lógica de fluxo de conversa (menus, comandos etc.), promovendo organização, reutilização e facilitando testes unitários.

2. **Integração com Loja da FURIA via WhatsApp**  
   - **Como faria:** Implementaria um fluxo de compra diretamente pelo WhatsApp, integrando com a API da loja da FURIA e um gateway de pagamento (como Stripe, Mercado Pago ou PagSeguro). O sistema acessaria o banco de dados de usuários para identificar ou registrar o comprador. Inicialmente, o bot enviaria um menu com categorias de produtos; ao selecionar uma, exibiria imagens dos itens disponíveis. Após a escolha, o bot guiaria o usuário até a finalização da compra, com opções de pagamento via cartão, Pix ou outros métodos suportados.

3. **Melhoria no Sistema de Alertas de Partidas**  
   - **Como faria:** Substituiria o uso do banco de dados placeholder por uma integração direta com uma API oficial da FURIA (ou banco de dados interno) que forneça informações sobre os jogos da equipe. Criaria um endpoint próprio para adicionar, editar ou remover partidas, permitindo total controle e evitando dependência de fontes externas instáveis. Isso garantiria mais confiabilidade, menor manutenção e melhor performance nas notificações de partidas.

4. **Central de Notícias Integrada com API da FURIA**  
   - **Como faria:** Abandonaria o uso de scraping para buscar notícias da equipe, optando por integrar diretamente com uma API oficial da FURIA (ou fonte controlada). Isso garantiria acesso a conteúdos atualizados de forma confiável. Também criaria um endpoint interno para gerenciar as notícias manualmente, permitindo adicionar, editar ou remover conteúdos, o que facilitaria a curadoria e personalização das informações enviadas aos usuários via WhatsApp.

5. **Histórico de Últimas Partidas via API Oficial**  
   - **Como faria:** Substituiria o scraping de sites de terceiros por uma integração com a API oficial da FURIA (ou base de dados interna) para obter o histórico recente de partidas. Isso permitiria recuperar dados mais precisos, como placar, mapas jogados e estatísticas dos jogadores. Criaria também um endpoint interno para registrar ou atualizar essas informações manualmente, garantindo flexibilidade e controle total sobre o que é exibido aos usuários.

6. **Exposição de Endpoints para Gerenciamento do Bot**  
   - **Como faria:** Criaria uma série de endpoints para permitir a alteração de dados do bot, como prompts da IA, configurações de menu, e outras informações dinâmicas. Esses endpoints poderiam ser integrados a um painel administrativo web, facilitando o gerenciamento em tempo real, sem necessidade de alterações diretas no código. A API permitiria editar, adicionar ou remover itens de menu, alterar configurações de fluxo de conversa, e até ajustar a lógica dos prompts para melhorar a interação com os usuários.

7. **Funcionalidade de Timers para a Twitch**  
   - **Como faria:** Implementaria a funcionalidade de timers na Twitch, permitindo que timers sejam cadastrados no banco de dados via endpoint. Esses timers enviariam mensagens ou alertas automaticamente a cada intervalo definido, com um limite de 60 minutos. O sistema permitiria que os administradores da conta configurassem os tempos de envio e as mensagens a serem disparadas, garantindo que o fluxo de interações na Twitch seja mantido de forma automática e personalizada.

8. **Funcionalidade de Comandos para a Twitch**  
   - **Como faria:** Implementaria comandos personalizados na Twitch, onde administradores poderiam cadastrar comandos simples no banco de dados via endpoint. Cada comando teria um texto associado como resposta, com a possibilidade de utilizar placeholders dinâmicos como `{nick}`, `{countx-x}` e outros. Esses placeholders seriam substituídos automaticamente com os dados apropriados, permitindo respostas personalizadas baseadas no usuário ou contexto. A API garantiria flexibilidade para adicionar, editar ou remover comandos conforme necessário.

9. **Integração com a API da Twitch para Enviar Mensagens com `/me` e `/announce`**  
   - **Como faria:** Integraria o processo de autenticação da Twitch com a API oficial da plataforma, permitindo que o bot tenha permissões para enviar mensagens de sistema com os comandos `/me` (para ações estilizadas) e `/announce` (para anunciar algo com destaque).

10. **Integração de Automod com IA para a Twitch**  
     - **Como faria:** Implementaria um sistema de automod baseado em IA utilizando a API do Gemini. Esse sistema seria alimentado por um prompt de moderador que ajudaria a IA a identificar mensagens no chat da Twitch que violassem regras como palavrões, spam, ou comportamentos indesejados. A IA processaria as mensagens em tempo real e, com base no contexto fornecido pelo prompt, apagaria automaticamente aquelas que violassem as diretrizes. O sistema seria altamente configurável, permitindo ajustes no comportamento do moderador de IA conforme as necessidades do canal.

11. **Funcionalidade de Conversa por Áudio no WhatsApp com IA**  
     - **Como faria:** Implementaria a funcionalidade de envio e recepção de mensagens de áudio no WhatsApp, utilizando a API do Gemini para processar as mensagens de voz. O bot receberia o áudio enviado pelo usuário, que seria armazenado e, em seguida, enviado para o Gemini para transcrição e entendimento do conteúdo. A resposta gerada pela IA seria então retornada ao usuário em formato de texto, aumentando a acessibilidade e permitindo interações mais inclusivas.

12. **Integração de Contexto nas Mensagens do Chat da Twitch**  
     - **Como faria:** Adicionaria a capacidade do bot da Twitch de manter o contexto das mensagens enviadas no chat. Isso permitiria que o bot se integrasse melhor ao assunto e gerasse respostas mais naturais e relevantes. O bot armazenaria um histórico das interações durante a sessão, utilizando uma estrutura de memória temporária ou banco de dados para referenciar mensagens anteriores e ajustar suas respostas conforme o fluxo da conversa. Isso faria com que o bot parecesse mais inteligente e conectado ao contexto do chat, criando uma experiência mais fluida para os usuários.

13. **Integração de Contexto com Dados de Jogadores, Técnicos e Partidas no Bot da Twitch**  
     - **Como faria:** Integraria os dados de jogadores, técnicos, histórico de partidas e status de partidas ao bot da Twitch, utilizando informações disponíveis via API ou banco de dados. O bot poderia acessar esses dados para fornecer respostas automáticas sobre o andamento das partidas, quem está jogando, quais técnicos estão envolvidos, e o histórico de confrontos. Assim, o bot funcionaria como um FAQ dinâmico e atualizado durante a live, respondendo automaticamente a perguntas como "Quem está jogando hoje?", "Qual o placar da última partida?" ou "Qual o status da partida atual?". Isso aumentaria a interação e o engajamento na transmissão, tornando o bot uma ferramenta útil e informativa durante a live.

Esses passos tornariam o projeto mais robusto, escalável e pronto para produção real.

## 💻 Ambiente de Desenvolvimento

Recomendamos o uso de [Visual Studio Code](https://code.visualstudio.com/).

### 🧰 Ferramentas Necessárias

1. [**Node.js 20.11**](https://nodejs.org/dist/v20.11.0/)
2. [**Git**](https://git-scm.com/downloads)
3. [**Yarn**](https://classic.yarnpkg.com/lang/en/docs/install/)
4. [**PostgreSQL**](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

## 🤝 Como Contribuir

1. Faça um fork deste repositório.
2. Crie uma branch para a sua funcionalidade a partir da develop.
3. Realize suas mudanças.
4. Faça um push para a sua branch.
5. Abra um pull request para a develop.

## 📝 Considerações Finais

Este é um projeto inacabado, desenvolvido como parte de um **teste técnico**. Foi feito o que foi possível dentro do tempo exigido para a entrega. No entanto, vale ressaltar que este projeto **não será continuado**. 

Fiquem à vontade para modificar, melhorar ou concluir as funcionalidades que não foram finalizadas.

---

Feito com FURIA por [Grillezinho](https://github.com/Grillekkj) ✨
