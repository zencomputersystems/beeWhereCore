import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { Module } from "@nestjs/common";
import { getModuleHttp } from "../../common/helper/basic-function.service";
import { ClientProfileDbService, ClientLocationDbService, ClientContractDbService, ClientProjectDbService } from "../../common/db/table.db.service";
import { QueryParserService } from "../../common/helper/query-parser.service";

@Module({
  providers: [
    ClientService,
    ClientProfileDbService,
    ClientLocationDbService,
    ClientProjectDbService,
    ClientContractDbService,
    QueryParserService,
  ],
  controllers: [
    ClientController
  ],
  imports: [
    getModuleHttp()
  ]
})
export class ClientModule { }