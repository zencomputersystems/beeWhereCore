import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateLocationDTO {
  @ApiModelProperty({ description: 'Location id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  locationId: string;

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

  @ApiModelProperty({ description: 'Address', example: 'No 3, Jalan 3, Taman 3, 60030, Selangor, Malaysia' })
  @IsNotEmpty()
  @IsString()
  address: string;
}