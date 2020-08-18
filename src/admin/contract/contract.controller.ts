import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { ContractService } from "./contract.service";
import { CreateContractDTO } from "./dto/create-contract.dto";
import { UpdateContractDTO } from "./dto/update-contract.dto";
import { runGetServiceV2, runCreateService, runUpdateService } from '../../common/helper/basic-function.service';

@Controller('api/contract')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ContractController {
  constructor(private readonly ContractService: ContractService) { }
  @Post()
  @ApiOperation({ title: 'Add Contract to client', description: 'Add Contract to client' })
  createContract(@Body() createContractData: CreateContractDTO, @Req() req, @Res() res) {
    runCreateService([this.ContractService.createContract([createContractData]), res]);
  }

  @Patch()
  @ApiOperation({ title: 'Update client Contract', description: 'Update client Contract' })
  updateContract(@Body() updateContractData: UpdateContractDTO, @Req() req, @Res() res) {
    runUpdateService([this.ContractService.updateContract([updateContractData]), res]);
  }

  @Get()
  @ApiOperation({ title: 'Get all Contract', description: 'Get all Contract' })
  getAllContract(@Req() req, @Res() res) {
    runGetServiceV2([this.ContractService.getAllContract([req]), res]);
  }

  @Get(':clientid')
  @ApiOperation({ title: 'Get client Contract', description: 'Get client Contract' })
  @ApiImplicitParam({ name: 'clientid' })
  createClient(@Param('clientid') clientId, @Req() req, @Res() res) {
    runGetServiceV2([this.ContractService.getOneContract([clientId]), res]);
  }

}