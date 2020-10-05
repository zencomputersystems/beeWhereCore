import { Injectable } from "@nestjs/common";
import { of } from "rxjs";
import { LoginLogModel } from "../../common/model/login-log.model";
import { Resource } from "../../common/model/resource.model";
import { LoginLogDbService } from "../../common/db/table.db.service";
import { CreateLoginLogDTO } from "./dto/create-login-log.dto";
import { v1 } from 'uuid';

@Injectable()
export class LoginLogService {
  constructor(private readonly loginLogDbService: LoginLogDbService) { }
  public createLoginLog([data]: [CreateLoginLogDTO]) {
    let model = new LoginLogModel;
    model.LOGIN_LOG_GUID = v1();
    model.USER_GUID = data.userId;
    model.LOGGED_TIMESTAMP = data.loggedTimestamp;
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
    return this.loginLogDbService.findByFilterV4([[], filter, null, null, null, [], null]);
  }
}