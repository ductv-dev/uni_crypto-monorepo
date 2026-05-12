import { Controller, Get } from "@nestjs/common"
import { MatchingEngineService } from "./matching-engine.service"

@Controller()
export class MatchingEngineController {
  constructor(private readonly matchingEngineService: MatchingEngineService) {}

  @Get()
  getHello(): string {
    return this.matchingEngineService.getHello()
  }
}
