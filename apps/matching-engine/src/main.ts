import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { MatchingEngineModule } from "./matching-engine.module"
import { MatchingEngineService } from "./matching-engine.service"

async function bootstrap() {
  const logger = new Logger("MatchingEngine")
  const app = await NestFactory.createApplicationContext(MatchingEngineModule)
  await app.get(MatchingEngineService).start()
  logger.log("[MatchingEngine] Bootstrap completed")
}

bootstrap()
