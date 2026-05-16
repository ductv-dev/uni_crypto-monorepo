import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "@workspace/db"
import { MatchingEngineController } from "./matching-engine.controller"
import { MatchingEngineService } from "./matching-engine.service"
import { OrderBookManager } from "./order-book-manager.service"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    PrismaModule,
  ],
  controllers: [MatchingEngineController],
  providers: [MatchingEngineService, OrderBookManager],
})
export class MatchingEngineModule {}
