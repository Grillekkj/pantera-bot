import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFuriaAiChatEntity1745970005975
  implements MigrationInterface
{
  name = 'CreateFuriaAiChatEntity1745970005975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "furia_ai_chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nickname" character varying NOT NULL, "name" character varying NOT NULL, "game" character varying NOT NULL, "position" character varying NOT NULL, "nationality" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_ab8953ca038ddd4b48fce56d2e4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "furia_ai_chat"`);
  }
}
