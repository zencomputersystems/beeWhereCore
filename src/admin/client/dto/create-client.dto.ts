import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class DataDetailsDTO {
  @ApiModelProperty({ description: 'Name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiModelProperty({ description: 'Code', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  code: string;
  @ApiModelProperty({ description: 'Description', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class LocationDetailsDTO {
  @ApiModelProperty({ description: 'Client name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  lat: string;
  @ApiModelProperty({ description: 'Client name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  long: string;
  @ApiModelProperty({ description: 'Client name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class CreateClientDTO {

  @ApiModelProperty({ description: 'Client name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ description: 'Client abbr', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  abbr: string;

  @ApiModelProperty({ description: 'Client location', type: [LocationDetailsDTO] })
  @IsNotEmpty()
  @Type(() => LocationDetailsDTO)
  location: LocationDetailsDTO[];

  @ApiModelProperty({ description: 'Client name', type: [DataDetailsDTO] })
  @IsNotEmpty()
  @Type(() => DataDetailsDTO)
  project: DataDetailsDTO[];

  @ApiModelProperty({ description: 'Client name', type: [DataDetailsDTO] })
  @IsNotEmpty()
  @Type(() => DataDetailsDTO)
  contract: DataDetailsDTO[];
}