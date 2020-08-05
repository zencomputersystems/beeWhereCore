import { getModuleHttp } from "../../common/helper/basic-function.service";
import { ClockController } from "./clock.controller";
import { QueryParserService } from "../../common/helper/query-parser.service";
import { ClockService } from "./clock.service";
import { Module } from "@nestjs/common";
import { ClockLogDbService } from "../../common/db/table.db.service";

@Module({
  providers: [
    ClockService,
    // ClientProfileDbService,
    // ClientLocationDbService,
    // ClockDbService,
    // ClientContractDbService,
    QueryParserService,
    ClockLogDbService
  ],
  controllers: [
    ClockController
  ],
  imports: [
    getModuleHttp()
  ]
})
export class ClockModule { }