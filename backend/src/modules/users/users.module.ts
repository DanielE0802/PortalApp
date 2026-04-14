import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../../database/entities';
import { UserRepository } from '../../database/repositories/user.repository';
import { ReqResUsersAdapter } from './adapter/reqres-users.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, ReqResUsersAdapter],
  exports: [UsersService],
})
export class UsersModule {}
