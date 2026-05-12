import { Module } from '@nestjs/common';
import { TestConnectDbController } from './test-connect-db.controller';
import { TestConnectDbService } from './test-connect-db.service';

@Module({
  controllers: [TestConnectDbController],
  providers: [TestConnectDbService],
})
export class TestConnectDbModule {}
