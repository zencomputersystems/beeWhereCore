import { Module } from "@nestjs/common";
import { ClockLogDbService, UserprofileDbService, WorkingHourDbService } from "../../common/db/table.db.service";
import { getModuleHttp } from '../../common/helper/basic-function.service';
import { ReportController } from "./report.controller";
import { ReportService } from './report.service';
import { QueryParserService } from '../../common/helper/query-parser.service';

@Module({
  imports: [getModuleHttp()],
  providers: [
    ReportService,
    ClockLogDbService,
    WorkingHourDbService,
    QueryParserService
  ],
  controllers: [ReportController]
})
export class ReportModule { };