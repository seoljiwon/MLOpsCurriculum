import { NotFoundException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { ErrorCode } from '../common/error.types';

function erDupEntry() {
  this.code = ErrorCode.ER_DUP_ENTRY;
}

let autoIncrementId = 1;
const user1 = new User();
user1.id = autoIncrementId++;
user1.name = 'seol';
user1.age = 24;

let users: User[] = [];

const mockUserRepo = {
  find: jest.fn(() => {
    return users;
  }),
  findOne: jest.fn((id: number) => {
    if (id != undefined) {
      const user = users.filter((u) => u.id === id)[0];
      return user;
    }
    return null;
  }),
  save: jest.fn((user: Partial<User>) => {
    users.map((u) => {
      if (u.name === user.name) throw new erDupEntry();
    });

    const newUser = new User();
    newUser.id = autoIncrementId++;
    newUser.name = user.name;
    if (user.age) newUser.age = user.age;
    users.push(newUser);

    return newUser;
  }),
  update: jest.fn((id: number, user: Partial<User>) => {
    users.map((u) => {
      if (u.id !== id && u.name === user.name) throw new erDupEntry();
    });

    const updatedUser = mockUserRepo.findOne(id);
    if (updatedUser) {
      if (user.name) updatedUser.name = user.name;
      if (user.age) updatedUser.age = user.age;
    }

    const updateResult = updatedUser ? { affected: 1 } : { affected: 0 };
    return updateResult;
  }),
  delete: jest.fn((id: number) => {
    if (id !== undefined) {
      const index = users.findIndex((c) => c.id === id);
      const result = index > -1 ? { affected: 1 } : { affected: 0 };
      if (index > -1) {
        users.splice(index, 1);
      }
      return result;
    }
  }),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    users = [user1];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new user', async () => {
      const params = {
        name: 'newName',
        age: 20,
      };

      const newUser = await service.create(params);

      expect(newUser).toBeDefined;
      expect(newUser.name).toEqual(params.name);
      expect(newUser.age).toEqual(params.age);
    });

    it('should throw conflict exception when duplicated', async () => {
      const params = {
        name: 'seol',
        age: 22,
      };

      await expect(async () => await service.create(params)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      await service.create({
        name: 'myName',
        age: 23,
      });

      const allUsers = await service.findAll();

      expect(allUsers.length).toEqual(users.length);
      expect(allUsers.map((u) => u)).toEqual(users.map((u) => u));
    });
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      const id = 1;

      const user = await service.findOne(id);

      expect(user).toBeDefined;
      expect(user.id).toEqual(id);
      expect(user.name).toBeDefined();
    });

    it('should throw not found exception when no user', async () => {
      const id = 999999;

      await expect(async () => await service.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 1;
      const params = {
        name: 'seoljiwon',
        age: 20,
      };

      const updatedUser = await service.update(id, params);

      expect(updatedUser.id).toEqual(id);
      expect(updatedUser.name).toEqual(params.name);
      expect(updatedUser.age).toEqual(params.age);
    });

    it('should throw not found exception when no user', async () => {
      const id = 999999;
      const params = {
        name: 'seolji',
        age: 20,
      };

      await expect(
        async () => await service.update(id, params),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw conflict exception when duplicated', async () => {
      await service.create({
        name: 'myName',
        age: 23,
      });

      const id = 1;
      const params = {
        name: 'myName',
        age: 20,
      };

      await expect(
        async () => await service.update(id, params),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = 1;

      const beforeDeleteLen = users.length;

      const deletedUser = await service.remove(id);

      const afterDeleteLen = users.length;

      expect(deletedUser).toBeDefined;
      expect(deletedUser.id).toEqual(id);
      expect(beforeDeleteLen - 1).toEqual(afterDeleteLen);
    });

    it('should throw not found exception when no user', async () => {
      const id = 999999;

      await expect(async () => await service.remove(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
