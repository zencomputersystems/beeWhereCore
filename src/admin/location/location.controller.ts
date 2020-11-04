import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param, HttpModule, UseInterceptors, UploadedFile } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam, ApiImplicitFile } from "@nestjs/swagger";
import { LocationService } from "./location.service";
import { CreateLocationDTO } from "./dto/create-location.dto";
import { UpdateLocationDTO } from "./dto/update-location.dto";
import { runGetServiceV2, runCreateService, runUpdateService } from '../../common/helper/basic-function.service';
import { FileInterceptor } from "@nestjs/platform-express/multer/interceptors/file.interceptor";
import parse = require('csv-parse/lib/sync');
import { map, mergeMap } from "rxjs/operators";
import { ClientProfileDbService } from "../../common/db/table.db.service";
import { ClientLocationModel } from '../../common/model/client-location.model';
import { v1 } from 'uuid';
import { Resource } from "../../common/model/resource.model";
import { of } from "rxjs";

@Controller('api/location')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly clientProfileDbService: ClientProfileDbService
  ) { }

  @Post()
  @ApiOperation({ title: 'Add Location to client', description: 'Add Location to client' })
  createLocation(@Body() createLocationData: CreateLocationDTO, @Req() req, @Res() res) {
    runCreateService([this.locationService.createLocation([createLocationData]), res]);
  }

  @Patch()
  @ApiOperation({ title: 'Update client Location', description: 'Update client Location' })
  updateLocation(@Body() updateLocationData: UpdateLocationDTO, @Req() req, @Res() res) {
    runUpdateService([this.locationService.updateLocation([updateLocationData]), res]);
  }

  @Get()
  @ApiOperation({ title: 'Get all Location', description: 'Get all Location' })
  getAllLocation(@Req() req, @Res() res) {
    runGetServiceV2([this.locationService.getAllLocation([req]), res]);
  }

  @Get(':clientid')
  @ApiOperation({ title: 'Get client Location', description: 'Get client Location' })
  @ApiImplicitParam({ name: 'clientid' })
  createClient(@Param('clientid') clientId, @Req() req, @Res() res) {
    runGetServiceV2([this.locationService.getOneLocation([clientId]), res]);
  }

  @Get('search/:input')
  @ApiOperation({ title: 'Get search Location', description: 'Get search Location' })
  @ApiImplicitParam({ name: 'input', description: 'Search input', required: true })
  searchLocation(@Param('input') input, @Req() req, @Res() res) {
    let method = `/place/autocomplete/json?radius=500&components=country:MY&input=${input}`;
    this.googleApiProcess([method, res]);
  }

  @Get('search/:type/:input')
  @ApiOperation({ title: 'Get search Location', description: 'Get search Location' })
  @ApiImplicitParam({ name: 'type', description: 'Search by coordinate or address', enum: ['coordinate', 'address'], required: true })
  @ApiImplicitParam({ name: 'input', description: 'Search input', required: true })
  searchLocationByLat(@Param() params, @Req() req, @Res() res) {
    let method;
    if (params.type === 'coordinate')
      method = `/geocode/json?latlng=${params.input}`;
    else
      method = `/geocode/json?address=${params.input}`;
    this.googleApiProcess([method, res]);
  }

  @Post('csv')
  @ApiImplicitFile({ name: 'file', required: true, description: 'The file to upload' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ title: 'Import location from CSV list' })
  async importCSV(@UploadedFile() file, @Req() req, @Res() res) {
    if (!req.file) {
      res.status(400).send("File is null");
    }

    const records = parse(file.buffer, {
      columns: true,
      skip_empty_lines: true,
      skip_lines_with_empty_values: true
    })
    // console.log(records);
    let failedlist = [];
    let successList = [];
    this.clientProfileDbService.findByFilterV4([[], [`(TENANT_GUID=${req.user.TENANT_GUID})`], null, null, null, [], null]).pipe(
      mergeMap(res1 => {
        let resource = new Resource(new Array);
        records.forEach(element => {

          let clientInfo = res1.find(x => x.NAME === element.client_name || x.ABBR === element.client_name);

          if (clientInfo == undefined) {
            failedlist.push(element.client_name);
          } else {
            let model = new ClientLocationModel();
            model.LOCATION_GUID = v1();
            model.CLIENT_GUID = clientInfo.CLIENT_GUID;
            model.ADDRESS = element.address;
            model.LATITUDE = element.latitude;
            model.LONGITUDE = element.longitude;
            model.STATUS = 1;
            resource.resource.push(model);

            successList.push(element.client_name);
          }
        });

        return this.locationService.clientLocationDbService.createByModel([resource, [], [], []]);
        // return of('ok');
        // return of(res1);
      })
    ).subscribe(
      data => {
        res.send(data.data.resource);
        // res.send(data);
      },
      err => {
        res.send(err);
      }
    );

    // res.send('ok');
    // let method = this.subscriptionDbService.findByFilterV2([], [`(CUSTOMER_GUID=${req.user.TENANT_GUID})`]);
    // let quotaData = await runServiceCallback(method);

    // // console.log(quotaData[0].ACTIVE_QUOTA);
    // // console.log(quotaData[0].USED_QUOTA);
    // // console.log(records.length);
    // let balanceQuota = quotaData[0].ACTIVE_QUOTA - quotaData[0].USED_QUOTA;

    // if (records.length <= balanceQuota) //  quotaData[0].ACTIVE_QUOTA_LIST)
    // 	// this.runService([req.user, userInviteDto, res]); 
    // 	this.runService([req.user, records, res]);
    // // res.send('data');
    // else
    // 	res.send(new BadRequestException(`You don't have enough quota to add users. Total quota is ${quotaData[0].ACTIVE_QUOTA} and only ${balanceQuota} left. You try to import ${records.length} users.`));

    // // this.runService([req.user, records, res]);
  }

  public googleApiProcess([method, res]) {
    const headersRequestTemp = {
      'X-Dreamfactory-API-Key': process.env.GOOGLE_API_DF_KEY || '36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88',
    };

    const hostGoogleDF = process.env.HOST_GOOGLE_API || `http://api.zen.com.my/api/v2/google`;

    method = hostGoogleDF + method;
    this.locationService.clientLocationDbService.httpService.get(method, { headers: headersRequestTemp }).subscribe(
      data => {
        res.send(data.data);
      },
      err => { res.send(err); }
    );
  }

}