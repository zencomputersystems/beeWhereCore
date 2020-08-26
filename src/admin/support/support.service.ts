import { Injectable } from "@nestjs/common";
import { SupportTicketDbService, UserprofileDbService } from "../../common/db/table.db.service";
import { CreateSupportDTO } from './dto/create-support.dto';
import { SupportTicketModel } from '../../common/model/support-ticket.model';
import { v1 } from "uuid";
import { Resource } from "../../common/model/resource.model";
import moment = require("moment");
import { map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class SupportService {

  constructor(
    private readonly supportTicketDbService: SupportTicketDbService,
    private readonly userprofileDbService: UserprofileDbService
  ) { }

  public createSupportIssue([createSupportDto]: [CreateSupportDTO]) {
    const dataSupport = new SupportTicketModel

    dataSupport.SUPPORT_GUID = v1();
    this.inputDataSupport([dataSupport, createSupportDto]);

    const resource = new Resource(new Array);
    resource.resource.push(dataSupport);
    return this.supportTicketDbService.createByModel([resource, [], [], []]);
  }

  public getSupportIssue([data]) {
    return this.userprofileDbService.findByFilterV4([['USER_GUID', 'FULLNAME'], [], null, null, null, [], null]).pipe(
      mergeMap(res1 => {
        return this.supportTicketDbService.findByFilterV4([[], [], null, null, null, [], null]).pipe(
          map(res => {
            let results = {};
            res.forEach(x => {
              let userFullname = res1.find(y => y.USER_GUID === x.USER_GUID);
              // Add fullname
              x.FULLNAME = userFullname.FULLNAME;
              x.STATUS = x.STATUS = 0 ? 'pending' : x.STATUS = 1 ? 'approved' : 'rejected';
              if (x.REQUEST_TYPE == 'suggestions') {
                delete x.START_TIME;
                delete x.END_TIME;
                delete x.STATUS;
              }
            });
            let requestData = res.filter(x => x.REQUEST_TYPE != 'suggestions');
            let suggestionData = res.filter(x => x.REQUEST_TYPE === 'suggestions');

            results['request'] = requestData;
            results['suggestion'] = suggestionData;

            return results;
          })
        );

        // return res;
      })
    )
    // .subscribe();
    // return 
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
    model.CREATION_TS = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    model.STATUS = 0;
    return model;
  }

}