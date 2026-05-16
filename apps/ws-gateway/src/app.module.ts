import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisSubscriberService } from './redis-subscriber.service';
import { WsGateway } from './ws-gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WsGateway, RedisSubscriberService],
})
export class AppModule {}
