import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Header,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('health-check/')
  async healthCheck() {
    return this.usersService.healthCheck();
  }

  @Post()
  @Header('Cache-Control', 'none')
  async create(@Body() CreateUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(CreateUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return await this.usersService.remove(id);
  }
}
