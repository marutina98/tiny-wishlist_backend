import SSeeder from './../src/services/seeder.service';

async function main() {
  await SSeeder.seed();
}

main().then(async () => {
  await SSeeder.disconnectPrisma();
}).catch(async (error: unknown) => {
  await SSeeder.disconnectPrisma(error);
});