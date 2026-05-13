import { Test, TestingModule } from '@nestjs/testing';
import { MyWalletService } from './my-wallet.service';

describe('MyWalletService', () => {
  let service: MyWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyWalletService],
    }).compile();

    service = module.get<MyWalletService>(MyWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
