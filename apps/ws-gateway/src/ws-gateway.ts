// apps/ws-gateway/src/ws.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

const normalizeMarketSymbol = (symbol: string) =>
  symbol.trim().replace('/', '').replace('-', '').toUpperCase();

const normalizeUserId = (userId: string) => userId.trim();

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WsGateway.name);

  @WebSocketServer()
  server!: Server;

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    const rawUserId = client.handshake.auth?.userId;
    if (typeof rawUserId === 'string' && rawUserId.trim()) {
      const room = `user:${normalizeUserId(rawUserId)}`;
      void client.join(room);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('market.join')
  async handleJoinMarket(
    @MessageBody() body: { symbol: string; interval?: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!body?.symbol) {
      return {
        event: 'market.join.error',
        data: {
          message: 'symbol is required',
        },
      };
    }

    const symbol = normalizeMarketSymbol(body.symbol);
    const rooms = [`market:${symbol}`];

    if (body.interval) {
      rooms.push(`market:${symbol}:${body.interval}`);
    }

    await client.join(rooms);

    return {
      event: 'market.joined',
      data: {
        room: rooms[rooms.length - 1],
        rooms,
      },
    };
  }

  @SubscribeMessage('notification.join')
  async handleJoinNotification(
    @MessageBody() body: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!body?.userId || typeof body.userId !== 'string') {
      return {
        event: 'notification.join.error',
        data: {
          message: 'userId is required',
        },
      };
    }

    const room = `user:${normalizeUserId(body.userId)}`;
    await client.join(room);

    return {
      event: 'notification.joined',
      data: {
        room,
      },
    };
  }

  emitKlineUpdate(symbol: string, interval: string, data: any) {
    const room = `market:${normalizeMarketSymbol(symbol)}:${interval}`;

    if (!this.server) {
      this.logger.warn(`Cannot emit kline.update before server init: ${room}`);
      return;
    }

    this.server.to(room).emit('kline.update', data);
  }

  emitMarketTrade(symbol: string, data: any) {
    const room = `market:${normalizeMarketSymbol(symbol)}`;

    if (!this.server) {
      this.logger.warn(
        `Cannot emit market.trade.created before server init: ${room}`,
      );
      return;
    }

    this.server.to(room).emit('market.trade.created', data);
  }

  emitUserNotification(userId: string, data: any) {
    const room = `user:${normalizeUserId(userId)}`;

    if (!this.server) {
      this.logger.warn(
        `Cannot emit user.notification before server init: ${room}`,
      );
      return;
    }

    this.server.to(room).emit('user.notification', data);
  }
}
