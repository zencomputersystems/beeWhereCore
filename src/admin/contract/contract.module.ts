import { Module } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { ClientContractDbService } from "../../common/db/table.db.service";
import { QueryParserService } from "../../common/helper/query-parser.service";
import { ContractController } from "./contract.controller";
import { getModuleHttp } from "../../common/helper/basic-function.service";

@Module({
  providers: [
    ContractService,
    // ClientProfileDbService,
    // ClientLocationDbService,
    ClientContractDbService,
    // ClientContractDbService,
    QueryParserService,
  ],
  controllers: [
    ContractController
  ],
  imports: [
    getModuleHttp()
  ]
})
export class ContractModule { }