import { ApiModelProperty } from "@nestjs/swagger";
import { IsString, IsArray } from 'class-validator';
import { CreateClarificationDTO } from './create-clarification.dto';

export class CreateAdminClarificationDTO extends CreateClarificationDTO {
  @ApiModelProperty({ description: 'Status', example: 'approved' })
  @IsString()
  status: string;
}