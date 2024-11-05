import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CtrlService } from './ctrl.service'; 
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/user.entity';
import { CtrlController } from './ctrl.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  providers: [CtrlService],
  controllers: [CtrlController]
})
export class CtrlModule {}
