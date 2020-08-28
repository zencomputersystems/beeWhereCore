import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateSupportDTO {
  @ApiModelProperty({ description: 'Request type', enum: ['clocks', 'overtime', 'suggestion'] })
  @IsString()
  requestType: string;
  @ApiModelProperty({ description: 'Subject', example: 'Forget to clockout' })
  @IsString()
  subject: string;
  @ApiModelProperty({ description: 'Start time for ot and clock', example: 678623785 })
  @IsNumber()
  @IsOptional()
  starttime: number;
  @ApiModelProperty({ description: 'End time for ot and clock', example: 732648692 })
  @IsNumber()
  @IsOptional()
  endtime: number;
  @ApiModelProperty({ description: 'Supporting document', example: '2397489_image.jpg' })
  @IsString()
  supportingDoc: string;
  @ApiModelProperty({ description: 'Description', example: 'Ot for LHDN project' })
  @IsString()
  description: string;
  @ApiModelProperty({ description: 'User id', example: '19e05640-e066-11ea-af91-59951dfe7847' })
  @IsString()
  userGuid: string;
  @ApiModelProperty({ description: 'User email', example: 'kenna.ratke35@ethereal.email' })
  @IsString()
  userEmail: string;
}