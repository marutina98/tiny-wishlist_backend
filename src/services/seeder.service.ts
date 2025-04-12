import prisma from '../prisma';

class SSeeder {

  public async seed() {

    // Seed 'Low', 'Medium' and 'High' priorities

    await this.seedPriorities();

  }

  public async seedPriorities() {
    
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

  public async seedUsers() {

  }

  public async seedLists() {

  }

  public async seedGroups() {

  }

  public async seedItems() {

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