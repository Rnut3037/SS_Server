import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CtrlService {
    private client: mqtt.MqttClient;
    private readonly logger = new Logger(CtrlService.name);

    constructor(private readonly authService: AuthService) {
        // MQTT 브로커에 연결
        this.client = mqtt.connect('mqtt://localhost:1883');

        this.client.on('connect', () => {
            this.logger.log('MQTT 브로커에 연결됨');
        });

        this.client.on('error', (error) => {
            this.logger.error(`MQTT 연결 오류: ${error}`);
        });
    }

    async sendControlMessage( username: string, dir: string): Promise<void> {
        let message: string;

        const validDirections = ['left', 'right', 'forward', 'forward-left', 'forward-right', 'back', 'back-left', 'back-right', 'fall'];

        if (!validDirections.includes(dir)) {
            throw new BadRequestException(`유효하지 않은 방향: ${dir}`);
        }

        message = dir;

        this.logger.log(`메시지 발행: ${message}`);

        // dir 값이 'fall'일 경우 코인 차감
        if (dir === 'fall') {
            try {
                await this.authService.deductCoins(username); // 유저의 코인 차감
            } catch (error) {
                throw new BadRequestException(error.message); // 에러 메시지 반환
            }
        }

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
