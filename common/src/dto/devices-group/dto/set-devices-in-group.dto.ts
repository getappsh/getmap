import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class SetChildInGroupDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  devices: string[];


  @ApiProperty({ required: false })
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  groups: number[];

  toString() {
    return JSON.stringify(this);
  }

}
