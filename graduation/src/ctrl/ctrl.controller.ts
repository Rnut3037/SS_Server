import { Body, Controller, Post,Headers, UnauthorizedException } from '@nestjs/common';
import { CtrlService } from './ctrl.service';

@Controller('ctrl')
export class CtrlController {
    constructor(private ctrlService: CtrlService) {}

    @Post('control')
    async controlCtrl(
        @Body() controlData: { dir: string, status: string },
        @Headers('authorization') authHeader: string,
    ): Promise<string> {
        // JWT 토큰 추출
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authorization 헤더가 필요합니다.');
        }
        const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형식에서 토큰 부분 추출

        const { dir, status } = controlData;
    
        try {
            await this.ctrlService.sendControlMessage(token, dir, status); // token 전달
            return `Control message sent via MQTT: ${dir}`;
        } catch (error) {
            return `Error sending control message via MQTT: ${error.message}`;
        }
    }
}
