import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Worker không cần HTTP server → dùng ApplicationContext thay vì full HTTP app.
  // enableShutdownHooks đảm bảo onModuleDestroy được gọi khi nhận SIGTERM/SIGINT.
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();
}
bootstrap();
