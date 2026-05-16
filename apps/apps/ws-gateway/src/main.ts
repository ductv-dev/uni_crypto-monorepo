import { NestFactory } from "@nestjs/core"
import { WsGatewayModule } from "./ws-gateway.module"

async function bootstrap() {
  const app = await NestFactory.create(WsGatewayModule)
  await app.listen(process.env.port ?? 3000)
}
bootstrap()
