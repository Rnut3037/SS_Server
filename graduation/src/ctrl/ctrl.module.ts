import { Module } from '@nestjs/common';
import { CtrlController } from './ctrl.controller';
import { CtrlService } from './ctrl.service';

@Module({
  controllers: [CtrlController],
  providers: [CtrlService],
})
export class CtrlModule {}