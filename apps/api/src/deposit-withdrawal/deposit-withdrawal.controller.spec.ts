import { Test, TestingModule } from '@nestjs/testing';
import { DepositWithdrawalController } from './deposit-withdrawal.controller';

describe('DepositWithdrawalController', () => {
  let controller: DepositWithdrawalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositWithdrawalController],
    }).compile();

    controller = module.get<DepositWithdrawalController>(
      DepositWithdrawalController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
