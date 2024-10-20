import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CtrlService } from './ctrl.service'; 
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/user.entity';
import { CtrlController } from './ctrl.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // 필요시 여기에 User 엔티티 등록
    AuthModule, // AuthModule 임포트
  ],
  providers: [CtrlService],
  controllers: [CtrlController]
})
export class CtrlModule {}
