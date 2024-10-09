import { Body, Controller, Post } from '@nestjs/common';
import { CtrlService } from './ctrl.service';

@Controller('ctrl')
export class CtrlController {
    constructor(private ctrlService: CtrlService) {}

    @Post('control')
    async controlCtrl(@Body() controlData: { dir: string }): Promise<string> {
        const { dir } = controlData;
        console.log(controlData);

        try {
            await this.ctrlService.sendControlMessage(dir);
            return `Control message sent via MQTT: ${dir}`;
        } catch (error) {
            return `Error sending control message via MQTT: ${error.message}`;
        }
    }
}
