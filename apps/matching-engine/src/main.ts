// apps/matching-engine/src/main.ts
import { NestFactory } from "@nestjs/core"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import { MatchingEngineModule } from "./matching-engine.module"

async function bootstrap() {
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
}

bootstrap()
