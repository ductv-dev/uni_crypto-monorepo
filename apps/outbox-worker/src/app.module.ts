import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OutboxProcessorService } from './outbox.service';
import { PrismaModule } from '@workspace/db';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: 'MATCHING_ENGINE_SERVICE',
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
              'matching_queue',
            ),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, OutboxProcessorService],
})
export class AppModule {}
