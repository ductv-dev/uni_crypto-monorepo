import { NestFactory } from "@nestjs/core"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import { MatchingEngineModule } from "./matching-engine.module"
import { Logger } from "@nestjs/common"

async function bootstrap() {
  const logger = new Logger("MatchingEngine")

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MatchingEngineModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL!],
        queue: process.env.MATCHING_QUEUE || "matching.order.created",
        queueOptions: {
          durable: true,
        },
        noAck: false,
        prefetchCount: 1,
      },
    }
  )

  await app.listen()
  logger.log("Matching Engine is listening on RabbitMQ...")
}

bootstrap()
