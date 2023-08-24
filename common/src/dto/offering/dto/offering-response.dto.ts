import { ApiProperty } from "@nestjs/swagger";
import { PlatformDto } from "@app/root/api/src/modules/device/dto/discovery/discovery-software.dto";


export class OfferingResponseDto{
    @ApiProperty({required: false})
    isNewVersion: boolean;

    @ApiProperty({required: false})
    platform: PlatformDto;

    toString(){
        return JSON.stringify(this)
    }
}