import prisma from '../prisma';
import { faker } from '@faker-js/faker';

import { User, Priority, List, Group, Item } from '@prisma/client';

class SSeeder {

  public async seed() {

    // Seed 'Low', 'Medium' and 'High' priorities

    await this.seedPriorities();

    // Seed Users

    const users = await this.seedUsers();

    // Seed Lists for each user

    for (let user of users) {
      const lists = await this.seedLists(user);
    }

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

  public async seedUsers(num: number = 5) {

    const users: User[] = [];

    // Generate *num* of users

    for (let i = 0; i <= num; i++) {

      const options = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      }

      const data = {
        email: faker.internet.email(options),
        username: faker.internet.username(options),
        password: 'password'
      }

      const user = await prisma.user.create({ data });
      users.push(user);

    }

    return users;

  }

  public async seedLists(user: User, num: number = 5) {

    const lists: List[] = [];

    for (let i = 0; i <= num; i++) {



    }
    
    return lists;

  }

  public async seedGroups(list: List) {

  }

  public async seedItems(group: Group) {

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