import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { Req, Header, Param, Query, Body } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  @Post()
  @Header('Cache-Control', 'none')
  async create(@Body() CreateUserDto: CreateUserDto) {
    return 'add user';
  }

  @Get()
  async findAll() {
    return 'get all users';
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return `get #${id} user`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return `update #${id} user`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `delete #${id} user`;
  }
}
