import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMatchesPlaceholderEntity1746130487312
  implements MigrationInterface
{
  name = 'AddMatchesPlaceholderEntity1746130487312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "match_alerts_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "matchAt" TIMESTAMP NOT NULL, "opponent" character varying NOT NULL, "game" character varying NOT NULL, "tournament" character varying NOT NULL, "stage" character varying NOT NULL, "isOnline" boolean NOT NULL DEFAULT false, "streamLink" character varying, CONSTRAINT "PK_91c6a33babeaab580981df3f6ef" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "match_alerts_schedule"`);
  }
}
