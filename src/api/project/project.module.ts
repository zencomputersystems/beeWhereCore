import { getModuleHttp } from "../../common/helper/basic-function.service";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { Module } from "@nestjs/common";
import { ProjectProfileDbService } from "../../common/db/table.db.service";
import { QueryParserService } from "../../common/helper/query-parser.service";

@Module({
  providers: [
    ProjectService,
    ProjectProfileDbService,
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