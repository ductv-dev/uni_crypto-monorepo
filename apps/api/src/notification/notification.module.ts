import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';
import { NotificationPublisherService } from './notification.publisher.service';
import { NotificationService } from './notification.service';

@Global()
@Module({
  controllers: [NotificationController],
  providers: [NotificationPublisherService, NotificationService, JwtService],
  exports: [NotificationPublisherService, NotificationService],
})
export class NotificationModule {}
