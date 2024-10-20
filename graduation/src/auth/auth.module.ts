import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
  ],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AuthModule {}
