import { Injectable, BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CtrlService {
    private client: mqtt.MqttClient;
    private readonly logger = new Logger(CtrlService.name);

    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,) {
        // MQTT 브로커에 연결
        this.client = mqtt.connect('http://138.2.114.212/1880/');

        this.client.on('connect', () => {
            this.logger.log('MQTT 브로커에 연결됨');
        });

        this.client.on('error', (error) => {
            this.logger.error(`MQTT 연결 오류: ${error}`);
        });
    }

    async sendControlMessage( token: string, dir: string,status: string): Promise<void> {
        let username: string;
        try {
            console.log(token);
            const decoded = this.jwtService.verify(token);
            username = decoded.username; // JWT에서 username 추출
        } catch (error) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        console.log(username, dir, status);

        const validDirections = ['left', 'right', 'forward', 'back', 'fall'];
        
        if (!validDirections.includes(dir)) {
            throw new BadRequestException(`유효하지 않은 방향: ${dir}`);
        }
        let message= dir + "status" +status;

        this.logger.log(`메시지 발행: ${message}`);

        // MQTT에 메시지 발행
        return new Promise((resolve, reject) => {
            this.client.publish('control/topic', message, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async onModuleDestroy() {
        this.client.end(() => {
            this.logger.log('MQTT 클라이언트 연결 종료');
        });
    }
}
