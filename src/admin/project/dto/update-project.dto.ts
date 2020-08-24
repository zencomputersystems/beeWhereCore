import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateProjectDTO {
  @ApiModelProperty({ description: 'Project id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiModelProperty({ description: 'Client id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @ApiModelProperty({ description: 'Client name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ description: 'Soc no.', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  socNo: string;

  @ApiModelProperty({ description: 'Description', example: 'Migrate server' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiModelProperty({ description: 'Status active', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  status: number;

}