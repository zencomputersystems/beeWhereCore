import { CreateClientDTO } from './create-client.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClientDTO extends CreateClientDTO {
  @ApiModelProperty({ description: 'Profile id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  id: string;
}