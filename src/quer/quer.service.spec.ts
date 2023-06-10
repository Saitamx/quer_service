import { Test, TestingModule } from '@nestjs/testing';
import { QuerService } from './quer.service';

describe('QuerService', () => {
  let service: QuerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuerService],
    }).compile();

    service = module.get<QuerService>(QuerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
