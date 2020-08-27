import { Injectable } from "@nestjs/common";
import { SupportTicketDbService, UserprofileDbService, SupportClarificationDbService } from "../../common/db/table.db.service";
import { CreateSupportDTO } from './dto/create-support.dto';
import { SupportTicketModel } from '../../common/model/support-ticket.model';
import { v1 } from "uuid";
import { Resource } from "../../common/model/resource.model";
import moment = require("moment");
import { map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { SupportClarificationModel } from "../../common/model/support-clarification.model";
import { CreateClarificationDTO } from "./dto/create-clarification.dto";
import { CreateAdminClarificationDTO } from "./dto/create-admin-clarification.dto";

@Injectable()
export class SupportService {

  constructor(
    private readonly supportTicketDbService: SupportTicketDbService,
    private readonly userprofileDbService: UserprofileDbService,
    private readonly supportClarificationDbService: SupportClarificationDbService
  ) { }

  public getClarificationList([supportId]: [string]) {
    return this.supportClarificationDbService.findByFilterV4([[], [`(SUPPORT_GUID=${supportId})`], 'CREATION_TS DESC', null, null, [], null]).pipe(
      map(res => {
        res.forEach(x => {
          x.STATUS = x.STATUS == 1 ? 'approved' : x.STATUS == 2 ? 'rejected' : 'pending'
          if (x.USER_REPLY == 'user') {
            delete x.STATUS;
          }
        });
        return res;
      })
    )
    // return of(supportId);
  }

  public createClarification([createClarificationDto]: [CreateClarificationDTO]) {
    const dataClarification = new SupportClarificationModel

    dataClarification.SUPPORT_GUID = v1();
    this.inputDataClarification([dataClarification, createClarificationDto]);
    dataClarification.USER_REPLY = 'user';

    const resource = new Resource(new Array);
    resource.resource.push(dataClarification);
    return this.supportClarificationDbService.createByModel([resource, [], [], ['SUPPORT_GUID']]);
  }

  public createAdminClarification([createAdminClarificationDto]: [CreateAdminClarificationDTO]) {
    const dataClarification = new SupportClarificationModel

    dataClarification.SUPPORT_GUID = createAdminClarificationDto.supportId;
    this.inputDataClarification([dataClarification, createAdminClarificationDto]);
    dataClarification.STATUS = createAdminClarificationDto.status === 'approved' ? 1 : createAdminClarificationDto.status === 'rejected' ? 2 : 0;
    dataClarification.USER_REPLY = 'admin';
    const resource = new Resource(new Array);
    resource.resource.push(dataClarification);
    return this.supportClarificationDbService.createByModel([resource, [], [], ['SUPPORT_GUID']]).pipe(
      mergeMap(res => {

        const model = new SupportTicketModel;
        const resource2 = new Resource(new Array);
        model.SUPPORT_GUID = createAdminClarificationDto.supportId;
        model.STATUS = dataClarification.STATUS;
        resource2.resource.push(model);

        return this.supportTicketDbService.updateByModel([resource2, [], [], []]);
      })
    );
  }

  public createSupportIssue([createSupportDto]: [CreateSupportDTO]) {
    const dataSupport = new SupportTicketModel

    dataSupport.SUPPORT_GUID = v1();
    this.inputDataSupport([dataSupport, createSupportDto]);

    const resource = new Resource(new Array);
    resource.resource.push(dataSupport);
    return this.supportTicketDbService.createByModel([resource, [], [], []]);
  }

  private updateStatusSupport([supportId, statusId]: [string, number]) {
    console.log(supportId + '-' + statusId);
    const model = new SupportTicketModel;
    const resource2 = new Resource(new Array);
    model.SUPPORT_GUID = supportId;
    model.STATUS = statusId;
    resource2.resource.push(model);
    console.log(resource2);
    this.supportTicketDbService.updateByModel([resource2, [], [], []]).subscribe();
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
    model.ATTACHMENT = data.supportingDoc.toString();
    model.DESCRIPTION = data.description;
    model.START_TIME = moment.unix(data.starttime).format('YYYY-MM-DD HH:mm:ss').toString();
    model.END_TIME = moment.unix(data.endtime).format('YYYY-MM-DD HH:mm:ss').toString();
    model.CREATION_TS = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    model.STATUS = 0;
    return model;
  }

  private inputDataClarification([model, data]: [SupportClarificationModel, CreateClarificationDTO]) {
    model.SUPPORT_GUID = data.supportId;
    model.USER_GUID = data.userId;
    model.ATTACHMENT = data.doc.toString();
    model.MESSAGE = data.message;
    model.CREATION_TS = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    return model;
  }

}