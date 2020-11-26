import { Injectable } from "@nestjs/common";
import { SupportTicketDbService, UserprofileDbService, SupportClarificationDbService, ClockLogDbService } from "../../common/db/table.db.service";
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
import { ClockLogModel } from '../../common/model/clock-log.model';

@Injectable()
export class SupportService {

  constructor(
    private readonly supportTicketDbService: SupportTicketDbService,
    private readonly userprofileDbService: UserprofileDbService,
    private readonly supportClarificationDbService: SupportClarificationDbService,
    private readonly clockLogDbService: ClockLogDbService
  ) { }

  public getClarificationList([supportId]: [string]) {
    return this.userprofileDbService.findByFilterV4([['USER_GUID', 'FULLNAME', 'PROFILE_PICTURE', 'EMAIL'], [], null, null, null, [], null]).pipe(
      mergeMap(res1 => {
        return this.supportClarificationDbService.findByFilterV4([[], [`(SUPPORT_GUID=${supportId})`], 'CREATION_TS DESC', null, null, [], null]).pipe(
          map(res => {

            res.forEach(x => {
              let userFullname = res1.find(y => y.USER_GUID === x.USER_GUID);

              if (userFullname != null) {
                x.FULLNAME = userFullname.FULLNAME;
                x.PROFILE_PICTURE = userFullname.PROFILE_PICTURE;
                x.EMAIL = userFullname.EMAIL;
              }
              x.STATUS = x.STATUS == 1 ? 'approved' : x.STATUS == 2 ? 'rejected' : x.STATUS == 3 ? 'responded' : 'pending'
              if (x.USER_REPLY == 'user') {
                delete x.STATUS;
              }
            });
            return res;
          })
        )
      }))
    // return this.supportClarificationDbService.findByFilterV4([[], [`(SUPPORT_GUID=${supportId})`], 'CREATION_TS DESC', null, null, [], null]).pipe(
    //   map(res => {
    //     res.forEach(x => {
    //       x.STATUS = x.STATUS == 1 ? 'approved' : x.STATUS == 2 ? 'rejected' : x.STATUS == 3 ? 'responded' : 'pending'
    //       if (x.USER_REPLY == 'user') {
    //         delete x.STATUS;
    //       }
    //     });
    //     return res;
    //   })
    // )
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
    // 0-Pending, 1-Approved, 2-Rejected, 3-Responded
    if (createAdminClarificationDto.status === 'approved') {
      this.addClockRequest([createAdminClarificationDto]);
    }
    dataClarification.STATUS = createAdminClarificationDto.status === 'approved' ? 1 : createAdminClarificationDto.status === 'rejected' ? 2 : 3;
    dataClarification.USER_REPLY = 'admin';
    const resource = new Resource(new Array);
    resource.resource.push(dataClarification);
    return this.supportClarificationDbService.createByModel([resource, [], [], ['SUPPORT_GUID']]).pipe(
      mergeMap(res => {

        const model = new SupportTicketModel;
        const resource2 = new Resource(new Array);
        model.SUPPORT_GUID = createAdminClarificationDto.supportId;
        model.STATUS = dataClarification.STATUS;
        model.MODULE = 'admin';
        resource2.resource.push(model);

        return this.supportTicketDbService.updateByModel([resource2, [], [], []]);
      })
    );
  }

  public createSupportIssue([createSupportDto, user]: [CreateSupportDTO, any]) {
    const dataSupport = new SupportTicketModel

    dataSupport.SUPPORT_GUID = v1();
    dataSupport.TENANT_GUID = user.TENANT_GUID;
    this.inputDataSupport([dataSupport, createSupportDto]);

    const resource = new Resource(new Array);
    resource.resource.push(dataSupport);
    return this.supportTicketDbService.createByModel([resource, [], [], []]);
  }

  private addClockRequest([data]: [CreateAdminClarificationDTO]) {
    // console.log(data);
    this.supportTicketDbService.findByFilterV4([[], [`(SUPPORT_GUID=${data.supportId})`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        // console.log(res);
        let model = new ClockLogModel;
        let resource = new Resource(new Array);
        model.CLOCK_LOG_GUID = v1();
        model.TENANT_GUID = res[0].TENANT_GUID;
        model.USER_GUID = res[0].USER_GUID;
        model.CLOCK_IN_TIME = res[0].START_TIME;
        model.CLOCK_OUT_TIME = res[0].END_TIME;
        model.SOURCE_ID = 2;
        resource.resource.push(model);
        // console.log(resource);
        return this.clockLogDbService.createByModel([resource, ['*'], [], []]);
        // return res;
      })
    ).subscribe(
      data => { /*console.log(data.data.resource);*/ },
      err => { /*console.log(err);*/ }
    )
  }

  // private updateStatusSupport([supportId, statusId]: [string, number]) {
  //   console.log(supportId + '-' + statusId);
  //   const model = new SupportTicketModel;
  //   const resource2 = new Resource(new Array);
  //   model.SUPPORT_GUID = supportId;
  //   model.STATUS = statusId;
  //   resource2.resource.push(model);
  //   console.log(resource2);
  //   this.supportTicketDbService.updateByModel([resource2, [], [], []]).subscribe();
  // }

  public getSupportIssue([user, moduleSelect]) {
    // console.log(user.TENANT_GUID);
    let filter = [];
    if (moduleSelect == 'admin') {
      filter = [`(TENANT_GUID=${user.TENANT_GUID})`];
    }
    return this.userprofileDbService.findByFilterV4([['USER_GUID', 'FULLNAME'], [], null, null, null, [], null]).pipe(
      mergeMap(res1 => {
        return this.supportTicketDbService.findByFilterV4([[], filter, null, null, null, [], null]).pipe(
          map(res => {
            let results = {};
            res.forEach(x => {
              x.START_TIME = moment(x.START_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss').toString();
              x.END_TIME = moment(x.END_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss').toString();

              let userFullname = res1.find(y => y.USER_GUID === x.USER_GUID);
              // Add fullname
              if (userFullname != null)
                x.FULLNAME = userFullname.FULLNAME;
              x.STATUS = x.STATUS == 3 ? 'responded' : x.STATUS == 1 ? 'approved' : x.STATUS == 2 ? 'rejected' : 'pending';
              if (x.REQUEST_TYPE == 'suggestions') {
                delete x.START_TIME;
                delete x.END_TIME;
                delete x.STATUS;
                delete x.ATTACHMENT;
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
    model.CREATION_TS = moment().utcOffset('+0800').format('YYYY-MM-DD HH:mm:ss').toString();
    model.STATUS = 0;
    model.MODULE = 'admin';
    return model;
  }

  private inputDataClarification([model, data]: [SupportClarificationModel, CreateClarificationDTO]) {
    model.SUPPORT_GUID = data.supportId;
    model.USER_GUID = data.userId;
    model.ATTACHMENT = data.doc;
    model.MESSAGE = data.message;
    model.CREATION_TS = moment().utcOffset('+0800').format('YYYY-MM-DD HH:mm:ss').toString();
    return model;
  }

}