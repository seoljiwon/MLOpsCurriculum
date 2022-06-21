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
      else throw err;
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
    let updateResult;
    try {
      updateResult = await this.userRepository.update(id, user);
    } catch (err) {
      // conflict error
      if (err.code === 'ER_DUP_ENTRY')
        throw new ConflictException('The user already exists.');
      else throw err;
    }

    // not found error
    if (!updateResult.affected)
      throw new NotFoundException('The user is not found.');

    // updated result
    const result = await this.userRepository.findOne(id);
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
