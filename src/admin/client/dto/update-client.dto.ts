import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClientDTO {

  @ApiModelProperty({ description: 'Client id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiModelProperty({ description: 'Client name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ description: 'Client abbr', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  abbr: string;
}