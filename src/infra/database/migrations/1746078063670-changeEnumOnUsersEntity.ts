import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEnumOnUsersEntity1746078063670
  implements MigrationInterface
{
  name = 'ChangeEnumOnUsersEntity1746078063670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."users_menu_enum" RENAME TO "users_menu_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_menu_enum" AS ENUM('initial', 'latest_news', 'games_history', 'match_alerts_schedule', 'live_game_status', 'furia_ai_chat', 'official_store')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "menu" TYPE "public"."users_menu_enum" USING "menu"::"text"::"public"."users_menu_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_menu_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_menu_enum_old" AS ENUM('initial', 'latest_news', 'match_schedule', 'trophy_history', 'match_alerts', 'live_game_status', 'furia_ai_chat', 'official_store')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "menu" TYPE "public"."users_menu_enum_old" USING "menu"::"text"::"public"."users_menu_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_menu_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_menu_enum_old" RENAME TO "users_menu_enum"`,
    );
  }
}
