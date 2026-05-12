import { Injectable } from "@nestjs/common"

@Injectable()
export class MatchingEngineService {
  getHello(): string {
    return "Hello World!"
  }
}
