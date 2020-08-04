import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { ContractService } from "./Contract.service";
import { CreateContractDTO } from "./dto/create-Contract.dto";
import { UpdateContractDTO } from "./dto/update-Contract.dto";

@Controller('api/contract')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ContractController {
  constructor(private readonly ContractService: ContractService) { }
  @Post()
  @ApiOperation({ title: 'Add Contract to client', description: 'Add Contract to client' })
  createContract(@Body() createContractData: CreateContractDTO, @Req() req, @Res() res) {
    this.ContractService.createContract([createContractData]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Patch()
  @ApiOperation({ title: 'Update client Contract', description: 'Update client Contract' })
  updateContract(@Body() updateContractData: UpdateContractDTO, @Req() req, @Res() res) {
    this.ContractService.updateContract([updateContractData]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Get()
  @ApiOperation({ title: 'Get all Contract', description: 'Get all Contract' })
  getAllContract(@Req() req, @Res() res) {
    this.ContractService.getAllContract([req]).subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

  @Get(':clientid')
  @ApiOperation({ title: 'Get client Contract', description: 'Get client Contract' })
  @ApiImplicitParam({ name: 'clientid' })
  createClient(@Param('clientid') clientId, @Req() req, @Res() res) {
    this.ContractService.getOneContract([clientId]).subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

}