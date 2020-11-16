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
import { response } from "express";
/** XMLparser from zen library  */
var { convertJsonToXML, convertXMLToJson } = require('@zencloudservices/xmlparser');

@Injectable()
export class ClockService {
  constructor(private readonly clockLogDbService: ClockLogDbService) { }
  public clockInProcess([createClockDTO, user]: [CreateClockDTO, any]) {
    let model = new ClockLogModel;
    model.CLOCK_LOG_GUID = v1();
    model.TENANT_GUID = user.TENANT_GUID;
    model.USER_GUID = createClockDTO.userGuid;
    model.JOB_TYPE = createClockDTO.jobType;
    model.LATITUDE_IN = createClockDTO.location.lat;
    model.LONGITUDE_IN = createClockDTO.location.long;
    model.ADDRESS_IN = createClockDTO.location.name;
    model.USER_AGENT_IN = createClockDTO.userAgent;
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
    model.USER_AGENT_OUT = updateClockDTO.userAgent;
    model.CLOCK_OUT_TIME = moment.unix(updateClockDTO.clockTime).format('YYYY-MM-DD HH:mm:ss').toString();

    const resource = new Resource(new Array);
    resource.resource.push(model);
    return this.clockLogDbService.updateByModel([resource, [], [], []]);
  }

  public getClockData([clockId]: [string]) {
    return this.clockLogDbService.findByFilterV4([[], [`(CLOCK_LOG_GUID=${clockId})`], null, null, null, ['PROJECT_DATA', 'CONTRACT_DATA', 'CLIENT_DATA'], null]).pipe(
      map(res => {
        if (res[0].ACTIVITY != null) {
          res[0].ACTIVITY = convertXMLToJson(res[0].ACTIVITY);
        }
        res[0].CLOCK_IN_TIME = res[0].CLOCK_IN_TIME != null ? moment(res[0].CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;
        res[0].CLOCK_OUT_TIME = res[0].CLOCK_OUT_TIME != null ? moment(res[0].CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

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

  public getHistoryClock([userId, params]: [string, any]) {

    const startDate = moment.unix(params.startdate).utc().format('YYYY-MM-DD 00:00:00');
    let endDate = moment.unix(params.enddate).utc().format('YYYY-MM-DD 23:59:59');

    let method = this.clockLogDbService.findByFilterV4([['CLOCK_IN_TIME', 'CLOCK_OUT_TIME', 'ACTIVITY'], [`(USER_GUID=${userId})`, `AND (CLOCK_IN_TIME >= ` + startDate + `)`, `AND (CLOCK_IN_TIME <= ` + endDate + `)`], null, null, null, [], null]);
    return method.pipe(map(res => {
      // console.log(res);
      let resArr = [];
      for (var i = 0; i <= moment(endDate).diff(startDate, "days"); i++) {
        var startdate = moment(endDate).utc().subtract(i, "days").format("YYYY-MM-DD");

        let temp = res.filter(x => moment(x.CLOCK_IN_TIME).format("YYYY-MM-DD") === startdate);
        if (temp.length > 0) {
          // set final structure
          let dataTemp = {};
          // assign by date
          dataTemp['date'] = startdate;
          // attach latest clock in and out time
          let previousInDate;
          let previousOutDate;
          let activityArr = [];
          temp.forEach(element => {
            if (params.type == 'attendance') {
              delete element.ACTIVITY;
              previousInDate = previousInDate == null ? element.CLOCK_IN_TIME : previousInDate;
              previousOutDate = previousOutDate == null ? element.CLOCK_OUT_TIME : previousOutDate;

              previousInDate = previousInDate > element.CLOCK_IN_TIME ? element.CLOCK_IN_TIME : previousInDate;
              previousOutDate = previousOutDate < element.CLOCK_OUT_TIME ? element.CLOCK_OUT_TIME : previousOutDate;
            }
            if (params.type == 'activity') {
              delete element.CLOCK_IN_TIME;
              delete element.CLOCK_OUT_TIME;
              if (element.ACTIVITY != null) {
                element.ACTIVITY = convertXMLToJson(element.ACTIVITY);
                if (element.ACTIVITY.root) {
                  element.ACTIVITY = element.ACTIVITY.root.activity;
                  if (element.ACTIVITY.length == undefined) {
                    let setArr = [];
                    setArr.push(element.ACTIVITY);
                    element.ACTIVITY = setArr;
                  }

                  if (element.ACTIVITY != undefined) {
                    activityArr.push(element.ACTIVITY);
                  }
                }
              } else {
                delete element.ACTIVITY;
              }

            }
          });
          if (params.type == 'attendance') {
            dataTemp['inTime'] = previousInDate != null ? moment(previousInDate).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;
            dataTemp['outTime'] = previousOutDate != null ? moment(previousOutDate).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;
            dataTemp['duration'] = moment(previousOutDate).utc().diff(previousInDate, "hours");
          }
          if (params.type == 'activity') {
            dataTemp['activityList'] = activityArr;
          }
          resArr.push(dataTemp);
        }
      }
      return resArr;
    }));
  }

  public getHistoryClockByLimit([userId, params]: [string, any]) {
    let method = this.clockLogDbService.findByFilterV4([[], [`(USER_GUID=${userId})`], null, params.limit, params.page, ['PROJECT_DATA', 'CONTRACT_DATA', 'CLIENT_DATA'], null]);
    return method.pipe(map(res => {
      res.forEach(element => {
        if (element.ACTIVITY != null) {
          element.ACTIVITY = convertXMLToJson(element.ACTIVITY);
        }
        element.CLOCK_IN_TIME = element.CLOCK_IN_TIME != null ? moment(element.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;
        element.CLOCK_OUT_TIME = element.CLOCK_OUT_TIME != null ? moment(element.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

      });

      res = res.sort(function (a, b) {
        var c = new Date(a.CLOCK_IN_TIME) as any;
        var d = new Date(b.CLOCK_IN_TIME) as any;
        return d - c;
      });
      return res;
    }));
  }

}