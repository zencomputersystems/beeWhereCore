import { AzureStorageService } from "@nestjs/azure-storage";
import { Controller, Get, Logger, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express/multer/interceptors";
import { ApiBearerAuth, ApiImplicitFile, ApiOperation } from "@nestjs/swagger";
import parse = require("csv-parse/lib/sync");
import { map, mergeMap } from "rxjs/operators";
import { runGetServiceV2 } from "../../common/helper/basic-function.service";

import { ClockImportService } from './clock-import.service';

@Controller('admin/import-clock')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ClockImportController {
  constructor(
    public clockImportService: ClockImportService,
    private readonly azureStorage: AzureStorageService
  ) { }

  @Post('csv/old')
  @ApiImplicitFile({ name: 'file', required: true, description: 'The file to upload' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ title: 'Import location from CSV list' })
  async importCSV(@UploadedFile() file, @Req() req, @Res() res) {
    if (!req.file) {
      res.status(400).send("File is null");
    }
    // console.log(req.file);

    var ts = Math.round((new Date()).getTime() / 1000);

    file.originalname = file.originalname.replace(/[^a-zA-Z0-9 .]/gi, '');

    file = {
      ...file,
      originalname: 'eleave/' + ts + '_' + file.originalname,
    };


    const storageUrl = await this.azureStorage.upload(file);
    // Logger.log(`Storage URL: ${storageUrl}`, 'AppController');

    const fileData: string[] = file.originalname.split("/");
    // console.log(fileData);

    const records = parse(file.buffer, {
      columns: true,
      skip_empty_lines: true,
      skip_lines_with_empty_values: true
    })
    // console.log(records);

    this.clockImportService.importCsvProcess([records, req.user]).subscribe(
      data => {
        // console.log(data);
        // console.log();
        this.clockImportService.logImportAttendance([req.file, req.user, fileData[1]]);
        res.send(data);
      },
      err => {
        // console.log(err);
        res.send(err);
      }
    );
    // let failedlist = [];
    // let successList = [];
    // this.clientProfileDbService.findByFilterV4([[], [`(TENANT_GUID=${req.user.TENANT_GUID})`], null, null, null, [], null]).pipe(
    //   mergeMap(res1 => {
    //     let resource = new Resource(new Array);
    //     records.forEach(element => {

    //       let clientInfo = res1.find(x => x.NAME === element.client_name || x.ABBR === element.client_name);

    //       if (clientInfo == undefined) {
    //         failedlist.push(element.client_name);
    //       } else {
    //         let model = new ClientLocationModel();
    //         model.LOCATION_GUID = v1();
    //         model.CLIENT_GUID = clientInfo.CLIENT_GUID;
    //         model.ADDRESS = element.address;
    //         model.LATITUDE = element.latitude;
    //         model.LONGITUDE = element.longitude;
    //         model.STATUS = 1;
    //         resource.resource.push(model);

    //         successList.push(element.client_name);
    //       }
    //     });

    //     return this.locationService.clientLocationDbService.createByModel([resource, [], [], []]);
    //     // return of('ok');
    //     // return of(res1);
    //   })
    // ).subscribe(
    //   data => {
    //     res.send(data.data.resource);
    //     // res.send(data);
    //   },
    //   err => {
    //     res.send(err);
    //   }
    // );
  }

  @Post('csv')
  @ApiImplicitFile({ name: 'file', required: true, description: 'The file to upload' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ title: 'Import location from CSV list' })
  async importCSVNew(@UploadedFile() file, @Req() req, @Res() res) {
    if (!req.file) {
      res.status(400).send("File is null");
    }

    var ts = Math.round((new Date()).getTime() / 1000);

    file.originalname = file.originalname.replace(/[^a-zA-Z0-9 .]/gi, '');

    file = {
      ...file,
      originalname: 'eleave/' + ts + '_' + file.originalname,
    };

    const storageUrl = await this.azureStorage.upload(file);

    const fileData: string[] = file.originalname.split("/");

    const records = parse(file.buffer, {
      columns: true,
      skip_empty_lines: true,
      skip_lines_with_empty_values: true
    })
    // console.log(records);

    this.clockImportService.logImportAttendanceUpload([req.file, req.user, fileData[1]]).pipe(
      mergeMap(res => {
        // console.log(res);
        return this.clockImportService.importCsvProcessUpload([records, req.user, res.ATTENDANCE_UPLOAD_GUID]);
        // return res;
      })
    ).subscribe(
      data => {
        res.send(data);
      },
      err => {
        res.send(err);
      }
    );

    // this.clockImportService.importCsvProcess([records, req.user]).subscribe(
    //   data => {
    //     // console.log(data);
    //     // console.log();
    //     this.clockImportService.logImportAttendance([req.file, req.user, fileData[1]]);
    //     res.send(data);
    //   },
    //   err => {
    //     // console.log(err);
    //     res.send(err);
    //   }
    // );
  }


  @Get('attendance-upload-log')
  @ApiOperation({ title: 'Get all attendance upload log', description: 'Get all log' })
  getAllContract(@Req() req, @Res() res) {
    runGetServiceV2([this.clockImportService.getLogAttendanceUpload([req.user]), res]);
  }

  //   @Post('test/csv')
  //   @ApiImplicitFile({ name: 'file', required: true, description: 'The file to upload' })
  //   @UseInterceptors(FileInterceptor('file'))
  //   @ApiOperation({ title: 'Import location from CSV list' })
  //   async importTestCSV(@UploadedFile() file, @Req() req, @Res() res) {
  //     if (!req.file) {
  //       res.status(400).send("File is null");
  //     }
  //     // console.log(req.file);

  //     var ts = Math.round((new Date()).getTime() / 1000);

  //     file.originalname = file.originalname.replace(/[^a-zA-Z0-9 .]/gi, '');

  //     file = {
  //       ...file,
  //       originalname: 'eleave/' + ts + '_' + file.originalname,
  //     };


  //     const storageUrl = await this.azureStorage.upload(file);
  //     Logger.log(`Storage URL: ${storageUrl}`, 'AppController');

  //     const responseData = await this.azureStorage.getServiceUrl();
  //     Logger.log(`Response data: ${responseData}`, 'AppController');

  //   }
}