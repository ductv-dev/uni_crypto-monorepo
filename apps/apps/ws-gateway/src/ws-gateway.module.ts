import { Module } from "@nestjs/common"
import { WsGatewayController } from "./ws-gateway.controller"
import { WsGatewayService } from "./ws-gateway.service"

@Module({
  imports: [],
  controllers: [WsGatewayController],
  providers: [WsGatewayService],
})
export class WsGatewayModule {}
