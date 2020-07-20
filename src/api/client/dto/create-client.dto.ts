import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateClientDTO {
  @ApiModelProperty({ description: 'Client name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ description: 'Client abbr', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  abbr: string;

  @ApiModelProperty({ description: 'Client latitude', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiModelProperty({ description: 'Client longitude', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  longitude: string;
}