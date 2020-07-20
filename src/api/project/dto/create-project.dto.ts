import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDTO {
  @ApiModelProperty({ description: 'Project name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ description: 'Project soc no', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  soc_no: string;

  @ApiModelProperty({ description: 'Project description', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  description: string;

}