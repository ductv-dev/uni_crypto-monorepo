import { Test, TestingModule } from "@nestjs/testing"
import { WsGatewayController } from "./ws-gateway.controller"
import { WsGatewayService } from "./ws-gateway.service"

describe("WsGatewayController", () => {
  let wsGatewayController: WsGatewayController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WsGatewayController],
      providers: [WsGatewayService],
    }).compile()

    wsGatewayController = app.get<WsGatewayController>(WsGatewayController)
  })

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(wsGatewayController.getHello()).toBe("Hello World!")
    })
  })
})
