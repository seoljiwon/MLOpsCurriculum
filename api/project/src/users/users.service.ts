import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserParams } from './inferface/user.interface';
import { User } from './entity/user.entity';
import { UserRepository } from './entity/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  healthCheck() {
    const result = {
      status: 'OK',
    };
    return result;
  }

  async create(user: UserParams) {
    let result;
    try {
      result = await this.userRepository.save(user);
    } catch (err) {
      // conflict error
      if (err.code === 'ER_DUP_ENTRY')
        throw new ConflictException('The user already exists.');
    }

    return result;
  }

  async findAll() {
    const results = await this.userRepository.find();
    return results;
  }

  async findOne(id: number) {
    const result = await this.userRepository.findOne(id);

    // not found error
    if (!result) {
      throw new NotFoundException('The user is not found.');
    }
    return result;
  }

  async update(id: number, user: UserParams) {
    try {
      const result = await this.userRepository.update(id, user);

      // not found error
      if (!result.affected)
        throw new NotFoundException('The user is not found.');
    } catch (err) {
      // conflict error
      if (err.code === 'ER_DUP_ENTRY')
        throw new ConflictException('The user already exists.');
    }

    // updated result
    const result = await this.userRepository.findOne(id);
    return result;
  }

  async remove(id: number) {
    try {
      const result = await this.userRepository.delete(id);

      // not found error
      if (!result.affected)
        throw new NotFoundException('The user is not found.');
    } catch (err) {}

    // deleted result
    const result = await this.userRepository.findOne(id);
    return result;
  }
}
