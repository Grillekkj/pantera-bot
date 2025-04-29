import { connectionSource } from '../../../configs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import Seeder from '../entities/seeder.entity';
import { SeedInterface } from './db-seed-create';

async function run() {
  await connectionSource.initialize();
  const queryRunner = connectionSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const seedRepository = connectionSource.getRepository(Seeder);

    const seedsFolder = path.resolve(__dirname, '..', 'seeds');

    const seedsFiles = fs
      .readdirSync(seedsFolder)
      .filter((file) => file.endsWith('.ts') && file !== 'seedRun.ts');

    for (const seedFile of seedsFiles) {
      const seedModule = Object.values(
        await import(path.join(seedsFolder, seedFile)),
      )[0] as SeedInterface;

      if (await seedNotExecuted(seedRepository, seedModule.name)) {
        await seedModule.up(queryRunner);
        await seedRepository.insert({
          name: seedModule.name,
          timestamp: Date.now(),
        });
        console.log(`${seedModule.name} executed!`);
      }
    }

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.log(err);
  } finally {
    await queryRunner.release();
  }
}

async function seedNotExecuted(
  seedRepository: Repository<Seeder>,
  seedName: string,
): Promise<boolean> {
  const existingSeed = await seedRepository.findOne({
    where: { name: seedName },
  });
  return !existingSeed;
}

run().then(() => console.log('Seed run script finished'));
