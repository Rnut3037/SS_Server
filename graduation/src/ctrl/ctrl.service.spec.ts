import { Test, TestingModule } from '@nestjs/testing';
import { CtrlService } from './ctrl.service';

describe('CtrlService', () => {
  let service: CtrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CtrlService],
    }).compile();

    service = module.get<CtrlService>(CtrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
