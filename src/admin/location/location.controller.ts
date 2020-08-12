import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param, HttpModule } from "@nestjs/common";
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

  @Get('search/:input')
  @ApiOperation({ title: 'Get search Location', description: 'Get search Location' })
  @ApiImplicitParam({ name: 'input' })
  searchLocation(@Param('input') input, @Req() req, @Res() res) {

    const headersRequestTemp = {
      'X-Dreamfactory-API-Key': process.env.GOOGLE_API_DF_KEY || '36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88',
    };

    const hostGoogleDF = process.env.HOST_GOOGLE_API || `http://api.zen.com.my/api/v2/google`;
    let method = hostGoogleDF + `/place/autocomplete/json?input=${input}`;
    this.locationService.clientLocationDbService.httpService.get(method, { headers: headersRequestTemp }).subscribe(
      data => {
        res.send(data.data);
      },
      err => { res.send(err); }
    );
  }
}