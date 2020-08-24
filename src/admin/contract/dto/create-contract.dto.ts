import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateContractDTO {
  @ApiModelProperty({ description: 'Client id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @ApiModelProperty({ description: 'Client name', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiModelProperty({ description: 'Contract no.', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  contractNo: string;

  @ApiModelProperty({ description: 'Description', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiModelProperty({ description: 'Status active', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  status: number;
}