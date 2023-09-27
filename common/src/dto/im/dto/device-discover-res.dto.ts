import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ComponentDto } from "../../discovery";

export class DeviceDiscoverResDto{

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDateString()
  produceTime: Date;

  @ApiProperty({type: [ComponentDto]})
  @ValidateNested({each:true})
  @IsArray()
  @Type(() => ComponentDto)
  comps: ComponentDto[]
}