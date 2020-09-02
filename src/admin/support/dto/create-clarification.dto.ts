import { ApiModelProperty } from "@nestjs/swagger";
import { IsString, IsArray } from 'class-validator';

export class CreateClarificationDTO {
  @ApiModelProperty({ description: 'Support id', example: '3d0458f0-9725-11e9-95ae-0f5d05c199b7' })
  @IsString()
  supportId: string;
  @ApiModelProperty({ description: 'User id', example: '697b25ac-bff1-b1d1-f17e-fa0206fc7a2a' })
  @IsString()
  userId: string;
  @ApiModelProperty({ description: 'Supporting document', example: "6987604_secondfile.jpg" })
  @IsString()
  doc: string;
  @ApiModelProperty({ description: 'Message', example: 'Dear all,\n\n  In accordance with Hari Raya celebration, we would like to request all staff to take 1 day annual leave due to a close down of operations on 7 June 2019. Kindly apply annual leave for the low productivity period and take this as an opportunity to have a substantial break for family. \n  \n  This is not applicable to Manage365 and backup of Resident Engineer.\n' })
  @IsString()
  message: string;
}