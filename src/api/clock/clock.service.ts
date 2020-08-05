import { Injectable } from "@nestjs/common";
import { of } from "rxjs";
import { ClockLogDbService } from "../../common/db/table.db.service";
import { ClockLogModel } from "../../common/model/clock-log.model";
import { CreateClockDTO } from "./dto/create-clock.dto";
import { v1 } from 'uuid';
import { Resource } from "../../common/model/resource.model";
import moment = require("moment");

@Injectable()
export class ClockService {
  constructor(private readonly clockLogDbService: ClockLogDbService) { }
  public clockInProcess([createClockDTO]: [CreateClockDTO]) {
    let model = new ClockLogModel;
    model.CLOCK_LOG_GUID = v1();
    model.USER_GUID = createClockDTO.userGuid;
    model.JOB_TYPE = createClockDTO.jobType;
    model.LATITUDE = createClockDTO.location.lat;
    model.LONGITUDE = createClockDTO.location.long;
    model.ADDRESS = createClockDTO.location.name;
    model.CLIENT_ID = createClockDTO.clientId;
    model.PROJECT_ID = createClockDTO.projectId;
    model.CONTRACT_ID = createClockDTO.contractId;
    model.CLOCK_TIME = moment.unix(createClockDTO.clockTime).format('YYYY-MM-DD HH:mm:ss').toString();

    const resource = new Resource(new Array);
    resource.resource.push(model);
    // console.log(resource);
    return this.clockLogDbService.createByModel([resource, [], [], []]);
    // return of('data');
  }
}