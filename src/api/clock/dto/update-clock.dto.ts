import { LatLongDTO } from "./create-clock.dto";
import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class UpdateClockDTO {
  @ApiModelProperty({ description: 'Clock log id', example: '098bf05d-0862-cb50-dbc2-d4068b91f246' })
  @IsNotEmpty()
  @IsString()
  clockLogGuid: string;
  @ApiModelProperty({ description: 'Clock time', example: 1596609226 })
  @IsNotEmpty()
  @IsNumber()
  clockTime: number;
  @ApiModelProperty({ description: 'Location', type: LatLongDTO })
  @IsNotEmpty()
  @Type(() => LatLongDTO)
  location: LatLongDTO;
  @ApiModelProperty({ description: 'User agent', example: 'abc' })
  userAgent: string;
}