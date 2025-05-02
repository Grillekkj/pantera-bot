import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlayerChosenToUserTabel1746052270169
  implements MigrationInterface
{
  name = 'AddPlayerChosenToUserTabel1746052270169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "playerChosen" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "playerChosen"`);
  }
}
