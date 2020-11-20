import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class LatLongDTO {
  @ApiModelProperty({ description: 'Latitude', example: '2.92331331' })
  @IsNotEmpty()
  @IsNumber()
  lat: number;
  @ApiModelProperty({ description: 'Longitude', example: '101.71002099' })
  @IsNotEmpty()
  @IsNumber()
  long: number;
  @ApiModelProperty({ description: 'Location name', example: 'No 10, jalan 10, Taman 13, 131000, Selangor, Malaysia' })
  @IsNotEmpty()
  @IsString()
  name: string;

}

export class UserAgentXMLDTO {
  @ApiModelProperty({ description: 'Description', example: 'Description' })
  @IsOptional()
  @IsString()
  description: string;
  @ApiModelProperty({ description: 'Public ip', example: 'Public ip' })
  @IsOptional()
  @IsString()
  publicIP: string;
  @ApiModelProperty({ description: 'Device id', example: 'Device id' })
  @IsOptional()
  @IsString()
  deviceID: string;
}

export class CreateClockDTO {
  @ApiModelProperty({ description: 'User id', example: '098bf05d-0862-cb50-dbc2-d4068b91f246' })
  @IsNotEmpty()
  @IsString()
  userGuid: string;
  @ApiModelProperty({ description: 'Clock time', example: 1596609226 })
  @IsNotEmpty()
  @IsNumber()
  clockTime: number;
  @ApiModelProperty({ description: 'Job type', example: 'site' })
  @IsNotEmpty()
  @IsString()
  jobType: string;
  @ApiModelProperty({ description: 'Location', type: LatLongDTO })
  @IsNotEmpty()
  @Type(() => LatLongDTO)
  location: LatLongDTO;
  @ApiModelProperty({ description: 'Client id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  clientId: string;
  @ApiModelProperty({ description: 'Project id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  projectId: string;
  @ApiModelProperty({ description: 'Contract id', example: 'abc' })
  @IsNotEmpty()
  @IsString()
  contractId: string;
  @ApiModelProperty({ description: 'User agent', type: UserAgentXMLDTO })
  @IsOptional()
  @Type(() => UserAgentXMLDTO)
  userAgent: UserAgentXMLDTO;
}