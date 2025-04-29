import { exec } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function generate() {
  const args = await yargs(hideBin(process.argv)).option('name', {
    alias: 'n',
    description: 'name of the migration',
    type: 'string',
    demandOption: true,
  }).argv;

  const migrationName = args.name;

  exec(
    `typeorm-ts-node-commonjs -d ./src/configs/typeorm.ts migration:generate ./src/infra/database/migrations/${migrationName}`,
    (err, stdout) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(stdout);
    },
  );
}

generate().then(() => console.log('Migration generate script finished'));
