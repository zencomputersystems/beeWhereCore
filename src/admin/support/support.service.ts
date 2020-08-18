import { Injectable } from "@nestjs/common";
import { SupportTicketDbService } from "../../common/db/table.db.service";
import { CreateSupportDTO } from './dto/create-support.dto';
import { SupportTicketModel } from '../../common/model/support-ticket.model';
import { v1 } from "uuid";
import { Resource } from "../../common/model/resource.model";
import moment = require("moment");

@Injectable()
export class SupportService {

  constructor(private readonly supportTicketDbService: SupportTicketDbService) { }

  public createSupportIssue([createSupportDto]: [CreateSupportDTO]) {
    const dataSupport = new SupportTicketModel

    dataSupport.SUPPORT_GUID = v1();
    this.inputDataSupport([dataSupport, createSupportDto]);

    const resource = new Resource(new Array);
    resource.resource.push(dataSupport);
    return this.supportTicketDbService.createByModel([resource, [], [], []]);
  }

  private inputDataSupport([model, data]: [SupportTicketModel, CreateSupportDTO]) {
    model.USER_GUID = data.userGuid;
    model.USER_EMAIL = data.userEmail;
    model.REQUEST_TYPE = data.requestType;
    model.TITLE = data.subject;
    model.ATTACHMENT = data.supportingDoc;
    model.DESCRIPTION = data.description;
    model.START_TIME = moment.unix(data.starttime).format('YYYY-MM-DD HH:mm:ss').toString();
    model.END_TIME = moment.unix(data.endtime).format('YYYY-MM-DD HH:mm:ss').toString();
    return model;
  }

}