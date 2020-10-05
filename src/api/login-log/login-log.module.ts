import { Module } from "@nestjs/common";
import { LoginLogDbService } from "../../common/db/table.db.service";
import { getModuleHttp } from "../../common/helper/basic-function.service";
import { LoginLogController } from "./login-log.controller";
import { LoginLogService } from "./login-log.service";
import { QueryParserService } from '../../common/helper/query-parser.service';

@Module({
  providers: [
    LoginLogService,
    LoginLogDbService,
    QueryParserService
  ],
  controllers: [LoginLogController],
  imports: [getModuleHttp()]
})
export class LoginLogModule { }