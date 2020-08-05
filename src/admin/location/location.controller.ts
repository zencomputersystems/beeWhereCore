import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { LocationService } from "./location.service";
import { CreateLocationDTO } from "./dto/create-location.dto";
import { UpdateLocationDTO } from "./dto/update-location.dto";

@Controller('api/location')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) { }
  @Post()
  @ApiOperation({ title: 'Add Location to client', description: 'Add Location to client' })
  createLocation(@Body() createLocationData: CreateLocationDTO, @Req() req, @Res() res) {
    this.locationService.createLocation([createLocationData]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Patch()
  @ApiOperation({ title: 'Update client Location', description: 'Update client Location' })
  updateLocation(@Body() updateLocationData: UpdateLocationDTO, @Req() req, @Res() res) {
    this.locationService.updateLocation([updateLocationData]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Get()
  @ApiOperation({ title: 'Get all Location', description: 'Get all Location' })
  getAllLocation(@Req() req, @Res() res) {
    this.locationService.getAllLocation([req]).subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

  @Get(':clientid')
  @ApiOperation({ title: 'Get client Location', description: 'Get client Location' })
  @ApiImplicitParam({ name: 'clientid' })
  createClient(@Param('clientid') clientId, @Req() req, @Res() res) {
    this.locationService.getOneLocation([clientId]).subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

}