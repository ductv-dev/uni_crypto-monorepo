import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OutboxProcessorService } from './outbox.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.get(OutboxProcessorService).processOutboxEvents();
}
bootstrap();
