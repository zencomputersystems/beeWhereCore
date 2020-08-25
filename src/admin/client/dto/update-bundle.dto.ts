import { UpdateClientDTO } from './update-client.dto';
import { UpdateProjectDTO } from '../../project/dto/update-project.dto';
import { UpdateContractDTO } from '../../contract/dto/update-contract.dto';
import { UpdateLocationDTO } from '../../location/dto/update-location.dto';
import { CreateProjectDTO } from '../../project/dto/create-project.dto';
import { CreateContractDTO } from '../../contract/dto/create-contract.dto';
import { CreateLocationDTO } from '../../location/dto/create-location.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Type, Transform, Exclude } from 'class-transformer';
import { SerializeOptions } from '@nestjs/common';

export class DeleteDetailsDTO {
  @ApiModelProperty({ description: 'Id' })
  @IsString()
  @IsOptional()
  id: string;
}

export class DeleteBundleDTO {
  @ApiModelProperty({ description: 'Add location', type: [DeleteDetailsDTO] })
  @IsNotEmpty()
  @Type(() => DeleteDetailsDTO)
  project: DeleteDetailsDTO[];
  @ApiModelProperty({ description: 'Add location', type: [DeleteDetailsDTO] })
  @IsNotEmpty()
  @Type(() => DeleteDetailsDTO)
  contract: DeleteDetailsDTO[];
  @ApiModelProperty({ description: 'Add location', type: [DeleteDetailsDTO] })
  @IsNotEmpty()
  @Type(() => DeleteDetailsDTO)
  location: DeleteDetailsDTO[];
}

export class PostBundleDTO {
  @ApiModelProperty({ description: 'Add location', type: [CreateProjectDTO] })
  @IsNotEmpty()
  @Type(() => CreateProjectDTO)
  project: CreateProjectDTO[];
  @ApiModelProperty({ description: 'Add location', type: [CreateContractDTO] })
  @IsNotEmpty()
  @Type(() => CreateContractDTO)
  contract: CreateContractDTO[];
  @ApiModelProperty({ description: 'Add location', type: [CreateLocationDTO] })
  @IsNotEmpty()
  @Type(() => CreateLocationDTO)
  location: CreateLocationDTO[];
}

export class PatchBundleDTO {
  @ApiModelProperty({ description: 'Client update', type: [UpdateClientDTO] })
  @IsNotEmpty()
  @Type(() => UpdateClientDTO)
  client: UpdateClientDTO[];
  @ApiModelProperty({ description: 'Project update', type: [UpdateProjectDTO] })
  @IsNotEmpty()
  @Type(() => UpdateProjectDTO)
  project: UpdateProjectDTO[];
  @ApiModelProperty({ description: 'Contract update', type: [UpdateContractDTO] })
  @IsNotEmpty()
  @Type(() => UpdateContractDTO)
  contract: UpdateContractDTO[];
  @ApiModelProperty({ description: 'Location update', type: [UpdateLocationDTO] })
  @IsNotEmpty()
  @Type(() => UpdateLocationDTO)
  location: UpdateLocationDTO[];
}

export class UpdateClientBundleDTO {
  // @ApiModelProperty({ description: 'Client id', example: 'abc' })
  // @IsNotEmpty()
  // @IsString()
  // clientId: string;
  @ApiModelProperty({ description: 'Patch bundle', type: PatchBundleDTO })
  @IsNotEmpty()
  @Type(() => PatchBundleDTO)
  patch: PatchBundleDTO;
  @ApiModelProperty({ description: 'Post bundle', type: PostBundleDTO })
  @IsNotEmpty()
  @Type(() => PostBundleDTO)
  post: PostBundleDTO;
  @ApiModelProperty({ description: 'Delete bundle', type: DeleteBundleDTO })
  @IsNotEmpty()
  @Type(() => DeleteBundleDTO)
  delete: DeleteBundleDTO;
}