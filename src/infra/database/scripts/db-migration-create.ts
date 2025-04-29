import { exec } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function create() {
  const args = await yargs(hideBin(process.argv)).option('name', {
    alias: 'n',
    description: 'name of the migration',
    type: 'string',
    demandOption: true,
  }).argv;

  const migrationName = args.name;

  exec(
    `npm run typeorm -- migration:create src/infra/database/migrations/${migrationName}`,
  );
}

create().then(() => console.log('Migration create script finished'));
