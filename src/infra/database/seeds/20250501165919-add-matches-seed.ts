import { MatchAlertsScheduleEntity } from 'src/modules/match-alerts-schedule/entity/match-alerts-schedule.entity';
import { QueryRunner } from 'typeorm';

export const AddMatchesSeed20250501165919Seed = {
  name: 'AddMatchesSeed20250501165919',
  async up(queryRunner: QueryRunner): Promise<any> {
    const matchesData = [
      {
        matchAt: new Date('2025-05-03T18:00:00Z'),
        opponent: 'Team Vitality',
        game: 'CS2',
        tournament: 'IEM Dallas 2025',
        stage: 'Group Stage',
        isOnline: false,
        streamLink: 'https://twitch.tv/furiatv',
      },
      {
        matchAt: new Date('2025-05-05T21:00:00Z'),
        opponent: 'Fnatic',
        game: 'VALORANT',
        tournament: 'VCT Americas 2025',
        stage: 'Week 3',
        isOnline: true,
        streamLink: 'https://youtube.com/furiatv',
      },
      {
        matchAt: new Date('2025-05-08T17:30:00Z'),
        opponent: 'G2 Esports',
        game: 'CS2',
        tournament: 'Blast Premier Spring',
        stage: 'Quarterfinals',
        isOnline: false,
        streamLink: 'https://twitch.tv/blast',
      },
      {
        matchAt: new Date('2025-05-10T20:00:00Z'),
        opponent: 'LOUD',
        game: 'VALORANT',
        tournament: 'VCT Americas 2025',
        stage: 'Week 4',
        isOnline: true,
        streamLink: 'https://twitch.tv/furiatv',
      },
      {
        matchAt: new Date('2025-05-12T19:00:00Z'),
        opponent: 'Team Liquid',
        game: 'CS2',
        tournament: 'IEM Dallas 2025',
        stage: 'Semifinals',
        isOnline: false,
        streamLink: 'https://www.twitch.tv/eslcsb',
      },
      {
        matchAt: new Date('2025-05-15T18:00:00Z'),
        opponent: 'Sentinels',
        game: 'VALORANT',
        tournament: 'VCT Americas 2025',
        stage: 'Week 5',
        isOnline: true,
        streamLink: 'https://twitch.tv/furiatv',
      },
      {
        matchAt: new Date('2025-05-18T16:00:00Z'),
        opponent: 'Natus Vincere',
        game: 'CS2',
        tournament: 'Blast Premier Spring',
        stage: 'Final',
        isOnline: false,
        streamLink: 'https://twitch.tv/blast',
      },
      {
        matchAt: new Date('2025-05-20T20:30:00Z'),
        opponent: 'KRÜ Esports',
        game: 'VALORANT',
        tournament: 'VCT Americas 2025',
        stage: 'Week 6',
        isOnline: true,
        streamLink: 'https://twitch.tv/furiatv',
      },
      {
        matchAt: new Date('2025-05-22T22:00:00Z'),
        opponent: 'MIBR',
        game: 'CS2',
        tournament: 'CBCS Elite League',
        stage: 'Group Stage',
        isOnline: true,
        streamLink: 'https://www.twitch.tv/cbcstv',
      },
      {
        matchAt: new Date('2025-05-25T21:00:00Z'),
        opponent: '100 Thieves',
        game: 'VALORANT',
        tournament: 'VCT Americas 2025',
        stage: 'Super Week',
        isOnline: true,
        streamLink: 'https://twitch.tv/furiatv',
      },
    ];

    const matches = matchesData.map((data) => {
      const entity = new MatchAlertsScheduleEntity();
      entity.matchAt = data.matchAt;
      entity.opponent = data.opponent;
      entity.game = data.game;
      entity.tournament = data.tournament;
      entity.stage = data.stage;
      entity.isOnline = data.isOnline;
      entity.streamLink = data.streamLink;
      return entity;
    });

    await queryRunner.manager.save(matches);
  },
};
