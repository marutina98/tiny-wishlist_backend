import { faker, th } from '@faker-js/faker';
import prisma from '../prisma';
import SHelpers from './helpers.service';

import { User, Priority, List, Group, Item } from '@prisma/client';

class SSeeder {

  public async seed() {

    // Seed 'Low', 'Medium' and 'High' priorities

    await this.seedPriorities();

    // Seed Users

    const users = await this.seedUsers();

    // Seed Lists for each user with groups
    // and items

    for (let user of users) {
      const lists = await this.seedLists(user);
      for (let list of lists) {
        const groups = await this.seedGroups(list);
      }
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

      const thumbnailOptions = {
        width: 300,
        height: 300,
      }

      const randomPriorityId = Math.floor(Math.random() * 3) + 1;
      const randomArchivalStatus = SHelpers.randomBoolean();
      const randomPrivateStatus = SHelpers.randomBoolean();

      const title = faker.lorem.sentence();
      const description = faker.lorem.paragraph();
      const thumbnail = faker.image.dataUri(thumbnailOptions);

      const data = {
        userId: user.id,
        priorityId: randomPriorityId,
        archived: randomArchivalStatus,
        private: randomPrivateStatus,
        title,
        description,
        thumbnail
      }

      const list = await prisma.list.create({ data });
      lists.push(list);

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