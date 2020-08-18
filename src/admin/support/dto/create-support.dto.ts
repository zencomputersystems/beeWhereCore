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
  @ApiModelProperty({ description: 'User id', example: 'hf73289hf7h7fef7h93ejfbkq983y47' })
  @IsString()
  userGuid: string;
  @ApiModelProperty({ description: 'User email', example: 'tarmimi@zen.com.my' })
  @IsString()
  userEmail: string;
}