import { Body, Controller, Post } from '@nestjs/common';
import { CtrlService } from './ctrl.service';

@Controller('ctrl')
export class CtrlController {
    constructor(private ctrlService: CtrlService) {}

    @Post('control')
    async controlCtrl(@Body() controlData: { userId: string , dir: string}): Promise<string> {
        const { userId,dir } = controlData;
        console.log(controlData);   

        try {
            await this.ctrlService.sendControlMessage(dir,userId);
            return `Control message sent via MQTT: ${dir}`;
        } catch (error) {
            return `Error sending control message via MQTT: ${error.message}`;
        }
    }
}
