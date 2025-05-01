import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUuidToIncrement1746132232529 implements MigrationInterface {
  name = 'ChangeUuidToIncrement1746132232529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match_alerts_schedule" DROP CONSTRAINT "PK_91c6a33babeaab580981df3f6ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_alerts_schedule" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_alerts_schedule" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_alerts_schedule" ADD CONSTRAINT "PK_91c6a33babeaab580981df3f6ef" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "match_alerts_schedule" DROP CONSTRAINT "PK_91c6a33babeaab580981df3f6ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_alerts_schedule" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_alerts_schedule" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_alerts_schedule" ADD CONSTRAINT "PK_91c6a33babeaab580981df3f6ef" PRIMARY KEY ("id")`,
    );
  }
}
