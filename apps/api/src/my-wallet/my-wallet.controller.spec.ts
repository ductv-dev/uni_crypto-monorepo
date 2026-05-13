import { Test, TestingModule } from '@nestjs/testing';
import { MyWalletController } from './my-wallet.controller';

describe('MyWalletController', () => {
  let controller: MyWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyWalletController],
    }).compile();

    controller = module.get<MyWalletController>(MyWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
