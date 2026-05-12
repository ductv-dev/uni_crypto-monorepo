import { Test, TestingModule } from "@nestjs/testing"
import { MatchingEngineController } from "./matching-engine.controller"
import { MatchingEngineService } from "./matching-engine.service"

describe("MatchingEngineController", () => {
  let matchingEngineController: MatchingEngineController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MatchingEngineController],
      providers: [MatchingEngineService],
    }).compile()

    matchingEngineController = app.get<MatchingEngineController>(
      MatchingEngineController
    )
  })

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(matchingEngineController.getHello()).toBe("Hello World!")
    })
  })
})
