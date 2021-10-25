import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './interfaces/user.entity';
import { AddressService } from 'src/address/address.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, AddressService],
  controllers: [UserController]
})
export class UserModule {}
