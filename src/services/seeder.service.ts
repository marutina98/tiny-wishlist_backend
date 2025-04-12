import prisma from '../prisma';

class SSeeder {

  public async generatePriorities() {
    
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

  public async disconnectPrisma(error: unknown = null) {

    if (error) {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    } else {
      await prisma.$disconnect();
    }
    
  }

}

export default new SSeeder();