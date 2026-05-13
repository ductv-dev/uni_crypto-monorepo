import { Test, TestingModule } from '@nestjs/testing';
import { DepositWithdrawalService } from './deposit-withdrawal.service';

describe('DepositWithdrawalService', () => {
  let service: DepositWithdrawalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepositWithdrawalService],
    }).compile();

    service = module.get<DepositWithdrawalService>(DepositWithdrawalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
