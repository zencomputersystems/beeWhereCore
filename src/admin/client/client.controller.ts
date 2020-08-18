import { Controller, Post, Res, Patch, Get, UseGuards, Body, Req, Param, Delete } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { ClientService } from './client.service';
import { AuthGuard } from "@nestjs/passport";
import { CreateClientDTO } from './dto/create-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';
import { type } from "os";
import { runGetServiceV2, runCreateService, runUpdateService } from '../../common/helper/basic-function.service';

@Controller('api/client')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ClientController {
  constructor(private readonly clientService: ClientService) { }
  @Post()
  @ApiOperation({ title: 'Create client', description: 'Create client' })
  createClient(@Body() createClientData: CreateClientDTO, @Req() req, @Res() res) {
    runCreateService([this.clientService.createClient([createClientData, req]), res]);
  }

  @Patch()
  @ApiOperation({ title: 'Update client', description: 'Update client' })
  updateClient(@Body() updateClientData: UpdateClientDTO, @Req() req, @Res() res) {
    runUpdateService([this.clientService.updateClient([updateClientData, req]), res]);
  }

  @Get(':type')
  @ApiOperation({ title: 'Get client', description: 'Get client' })
  @ApiImplicitParam({ name: 'type', description: 'simple or detail', enum: ['simple', 'detail'], required: true })
  findClient(@Param('type') type, @Res() res) {
    runGetServiceV2([this.clientService.getClient([type]), res])
  }

  @Get('coordinate/:latitude/:longitude')
  @ApiOperation({ title: 'Get client', description: 'Get client' })
  @ApiImplicitParam({ name: 'latitude', description: 'Latitude', required: true })
  @ApiImplicitParam({ name: 'longitude', description: 'Longitude', required: true })
  getClientByCoordinates(@Param() params, @Res() res) {
    runGetServiceV2([this.clientService.getByCoordinate([params.latitude, params.longitude]), res]);
  }

  @Delete(':clientId')
  @ApiOperation({ title: 'Delete client', description: 'Delete client' })
  @ApiImplicitParam({ name: 'clientId', description: 'Client guid', required: true })
  deleteClient(@Param('clientId') clientId, @Res() res) {
    runUpdateService([this.clientService.deleteClient([clientId]), res]);
  }
}