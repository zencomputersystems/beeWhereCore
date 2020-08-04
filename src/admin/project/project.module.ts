import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ClientProjectDbService } from "../../common/db/table.db.service";
import { ProjectController } from "./project.controller";
import { getModuleHttp } from "../../common/helper/basic-function.service";
import { QueryParserService } from "../../common/helper/query-parser.service";

@Module({
  providers: [
    ProjectService,
    // ClientProfileDbService,
    // ClientLocationDbService,
    ClientProjectDbService,
    // ClientContractDbService,
    QueryParserService,
  ],
  controllers: [
    ProjectController
  ],
  imports: [
    getModuleHttp()
  ]
})
export class ProjectModule { }