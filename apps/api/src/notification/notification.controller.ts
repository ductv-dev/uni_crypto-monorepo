import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { ClientOnly, getCurrentUser } from 'src/auth/decorators';
import { NotificationService } from './notification.service';

@Controller('notifications')
@ClientOnly()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(
    @getCurrentUser('sub') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.notificationService.findAllForUser(userId, page, limit);
  }

  @Patch(':id/read')
  markAsRead(
    @getCurrentUser('sub') userId: string,
    @Param('id') notificationId: string,
  ) {
    return this.notificationService.markAsRead(userId, notificationId);
  }

  @Patch('read-all')
  markAllAsRead(@getCurrentUser('sub') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }
}
