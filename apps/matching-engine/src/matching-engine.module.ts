import { Module } from "@nestjs/common"
import { MatchingEngineController } from "./matching-engine.controller"
import { MatchingEngineService } from "./matching-engine.service"

@Module({
  imports: [],
  controllers: [MatchingEngineController],
  providers: [MatchingEngineService],
})
export class MatchingEngineModule {}
