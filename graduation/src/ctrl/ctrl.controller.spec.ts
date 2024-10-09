import { Test, TestingModule } from '@nestjs/testing';
import { CtrlController } from './ctrl.controller';

describe('CtrlController', () => {
  let controller: CtrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CtrlController],
    }).compile();

    controller = module.get<CtrlController>(CtrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
