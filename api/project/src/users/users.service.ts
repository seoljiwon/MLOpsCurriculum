import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/users.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './entity/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  private readonly users: User[] = [];

  healthCheck() {
    const result = {
      status: 'OK',
    };
    return result;
  }

  async create(user: CreateUserDto): Promise<User> {
    if (user.name) {
      const existingName = await this.userRepository
        .createQueryBuilder('user')
        .where('user.name = :name', { name: user.name })
        .getOne();
      if (existingName) {
        throw new ConflictException('The user already exists.');
      }
    }
    const result = await this.userRepository.save(user);
    return result;
  }

  async findAll(): Promise<User[]> {
    const results = await this.userRepository.find();
    return results;
  }

  async findOne(id: number): Promise<User> {
    const result = await this.userRepository.findOne(id);
    if (!result) {
      throw new NotFoundException('The user is not found.');
    }
    return result;
  }

  async update(id: number, user: CreateUserDto): Promise<User> {
    const result = await this.userRepository.findOne(id);
    if (!result) {
      throw new NotFoundException('The user is not found.');
    }
    if (user.name && user.name != result.name) {
      const existingName = await this.userRepository
        .createQueryBuilder('user')
        .where('user.name = :name', { name: user.name })
        .getOne();
      if (existingName) {
        throw new ConflictException('The user already exists.');
      }
    }
    await this.userRepository.update(id, user);
    const updatedResult = await this.userRepository.findOne(id);

    return updatedResult;
  }

  async remove(id: number): Promise<User> {
    const result = await this.userRepository.findOne(id);
    if (!result) {
      throw new NotFoundException('The user is not found.');
    }
    await this.userRepository.delete(id);
    return result;
  }
}
