import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API guide object', () => {
      const guide = appController.getHello();

      expect(guide.name).toBe('Uni Crypto API');
      expect(guide.baseUrl).toBe('http://localhost:8080');
      expect(typeof guide.description).toBe('string');
      expect(Array.isArray(guide.endpoints)).toBe(true);
      expect(guide.endpoints.length).toBeGreaterThan(0);
    });
  });
});
