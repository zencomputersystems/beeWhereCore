import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Type } from 'class-transformer';
import { type } from 'os';

export class LoginLogActivityDTO {
  @ApiModelProperty({ description: 'Timestamp in seconds', example: '1601622975' })
  @IsNotEmpty()
  @IsString()
  timestamp: string;

  @ApiModelProperty({ description: 'Activity', example: 'login' })
  @IsNotEmpty()
  @IsString()
  activity: string;
}

export class UpdateLoginLogActivityDTO {
  @ApiModelProperty({ description: 'Login id', example: '258e23f0-06bd-11eb-8c59-39393fa54b49' })
  @IsNotEmpty()
  @IsString()
  loginId: string;

  @ApiModelProperty({ description: 'Activities', type: [LoginLogActivityDTO] })
  @IsNotEmpty()
  @Type(() => LoginLogActivityDTO)
  activities: LoginLogActivityDTO[];
}