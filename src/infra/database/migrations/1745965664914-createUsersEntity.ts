import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersEntity1745965664914 implements MigrationInterface {
  name = 'CreateUsersEntity1745965664914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_menu_enum" AS ENUM('initial', 'latest_news', 'match_schedule', 'trophy_history', 'match_alerts', 'live_game_status', 'furia_ai_chat', 'official_store')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying NOT NULL, "menu" "public"."users_menu_enum" NOT NULL, "step" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "seeders" ("id" SERIAL NOT NULL, "timestamp" bigint NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c47f92b5ea524850088945b62cf" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "seeders"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_menu_enum"`);
  }
}
