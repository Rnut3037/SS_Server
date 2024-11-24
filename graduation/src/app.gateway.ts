import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  interface User {
    id: any;
  }
  
  interface RoomData {
    room: string;
  }
  
  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  })
  export class SocketGateway {
    @WebSocketServer()
    server: Server;
  
    // 어떤 방에 어떤 유저가 들어있는지
    private users: { [roomId: string]: User[] } = {};
    // socket.id기준으로 어떤 방에 들어있는지
    private socketRoom: { [socketId: string]: string } = {};
  
    // 방의 최대 인원수
    private readonly MAXIMUM = 2;
  
    @SubscribeMessage('join_room')
    handleJoinRoom(
      @MessageBody() data: RoomData,
      @ConnectedSocket() client: Socket,
    ) {
      const { room } = data;
      const { id: socketId } = client;
  
      // 방이 기존에 생성되어 있다면
      if (this.users[room]) {
        // 현재 입장하려는 방에 있는 인원수
        const currentRoomLength = this.users[room].length;
        if (currentRoomLength === this.MAXIMUM) {
          // 인원수가 꽉 찼다면 돌아갑니다.
          client.to(socketId).emit('room_full');
          return;
        }
  
        // 여분의 자리가 있다면 해당 방 배열에 추가해줍니다.
        this.users[room].push({ id: socketId });
      } else {
        // 방이 존재하지 않다면 값을 생성하고 추가해줍시다.
        this.users[room] = [{ id: socketId }];
      }
      this.socketRoom[socketId] = room;
  
      // 입장
      client.join(room);
  
      // 입장하기 전 해당 방의 다른 유저들이 있는지 확인하고
      // 다른 유저가 있었다면 offer-answer을 위해 알려줍니다.
      const others = this.users[room].filter((user) => user.id !== socketId);
      if (others.length) {
        client.to(socketId).emit('all_users', others);
      }
    }
  
    @SubscribeMessage('offer')
    handleOffer(
      @MessageBody() sdp: any,
      @ConnectedSocket() client: Socket,
    ) {
      const roomName = this.socketRoom[client.id];
      client.to(roomName).emit('getOffer', sdp);
    }
  
    @SubscribeMessage('answer')
    handleAnswer(
      @MessageBody() sdp: any,
      @ConnectedSocket() client: Socket,
    ) {
      const roomName = this.socketRoom[client.id];
      client.to(roomName).emit('getAnswer', sdp);
    }
  
    @SubscribeMessage('candidate')
    handleCandidate(
      @MessageBody() candidate: any,
      @ConnectedSocket() client: Socket,
    ) {
      const roomName = this.socketRoom[client.id];
      client.to(roomName).emit('getCandidate', candidate);
    }
  
    @SubscribeMessage('disconnect')
    handleDisconnect(@ConnectedSocket() client: Socket) {
      const roomID = this.socketRoom[client.id];
  
      if (this.users[roomID]) {
        this.users[roomID] = this.users[roomID].filter((user) => user.id !== client.id);
        if (this.users[roomID].length === 0) {
          delete this.users[roomID];
          return;
        }
      }
      delete this.socketRoom[client.id];
      //@ts-ignore
      client.broadcast.to(this.users[roomID]).emit('user_exit', { id: client.id });
    }
  }


  