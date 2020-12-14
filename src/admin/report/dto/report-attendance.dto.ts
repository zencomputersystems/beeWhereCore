import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReportAttendanceDTO {
  @ApiModelProperty({ description: 'Start date', example: '2020-11-01' })
  @IsNotEmpty()
  @IsString()
  startdate: string;
  @ApiModelProperty({ description: 'End date', example: '2020-11-30' })
  @IsNotEmpty()
  @IsString()
  enddate: string;
  @ApiModelProperty({ description: 'User id', example: 'abc,abc' })
  @IsNotEmpty()
  @IsString()
  userid: string;
}