import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OutboxProcessorService } from './outbox.service';
import { PrismaModule } from '@workspace/db';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
  controllers: [AppController],
  providers: [AppService, OutboxProcessorService],
})
export class AppModule {}
