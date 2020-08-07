import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Type } from "class-transformer";

export class ActivityClockDetailsDTO {
  @ApiModelProperty({ description: 'Location', example: 'Update system' })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiModelProperty({ description: 'Location', example: true })
  @IsNotEmpty()
  @IsBoolean()
  statusFlag: boolean;
}

export class ActivityClockDTO {
  @ApiModelProperty({ description: 'Location', example: '098bf05d-0862-cb50-dbc2-d4068b91f246' })
  @IsNotEmpty()
  @IsString()
  clockLogGuid: string;
  @ApiModelProperty({ description: 'Location', type: [ActivityClockDetailsDTO] })
  @IsNotEmpty()
  @Type(() => ActivityClockDetailsDTO)
  activity: ActivityClockDetailsDTO[];
}