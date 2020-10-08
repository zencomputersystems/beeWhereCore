import { Injectable } from "@nestjs/common";
import { of } from "rxjs";
import { LoginLogModel } from '../../common/model/login-log.model';
import { Resource } from "../../common/model/resource.model";
import { LoginLogDbService } from "../../common/db/table.db.service";
import { CreateLoginLogDTO } from "./dto/create-login-log.dto";
import { v1 } from 'uuid';
import { UpdateLoginLogActivityDTO } from './dto/activity-log.dto';
import { map, mergeMap } from "rxjs/operators";
import moment = require("moment");
var { convertXMLToJson, convertJsonToXML } = require('@zencloudservices/xmlparser');

@Injectable()
export class LoginLogService {
  constructor(private readonly loginLogDbService: LoginLogDbService) { }
  public createLoginLog([data]: [CreateLoginLogDTO]) {
    let model = new LoginLogModel;
    model.LOGIN_LOG_GUID = v1();
    model.USER_GUID = data.userId;
    model.LOGGED_TIMESTAMP = moment.unix(data.loggedTimestamp).format('YYYY-MM-DD HH:mm:ss').toString();
    model.LATITUDE = data.latitude;
    model.LONGITUDE = data.longitude;
    model.ADDRESS = data.address;
    model.DEVICE_INFO = data.deviceInfo;
    model.DEVICE_PUBLIC_IP = data.devicePublicIp;
    const resource = new Resource(new Array);
    resource.resource.push(model);
    return this.loginLogDbService.createByModel([resource, [], [], []]);
    // return of(data);
  }

  public getLoginHistory([userId]: [string]) {
    let filter = [`(USER_GUID=${userId})`];
    return this.loginLogDbService.findByFilterV4([[], filter, null, null, null, [], null]).pipe(
      map(res => {
        res.forEach(element => {
          if (element.ACTIVITY != null) {
            let activityData = convertXMLToJson(element.ACTIVITY);
            element.ACTIVITY = activityData.root;
          }
        });
        return res;
      })
    );
  }

  public updateLoginLogActivity([activityLogDto]: [UpdateLoginLogActivityDTO]) {

    return this.loginLogDbService.findByFilterV4([[], [`(LOGIN_LOG_GUID=${activityLogDto.loginId})`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        // updated root data
        let rootData = {};
        // array to be pushed and updated
        let activityArrUpdated = [];
        // no activity yet
        if (res[0].ACTIVITY == null) {
          activityLogDto.activities.forEach(element => {
            element.timestamp = moment.unix(element.timestamp).format('YYYY-MM-DD HH:mm:ss').toString()
            activityArrUpdated.push(element)
          });

        } else {
          // have activity
          let activityLogData = convertXMLToJson(res[0].ACTIVITY)
          let activityArrExisting = activityLogData.root;

          if (activityArrExisting.length > 0) {
            // single activity will not in array
            activityArrUpdated = activityArrExisting;
            activityLogDto.activities.forEach(element => {
              element.timestamp = moment.unix(element.timestamp).format('YYYY-MM-DD HH:mm:ss').toString()
              activityArrUpdated.push(element)
            });
          }
          else {
            // activity in array. need to push to existing array
            activityArrUpdated.push(activityArrExisting);
            activityLogDto.activities.forEach(element => {
              element.timestamp = moment.unix(element.timestamp).format('YYYY-MM-DD HH:mm:ss').toString()
              activityArrUpdated.push(element)
            });

          }
        }
        // recreate new root activity
        rootData['root'] = activityArrUpdated;
        let model = new LoginLogModel;
        model.LOGIN_LOG_GUID = activityLogDto.loginId;
        model.ACTIVITY = convertJsonToXML(rootData);

        const resource = new Resource(new Array);
        resource.resource.push(model);

        return this.loginLogDbService.updateByModel([resource, [], [], []]);

      })
    )

  }

}