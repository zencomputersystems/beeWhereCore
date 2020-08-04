import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateProjectDTO {
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
}