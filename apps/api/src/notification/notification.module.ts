import { Global, Module } from '@nestjs/common';
import { NotificationPublisherService } from './notification.publisher.service';

@Global()
@Module({
  providers: [NotificationPublisherService],
  exports: [NotificationPublisherService],
})
export class NotificationModule {}
