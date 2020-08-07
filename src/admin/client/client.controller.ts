import { Controller, Post, Res, Patch, Get, UseGuards, Body, Req, Param, Delete } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { ClientService } from './client.service';
import { AuthGuard } from "@nestjs/passport";
import { CreateClientDTO } from './dto/create-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';
import { type } from "os";

@Controller('api/client')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ClientController {
  constructor(private readonly clientService: ClientService) { }
  @Post()
  @ApiOperation({ title: 'Create client', description: 'Create client' })
  createClient(@Body() createClientData: CreateClientDTO, @Req() req, @Res() res) {
    this.clientService.createClient([createClientData, req]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Patch()
  @ApiOperation({ title: 'Update client', description: 'Update client' })
  updateClient(@Body() updateClientData: UpdateClientDTO, @Req() req, @Res() res) {
    this.clientService.updateClient([updateClientData, req]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Get(':type')
  @ApiOperation({ title: 'Get client', description: 'Get client' })
  @ApiImplicitParam({ name: 'type', description: 'simple or detail', enum: ['simple', 'detail'], required: true })
  findClient(@Param('type') type, @Res() res) {
    this.clientService.getClient([type]).subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

  @Get('coordinate/:latitude/:longitude')
  @ApiOperation({ title: 'Get client', description: 'Get client' })
  @ApiImplicitParam({ name: 'latitude', description: 'Latitude', required: true })
  @ApiImplicitParam({ name: 'longitude', description: 'Longitude', required: true })
  getClientByCoordinates(@Param() params, @Res() res) {
    this.clientService.getByCoordinate([params.latitude, params.longitude]).subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

  @Delete(':clientId')
  @ApiOperation({ title: 'Delete client', description: 'Delete client' })
  @ApiImplicitParam({ name: 'clientId', description: 'Client guid', required: true })
  deleteClient(@Param('clientId') clientId, @Res() res) {
    this.clientService.deleteClient([clientId]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }
}