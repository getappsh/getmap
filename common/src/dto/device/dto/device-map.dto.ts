import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class DeviceMapDto {

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({required: false})
  @IsString()
  zadikNumber: string


  @ApiProperty({required: false})
  @IsString()
  hardware: string

  @ApiProperty({required: false})
  @IsNotEmpty()
  formation: string

  @ApiProperty({required: false})
  @IsString()
  availableStorage: string

  @ApiProperty({required: false})
  @Min(0)
  @Max(100)
  power: number;

  @ApiProperty({required: false})
  @IsNumber()
  bandwidth: number;

  toString(){
    return JSON.stringify(this);
  }
}