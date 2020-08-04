import { Controller, Post, Res, Patch, Get, UseGuards, Body, Req } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ClientService } from './client.service';
import { AuthGuard } from "@nestjs/passport";
import { CreateClientDTO } from './dto/create-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';

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

  @Get()
  @ApiOperation({ title: 'Get client', description: 'Get client' })
  findClient(@Res() res) {
    this.clientService.getClient().subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

}