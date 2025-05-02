import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveAlertsTable1746138589137 implements MigrationInterface {
  name = 'AddActiveAlertsTable1746138589137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "active_alerts" ("id" character varying NOT NULL, "matches" jsonb NOT NULL, CONSTRAINT "PK_bc6e753742f8c059f10202bd4e1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "active_alerts"`);
  }
}
