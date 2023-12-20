import { ApiProperty,  } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";


enum ErrorCode {
  MAP_OTHER = 'MAP.other',
  MAP_REQUESTED_IN_PROCESSING = 'MAP.requestInProgress',
  MAP_AREA_TOO_LARGE = "MAP.areaTooLarge",
  MAP_AREA_TOO_SMALL = "MAP.areaTooSmall",
}

export class ErrorDto{

  @ApiProperty({
    enum: ErrorCode, description: 
    "`MAP.other`: Error code not listed in the enum <br /> " +
    "`MAP.requestInProgress`: Delivery was already requested and in processing! <br /> " +
    "`MAP.areaTooLarge`: Area too large to distribute, reduce request size and try again <br /> " +
    "`MAP.areaTooSmall`: Area too small to distribute, increase request size and try again . "
  })
  @IsEnum(ErrorCode)
  errorCode: ErrorCode;

  @ApiProperty({required: false})
  @IsString()
  message: string;
}


