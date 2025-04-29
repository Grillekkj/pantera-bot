import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { toKebabCase, toPascalCase } from 'src/utils/toCase';
import { QueryRunner } from 'typeorm';
import * as yargs from 'yargs';

export interface SeedInterface {
  name: string;
  up(queryRunner: QueryRunner): Promise<any>;
}

async function create() {
  const argv = await yargs.option('name', {
    alias: 'n',
    description: 'Name of the seed',
    type: 'string',
    demandOption: true,
  }).argv;

  const seedName = argv.name;

  const timestamp = format(new Date(), 'yyyyMMddHHmmss');
  const fileNameKebabCase = `${timestamp}-${toKebabCase(seedName)}.ts`;
  const fileNamePascalCase = `${toPascalCase(seedName)}${timestamp}`;
  const filePath = path.resolve(
    __dirname,
    '..',
    'seeds',
    `${fileNameKebabCase}`,
  );

  const seedContent = `import { QueryRunner } from 'typeorm'

export const ${fileNamePascalCase}Seed = {
  name: '${fileNamePascalCase}',
  async up(queryRunner: QueryRunner): Promise<any> {
    // Sua lógica de seed aqui
  }
};
`;
  fs.writeFileSync(filePath, seedContent);
  console.log(`Seed file created: ${fileNameKebabCase}`);
}

create().then(() => console.log('Seed create script finished'));
