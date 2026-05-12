import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DEFAULT_MATCHING_QUEUE,
  MATCHING_ENGINE_SERVICE,
} from './test-rabbitmq.constants';
import { TestRabbitmqController } from './test-rabbitmq.controller';
import { TestRabbitmqService } from './test-rabbitmq.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MATCHING_ENGINE_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://admin:admin@localhost:5672',
              ),
            ],
            queue: configService.get<string>(
              'MATCHING_QUEUE',
              DEFAULT_MATCHING_QUEUE,
            ),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [TestRabbitmqController],
  providers: [TestRabbitmqService],
  exports: [TestRabbitmqService],
})
export class TestRabbitmqModule {}
