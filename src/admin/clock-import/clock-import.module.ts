import { Module } from "@nestjs/common";
import { QueryParserService } from "../../common/helper/query-parser.service";
import { AttendanceUploadLogDbService, ClockLogDbService, UserprofileDbService } from "../../common/db/table.db.service";
import { getModuleHttp } from "../../common/helper/basic-function.service";
import { ClockImportController } from "./clock-import.controller";
import { ClockImportService } from "./clock-import.service";

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
    getModuleHttp()
  ]
})
export class ClockImportModule { }