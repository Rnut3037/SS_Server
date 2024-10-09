import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class CtrlService {
    private client: mqtt.MqttClient;

    constructor() {
        // MQTT 브로커에 연결
        this.client = mqtt.connect('mqtt://your-mqtt-broker-url');

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
        });

        this.client.on('error', (error) => {
            console.error(`MQTT connection error: ${error}`);
        });
    }

    async sendControlMessage(dir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let message: string;

            // dir 값에 따라 메시지를 설정
            switch (dir) {
                case 'left':
                    message = 'left';
                    break;
                case 'right':
                    message = 'right';
                    break;
                case 'forward':
                    message = 'forward';
                    break;
                case 'back':
                    message = 'back';
                    break;
                case 'fall':
                    message = 'fall';
                    break;
                default:
                    message = 'invalid direction';
            }

            console.log(`Publishing message: ${message}`);

            // MQTT에 메시지 발행
            this.client.publish('control/topic', message, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}
