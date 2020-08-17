import { Injectable } from "@nestjs/common";
import { of } from "rxjs";
import { ClockLogDbService } from "../../common/db/table.db.service";
import { ClockLogModel } from "../../common/model/clock-log.model";
import { CreateClockDTO } from "./dto/create-clock.dto";
import { v1 } from 'uuid';
import { Resource } from "../../common/model/resource.model";
import moment = require("moment");
import { UpdateClockDTO } from "./dto/update-clock.dto";
import { ActivityClockDTO } from "./dto/activity-clock.dto";
import { map } from "rxjs/operators";
/** XMLparser from zen library  */
var { convertJsonToXML, convertXMLToJson } = require('@zencloudservices/xmlparser');

@Injectable()
export class ClockService {
  constructor(private readonly clockLogDbService: ClockLogDbService) { }
  public clockInProcess([createClockDTO]: [CreateClockDTO]) {
    let model = new ClockLogModel;
    model.CLOCK_LOG_GUID = v1();
    model.USER_GUID = createClockDTO.userGuid;
    model.JOB_TYPE = createClockDTO.jobType;
    model.LATITUDE_IN = createClockDTO.location.lat;
    model.LONGITUDE_IN = createClockDTO.location.long;
    model.ADDRESS_IN = createClockDTO.location.name;
    model.CLIENT_ID = createClockDTO.clientId;
    model.PROJECT_ID = createClockDTO.projectId;
    model.CONTRACT_ID = createClockDTO.contractId;
    model.CLOCK_IN_TIME = moment.unix(createClockDTO.clockTime).format('YYYY-MM-DD HH:mm:ss').toString();

    const resource = new Resource(new Array);
    resource.resource.push(model);
    return this.clockLogDbService.createByModel([resource, [], [], []]);
  }

  public clockOutProcess([updateClockDTO]: [UpdateClockDTO]) {
    let model = new ClockLogModel;
    model.CLOCK_LOG_GUID = updateClockDTO.clockLogGuid;
    model.LATITUDE_OUT = updateClockDTO.location.lat;
    model.LONGITUDE_OUT = updateClockDTO.location.long;
    model.ADDRESS_OUT = updateClockDTO.location.name;
    model.CLOCK_OUT_TIME = moment.unix(updateClockDTO.clockTime).format('YYYY-MM-DD HH:mm:ss').toString();

    const resource = new Resource(new Array);
    resource.resource.push(model);
    return this.clockLogDbService.updateByModel([resource, [], [], []]);
  }

  public getClockData([clockId]: [string]) {
    return this.clockLogDbService.findByFilterV4([[], [`(CLOCK_LOG_GUID=${clockId})`], null, null, null, [], null]).pipe(
      map(res => {
        if (res[0].ACTIVITY != null) {
          res[0].ACTIVITY = convertXMLToJson(res[0].ACTIVITY);
        }
        return res;
      })
    );
  }

  public updateActivityProgress([activityClockDTO]: [ActivityClockDTO]) {
    let model = new ClockLogModel;
    model.CLOCK_LOG_GUID = activityClockDTO.clockLogGuid;
    let root = {};
    let activity = {};

    activity['activity'] = activityClockDTO.activity;
    root['root'] = { activity: activity['activity'] };

    model.ACTIVITY = convertJsonToXML(root);

    const resource = new Resource(new Array);
    resource.resource.push(model);
    return this.clockLogDbService.updateByModel([resource, [], [], []]);
  }

  public getActivityProgress([clockLogGuid]: [string]) {
    return this.clockLogDbService.findByFilterV4([['ACTIVITY'], [`(CLOCK_LOG_GUID=${clockLogGuid})`], null, null, null, [], null]).pipe(
      map(res => {
        const activityData = convertXMLToJson(res[0].ACTIVITY);
        return activityData.root;
      })
    )
  }

  public getHistoryClock([userId]: [string]) {
    let method = this.clockLogDbService.findByFilterV4([[], [`(USER_GUID=${userId})`], null, 20, null, [], null]);
    return method.pipe(map(res => {
      let resArr = [];
      for (var i = 0; i < 15; i++) {
        var startdate = moment().subtract(i, "days").format("YYYY-MM-DD");
        let temp = res.filter(x => moment(x.CLOCK_IN_TIME).format("YYYY-MM-DD") === startdate);
        if (temp.length > 0) {
          let dataTemp = {};
          dataTemp['date'] = startdate;

          temp.forEach(element => {
            if (element.ACTIVITY != null) {
              element.ACTIVITY = convertXMLToJson(element.ACTIVITY);
            }
          });

          dataTemp['list'] = temp;

          resArr.push(dataTemp);
        }
      }
      return resArr;
    }));
  }

  public getHistoryClockByLimit([userId, params]: [string, any]) {

    let method = this.clockLogDbService.findByFilterV4([[], [`(USER_GUID=${userId})`], null, params.limit, params.page, [], null]);
    return method.pipe(map(res => {
      res.forEach(element => {
        if (element.ACTIVITY != null) {
          element.ACTIVITY = convertXMLToJson(element.ACTIVITY);
        }
      });
      return res;
    }));
  }

}