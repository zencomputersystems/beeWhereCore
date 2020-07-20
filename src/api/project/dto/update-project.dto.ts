import { CreateProjectDTO } from './create-project.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProjectDTO extends CreateProjectDTO {
  @ApiModelProperty({ description: 'Project id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  id: string;
}