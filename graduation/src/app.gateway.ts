import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // 보안상 실제로는 특정 출처로 제한해야 함
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;

  private totalRooms: { [key: string]: { users: string[] } } = {};

  // Gateway 초기화
  afterInit(server: Server) {   
    console.log('WebSocket server initialized');
  }

  // 클라이언트 연결 시
  handleConnection(socket: Socket) {
    console.log(`Client connected. socket: ${socket.id}`);
  }

  // 클라이언트 연결 해제 시
  handleDisconnect(socket: Socket) {
    console.log('Client disconnected');
    if (socket['room'] && this.totalRooms[socket['room']]) {
      this.totalRooms[socket['room']].users = this.totalRooms[socket['room']].users.filter(
        (id) => id !== socket.id,
      );
      if (this.totalRooms[socket['room']].users.length === 0) {
        delete this.totalRooms[socket['room']];
      }
    }
  }

  // 방에 입장하기
  joinRoom(socket: Socket, room: string) {
    if (!room) return;

    socket.join(room);

    if (!this.totalRooms[room]) {
      this.totalRooms[room] = { users: [] };
    }

    this.totalRooms[room].users.push(socket.id);
    socket['room'] = room;

    console.log(`Join room ${room}. Socket ${socket.id}`);
  }

  // Offer, Answer, Candidate 이벤트 처리
  handleOffer(socket: Socket, data: { sdp: string; room: string }) {
    socket.to(data.room).emit('offer', { sdp: data.sdp, sender: socket.id });
  }

  handleAnswer(socket: Socket, data: { sdp: string; room: string }) {
    socket.to(data.room).emit('answer', { sdp: data.sdp, sender: socket.id });
  }

  handleCandidate(socket: Socket, data: { candidate: string; room: string }) {
    socket.to(data.room).emit('candidate', { candidate: data.candidate, sender: socket.id });
  }
}
