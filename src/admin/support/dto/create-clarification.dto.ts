import { ApiModelProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateClarificationDTO {
  @ApiModelProperty({ description: 'Support id', example: 'hwevbfkh' })
  @IsString()
  supportId: string;
  @ApiModelProperty({ description: 'User id', example: 'hgdwjhdbh' })
  @IsString()
  userId: string;
  @ApiModelProperty({ description: 'Supporting document', example: 'image.jpg' })
  @IsString()
  doc: string;
  @ApiModelProperty({ description: 'Message', example: 'Please describe more details on this issue' })
  @IsString()
  message: string;
}