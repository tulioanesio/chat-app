import {
    ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('New user connected', client.id);

    client.broadcast.emit('user-joined', {
      message: `New user joined ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected...', client.id);

    this.server.emit('user-joined', {
      message: `User left the chat: ${client.id}`,
    });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    this.server.emit('message', `${client.id}: ${message}`);
  }
}
