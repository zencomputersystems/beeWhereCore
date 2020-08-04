import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateContractDTO {
  @ApiModelProperty({ description: 'Contract id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  contractId: string;

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

  @ApiModelProperty({ description: 'Description', example: 'Migrate server' })
  @IsNotEmpty()
  @IsString()
  description: string;
}