import { FuriaAiChatEntity } from 'src/modules/furia-ai-chat/entity/furia-ai-chat.entity';
import { QueryRunner } from 'typeorm';

export const AddPlayersInfoToFuriaAiChat20250429204106Seed = {
  name: 'AddPlayersInfoToFuriaAiChat20250429204106',
  async up(queryRunner: QueryRunner): Promise<any> {
    const playersData = [
      {
        nickname: 'yuurih',
        name: 'Yuri Gomes dos Santos Boian',
        game: 'Counter-Strike 2',
        position: 'Rifler & Clutch-master',
        nationality: 'Brasil',
        description:
          'Vice-campeão do ECS Season 7; ~US$ 393 k em prêmios; reconhecido pela frieza e consistência em situações de clutch; reservado e analítico em rounds decisivos.',
      },
      {
        nickname: 'KSCERATO',
        name: 'Kaike Silva Cerato',
        game: 'Counter-Strike 2',
        position: 'Rifler agressivo',
        nationality: 'Brasil',
        description:
          'Entrou na FURIA em fev/2018; Top 20 HLTV em 2022–23; >US$ 402 k em prêmios; estilo enérgico, abre espaços com entradas rápidas; dedicado taticamente.',
      },
      {
        nickname: 'FalleN',
        name: 'Gabriel Toledo de Alcântara Sguario',
        game: 'Counter-Strike 2',
        position: 'AWPer & In-Game Leader',
        nationality: 'Brasil',
        description:
          'Fundador da Games Academy e Fallen Gear; >US$ 1,151 M em prêmios; líder calmo e preciso, foca em controle emocional; IGL desde jul/2023.',
      },
      {
        nickname: 'molodoy',
        name: 'Danil Golubenko',
        game: 'Counter-Strike 2',
        position: 'AWPer & Rifler',
        nationality: 'Cazaquistão',
        description:
          'Contratado em abr/2025 da AMKAL; jovem talento com mira apurada; entusiasta, disciplinado, adapta-se rápido e tem forte ética de trabalho.',
      },
      {
        nickname: 'YEKINDAR',
        name: 'Mareks Gaļinskis',
        game: 'Counter-Strike 2',
        position: 'Entry fragger / Play-maker',
        nationality: 'Letônia',
        description:
          'Stand-in desde abr/2025; ex-Virtus.pro e Team Liquid; ~US$ 497 k em prêmios; comunicativo, arrojado, cria jogadas ousadas e ritmo alto.',
      },
      {
        nickname: 'sidde',
        name: 'Sidnei Macedo Pereira Filho',
        game: 'Counter-Strike 2',
        position: 'Coach principal',
        nationality: 'Brasil',
        description:
          'Coach principal desde jul/2024; ex-assistant coach; analítico, metódico, foca em leituras de jogo e preparo tático; comunicação clara e motivação do elenco.',
      },
      {
        nickname: 'Hepa',
        name: 'Juan Borges',
        game: 'Counter-Strike 2',
        position: 'Assistant coach',
        nationality: 'Espanha',
        description:
          'Assistant coach desde jan/2025; ex-analista em Movistar Riders, Team Liquid e EG; detalhista, colabora na análise de demos, veto de mapas e desenvolvimento individual.',
      },
      {
        nickname: 'Lostt',
        name: 'Gabriel Buzon',
        game: 'Valorant',
        position: '',
        nationality: 'Brasil',
        description:
          'Criativo e estratégico, adora surpreender o time com táticas não convencionais.',
      },
      {
        nickname: 'drufinho',
        name: 'Arthur Langsch',
        game: 'Valorant',
        position: '',
        nationality: 'Brasil',
        description:
          'Extrovertido e comunicativo, mantém o moral do grupo sempre em alta.',
      },
      {
        nickname: 'yanxnz',
        name: 'Yan Xisto Nolasco',
        game: 'Valorant',
        position: '',
        nationality: 'Brasil',
        description:
          'Focado e meticuloso, faz análises detalhadas das demos adversárias.',
      },
      {
        nickname: 'STL',
        name: 'Matheus Lemos',
        game: 'Valorant',
        position: 'Treinador principal',
        nationality: 'Brasil',
        description: 'Visionário tático, sempre um passo à frente da meta.',
      },
      {
        nickname: 'Khalil',
        name: 'Khalil Schmidt',
        game: 'Valorant',
        position: 'Controlador',
        nationality: 'Brasil',
        description:
          'Calmo sob pressão, controla os ângulos e ritmos do round.',
      },
      {
        nickname: 'mwzera',
        name: 'Leonardo da Silva',
        game: 'Valorant',
        position: 'Iniciador',
        nationality: 'Brasil',
        description: 'Corajoso no front, sempre o primeiro a abrir espaço.',
      },
      {
        nickname: 'havoc',
        name: 'Ilan Eloy',
        game: 'Valorant',
        position: 'Duelista',
        nationality: 'Brasil',
        description: 'Ágil e agressivo, faz os clutch mais improváveis.',
      },
      {
        nickname: 'heat',
        name: 'Olavo Marcelo',
        game: 'Valorant',
        position: 'Sentinela',
        nationality: 'Brasil',
        description: 'Defensor nato, casa bem os flancos do mapa.',
      },
      {
        nickname: 'raafa',
        name: 'Rafael Lima',
        game: 'Valorant',
        position: '',
        nationality: 'Brasil',
        description:
          'Estratégico e observador, sabe o momento certo de dar suporte.',
      },
      {
        nickname: 'peu',
        name: 'Pedro Lopes',
        game: 'Valorant',
        position: 'Coach',
        nationality: 'Brasil',
        description: 'Mentor dedicado, foca no desenvolvimento individual.',
      },
      {
        nickname: 'lukzera',
        name: 'Lucas Soares',
        game: 'Valorant',
        position: 'Manager',
        nationality: 'Brasil',
        description:
          'Organizado e visionário, mantém tudo funcionando nos bastidores.',
      },
      {
        nickname: 'Guigo',
        name: 'Guilherme Ruiz',
        game: 'League of Legends',
        position: 'Topo',
        nationality: 'Brasil',
        description:
          'Adaptável, domina tanto lendas de split push quanto de team fight.',
      },
      {
        nickname: 'Tatu',
        name: 'Pedro Seixas',
        game: 'League of Legends',
        position: 'Caçador',
        nationality: 'Brasil',
        description:
          'Jungle inteligente, faz pathing eficiente para snowballar o time.',
      },
      {
        nickname: 'Tutsz',
        name: 'Arthur Machado',
        game: 'League of Legends',
        position: 'Meio',
        nationality: 'Brasil',
        description: 'Mecânico refinado, controla bem o ritmo do mid game.',
      },
      {
        nickname: 'Ayu',
        name: 'Andrey Saraiva',
        game: 'League of Legends',
        position: 'Atirador',
        nationality: 'Brasil',
        description: 'Frio nos team fights, alta precisão em posicionamento.',
      },
      {
        nickname: 'JoJo',
        name: 'Gabriel Dzelme',
        game: 'League of Legends',
        position: 'Suporte',
        nationality: 'Brasil',
        description:
          'Empático, sempre protege seus atiradores com peel eficiente.',
      },
      {
        nickname: 'Thinkcard',
        name: 'Thomas Slotkin',
        game: 'League of Legends',
        position: 'Treinador principal',
        nationality: 'Estados Unidos',
        description:
          'Estratégico e inspirador, desenvolve metas de longo prazo para o time.',
      },
      {
        nickname: 'furyz',
        name: 'Erick Susin',
        game: 'League of Legends',
        position: 'Treinador assistente',
        nationality: 'Brasil',
        description: 'Detalhista, analisa cada replay para ajustes táticos.',
      },
      {
        nickname: 'FelipoX',
        name: 'Felipe De Lucia',
        game: 'Rainbow Six Siege',
        position: '',
        nationality: 'Brasil',
        description:
          'Membro do elenco de R6 desde o primeiro campeonato oficial; usuário criativo no jogo, costuma propor estratégias surpreendentes em treinos.',
      },
      {
        nickname: 'HerdsZ',
        name: 'Gustavo Herdina',
        game: 'Rainbow Six Siege',
        position: '',
        nationality: 'Brasil',
        description:
          'Integra a equipe de R6, competindo em majors internacionais; reconhecido pela calma contagiante, mantendo o time focado nos momentos críticos.',
      },
      {
        nickname: 'Jv92',
        name: 'João Victor',
        game: 'Rainbow Six Siege',
        position: '',
        nationality: 'Brasil',
        description:
          'Atua como jogador de R6 desde 2023; extremamente observador, costuma identificar padrões de jogo dos adversários.',
      },
      {
        nickname: 'Kheyze',
        name: 'Diego Zanello',
        game: 'Rainbow Six Siege',
        position: '',
        nationality: 'Brasil',
        description:
          'Especialista em seguradas de bomba e retakes; dotado de paciência, executa jogadas calculadas em situações de alta pressão.',
      },
      {
        nickname: 'nade',
        name: 'Felipe Sá Ferreira',
        game: 'Rainbow Six Siege',
        position: '',
        nationality: 'Brasil',
        description:
          'Presente em eventos como o Six Invitational 2024; dotado de raciocínio rápido, destaca-se em chamadas de utilitários.',
      },
      {
        nickname: 'igoorctg',
        name: 'Igor dos Santos',
        game: 'Rainbow Six Siege',
        position: 'Treinador',
        nationality: 'Brasil',
        description:
          'Coach da divisão de R6, liderando análises de demos e preparação de mapas; carismático, sabe extrair o melhor de cada jogador durante bootcamps.',
      },
    ];

    const players = playersData.map((data) => {
      const entity = new FuriaAiChatEntity();
      entity.nickname = data.nickname;
      entity.name = data.name;
      entity.game = data.game;
      entity.position = data.position;
      entity.nationality = data.nationality;
      entity.description = data.description;
      return entity;
    });

    await queryRunner.manager.save(players);
  },
};
