import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const priorities: string[] = [
    'Low',
    'Medium',
    'High'
  ];

  for (let priority of priorities) {

    try {
      await prisma.priority.create({
        data: {
          title: priority
        }
      });
    } catch (error: unknown) {
      throw error;
    }

  }

}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});