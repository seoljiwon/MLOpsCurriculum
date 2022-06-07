import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const params = {
      name: 'seol',
      age: 23,
    };

    it('should call create service with valid params', async () => {
      await controller.create(params);
      expect(mockUserService.create).toBeCalledWith(params);
    });
  });

  describe('findAll', () => {
    it('should call findAll service', async () => {
      await controller.findAll();
      expect(mockUserService.findAll).toBeCalled();
    });
  });

  describe('findOne', () => {
    const id = 1;

    it('should call findOne service with valid params', async () => {
      await controller.findOne(id);
      expect(mockUserService.findOne).toBeCalledWith(id);
    });
  });

  describe('update', () => {
    const id = 1;

    const params = {
      name: 'seol',
      age: 23,
    };

    it('should call update service with valid params', async () => {
      await controller.update(id, params);
      expect(mockUserService.update).toBeCalledWith(id, params);
    });
  });

  describe('remove', () => {
    const id = 1;

    it('should call remove service with valid params', async () => {
      await controller.remove(id);
      expect(mockUserService.remove).toBeCalledWith(id);
    });
  });
});
