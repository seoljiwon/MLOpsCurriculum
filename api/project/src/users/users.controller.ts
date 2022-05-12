import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { Req, Header, Param, Query, Body } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Header('Cache-Control', 'none')
  async create(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return `get #${id} user`;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return `update #${id} user`;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return `delete #${id} user`;
  }
}
