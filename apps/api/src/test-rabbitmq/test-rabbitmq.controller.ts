import { Body, Controller, Post } from '@nestjs/common';
import { SendOrderDto } from './dto/send-order.dto';
import {
  SendMessageResult,
  TestRabbitmqService,
} from './test-rabbitmq.service';

@Controller('test-rabbitmq')
export class TestRabbitmqController {
  constructor(private readonly testRabbitmqService: TestRabbitmqService) {}

  /**
   * POST /test-rabbitmq/emit
   * Gửi message dạng event (fire-and-forget) lên queue
   */
  @Post('emit')
  async emitOrder(@Body() dto: SendOrderDto): Promise<SendMessageResult> {
    return this.testRabbitmqService.sendOrderCreated(dto);
  }

  /**
   * POST /test-rabbitmq/send
   * Gửi message dạng request-response, chờ consumer trả kết quả
   */
  @Post('send')
  async sendOrder(@Body() dto: SendOrderDto): Promise<SendMessageResult> {
    return this.testRabbitmqService.sendOrderAndWaitResponse(dto);
  }
}
