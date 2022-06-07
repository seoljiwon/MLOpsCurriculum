import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserParams } from './inferface/user.interface';
import { User } from './entity/user.entity';
import { UserRepository } from './entity/user.repository';
import { ErrorCode } from '../common/error.types';

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
      if (err.code === ErrorCode.ER_DUP_ENTRY)
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
    let result;
    try {
      result = await this.userRepository.update(id, user);

      if (!result.affected) throw new Error();
    } catch (err) {
      // conflict error
      if (err.code === 'ER_DUP_ENTRY')
        throw new ConflictException('The user already exists.');

      // not found error
      if (!result.affected)
        throw new NotFoundException('The user is not found.');
    }

    // updated result
    result = await this.userRepository.findOne(id);
    return result;
  }

  async remove(id: number) {
    // deleted result
    const result = await this.userRepository.findOne(id);

    // not found error
    if (!result) {
      throw new NotFoundException('The user is not found.');
    }

    await this.userRepository.delete(id);

    return result;
  }
}
