import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateLocationDTO {
  @ApiModelProperty({ description: 'Client id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @ApiModelProperty({ description: 'Latitude', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiModelProperty({ description: 'Longitude', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @ApiModelProperty({ description: 'Address', example: 'No 5, Jalan 5, Taman 5, 60900, Selangor, Malaysia' })
  @IsNotEmpty()
  @IsString()
  address: string;
}