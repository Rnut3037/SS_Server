import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    private totalRooms: { [key: string]: { users: string[] } } = {};
  
    handleConnection(socket: Socket) {
      console.log(`Client connected: ${socket.id}`);
    }
  
    handleDisconnect(socket: Socket) {
      console.log(`Client disconnected: ${socket.id}`);
      const room = socket['room'];
      if (room && this.totalRooms[room]) {
        this.totalRooms[room].users = this.totalRooms[room].users.filter(
          (id) => id !== socket.id,
        );
        if (this.totalRooms[room].users.length === 0) {
          delete this.totalRooms[room];
        }
      }
    }
  
    @SubscribeMessage('join_room')
    joinRoom(socket: Socket, payload: { room: string }) {
      const { room } = payload;
      socket.join(room);
  
      if (!this.totalRooms[room]) {
        this.totalRooms[room] = { users: [] };
      }
  
      this.totalRooms[room].users.push(socket.id);
      socket['room'] = room;
  
      const roomUsers = this.totalRooms[room].users.filter(
        (id) => id !== socket.id,
      );
      socket.emit('all_users', roomUsers);
    }
  
    @SubscribeMessage('offer')
    handleOffer(socket: Socket, data: { sdp: string; room: string }) {
      socket.to(data.room).emit('offer', { sdp: data.sdp, sender: socket.id });
    }
  
    @SubscribeMessage('answer')
    handleAnswer(socket: Socket, data: { sdp: string; room: string }) {
      socket.to(data.room).emit('answer', { sdp: data.sdp, sender: socket.id });
    }
  
    @SubscribeMessage('candidate')
    handleCandidate(socket: Socket, data: { candidate: string; room: string }) {
      socket.to(data.room).emit('candidate', { candidate: data.candidate });
    }
  }
  