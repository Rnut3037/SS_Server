import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CtrlModule } from './ctrl/ctrl.module';

@Module({
  imports: [AuthModule, CtrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
