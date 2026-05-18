import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "@workspace/db"
import { MatchingEngineService } from "./matching-engine.service"
import { OrderBookManager } from "./order-book-manager.service"
import { RedisPublisherService } from "./redis-publisher.service"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    PrismaModule,
  ],
  controllers: [],
  providers: [MatchingEngineService, OrderBookManager, RedisPublisherService],
})
export class MatchingEngineModule {}
