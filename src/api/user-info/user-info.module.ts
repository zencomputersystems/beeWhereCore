import { Module } from "@nestjs/common";
import { UserInfoService } from './user-info.service';
import { UserInfoController } from "./user-info.controller";
import { getModuleHttp } from '../../common/helper/basic-function.service';
import { UserprofileDbService, WorkingHourDbService, CalendarProfileDetailDbService } from '../../common/db/table.db.service';
import { QueryParserService } from '../../common/helper/query-parser.service';

@Module({
  providers: [
    UserInfoService,
    UserprofileDbService,
    WorkingHourDbService,
    CalendarProfileDetailDbService,
    QueryParserService
  ],
  controllers: [UserInfoController],
  imports: [getModuleHttp()]
})
export class UserInfoModule { }