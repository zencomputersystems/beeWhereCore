import { Module } from "@nestjs/common";
import { SupportService } from './support.service';
import { SupportController } from "./support.controller";
import { getModuleHttp } from '../../common/helper/basic-function.service';
import { SupportTicketDbService, UserprofileDbService, SupportClarificationDbService, ClockLogDbService, RoleProfileDbService } from "../../common/db/table.db.service";
import { QueryParserService } from '../../common/helper/query-parser.service';
import { EmailNodemailerService } from "../../common/helper/email-nodemailer.service";

@Module({
  providers: [
    SupportService,
    SupportTicketDbService,
    UserprofileDbService,
    SupportClarificationDbService,
    QueryParserService,
    ClockLogDbService,
    EmailNodemailerService,
    RoleProfileDbService
  ],
  controllers: [SupportController],
  imports: [getModuleHttp()]
})
export class SupportModule { }