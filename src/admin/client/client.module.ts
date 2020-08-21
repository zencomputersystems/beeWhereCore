import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { Module } from "@nestjs/common";
import { getModuleHttp } from "../../common/helper/basic-function.service";
import { ClientProfileDbService, ClientLocationDbService, ClientContractDbService, ClientProjectDbService } from "../../common/db/table.db.service";
import { QueryParserService } from "../../common/helper/query-parser.service";
import { ContractService } from "../contract/contract.service";
import { ProjectService } from "../project/project.service";
import { LocationService } from "../location/location.service";

@Module({
  providers: [
    ClientService,
    ClientProfileDbService,
    ClientLocationDbService,
    ClientProjectDbService,
    ClientContractDbService,
    QueryParserService,
    ContractService,
    ProjectService,
    LocationService
  ],
  controllers: [
    ClientController
  ],
  imports: [
    getModuleHttp()
  ]
})
export class ClientModule { }