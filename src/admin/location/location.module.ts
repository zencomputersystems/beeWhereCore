import { Module } from "@nestjs/common";
import { LocationService } from "./location.service";
import { ClientLocationDbService, ClientProfileDbService } from "../../common/db/table.db.service";
import { QueryParserService } from "../../common/helper/query-parser.service";
import { LocationController } from "./location.controller";
import { getModuleHttp } from "../../common/helper/basic-function.service";

@Module({
  providers: [
    LocationService,
    ClientProfileDbService,
    ClientLocationDbService,
    QueryParserService,
  ],
  controllers: [
    LocationController
  ],
  imports: [
    getModuleHttp()
  ]
})
export class LocationModule { }