import { Module } from "@nestjs/common";
import { QueryParserService } from "../../common/helper/query-parser.service";
import { AttendanceUploadLogDbService, ClockLogDbService, UserprofileDbService } from "../../common/db/table.db.service";
import { getModuleHttp } from "../../common/helper/basic-function.service";
import { ClockImportController } from "./clock-import.controller";
import { ClockImportService } from "./clock-import.service";
import { AzureStorageModule } from '@nestjs/azure-storage';

@Module({
  providers: [
    ClockImportService,
    UserprofileDbService,
    AttendanceUploadLogDbService,
    ClockLogDbService,
    QueryParserService
  ],
  controllers: [
    ClockImportController
  ],
  imports: [
    getModuleHttp(),
    AzureStorageModule.withConfig({
      sasKey: process.env.AZURE_STORAGE_SAS_KEY || '?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2023-11-29T16:30:34Z&st=2019-10-02T08:30:34Z&spr=https,http&sig=2Mi0z8FFOAapLcyr%2FWKsWsQEF84dBBe%2B0zTaWaaMzBY%3D',// process.env['AZURE_STORAGE_SAS_KEY'],
      accountName: process.env.AZURE_STORAGE_ACCOUNT || 'zencloudservicesstore',// process.env['AZURE_STORAGE_ACCOUNT'],
      containerName: process.env.AZURE_CONTAINER_NAME || 'cloudservices',
    }),
  ]
})
export class ClockImportModule { }