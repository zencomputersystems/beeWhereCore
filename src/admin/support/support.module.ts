import { Module } from "@nestjs/common";
import { SupportService } from './support.service';
import { SupportController } from "./support.controller";
import { getModuleHttp } from '../../common/helper/basic-function.service';
import { SupportTicketDbService, UserprofileDbService } from "../../common/db/table.db.service";
import { QueryParserService } from '../../common/helper/query-parser.service';

@Module({
  providers: [
    SupportService,
    SupportTicketDbService,
    UserprofileDbService,
    QueryParserService
  ],
  controllers: [SupportController],
  imports: [getModuleHttp()]
})
export class SupportModule { }