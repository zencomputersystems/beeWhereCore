import { Injectable } from "@nestjs/common";
import { forkJoin, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { Resource } from "../../common/model/resource.model";
import { AttendanceUploadLogDbService, ClockLogDbService, UserprofileDbService } from "../../common/db/table.db.service";
import { ClockLogModel } from '../../common/model/clock-log.model';
import { v1 } from 'uuid';
import moment = require("moment");
import { AttendanceUploadLogModel } from "../../common/model/attendance-upload-log.model";

@Injectable()
export class ClockImportService {
  constructor(
    private readonly userprofileDbService: UserprofileDbService,
    private readonly attendanceUploadLogDbService: AttendanceUploadLogDbService,
    private readonly clockLogDbService: ClockLogDbService
  ) { }
  public importCsvProcess([data, user]) {
    return this.userprofileDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`, `AND (DELETED_AT IS NULL)`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        let resource = new Resource(new Array);
        data.forEach(element => {
          let userData = res.find(x => x.STAFF_ID === element.UserID)

          if (userData != undefined) {
            let model = new ClockLogModel;

            model.CLOCK_LOG_GUID = v1();
            model.TENANT_GUID = user.TENANT_GUID;
            model.USER_GUID = userData.USER_GUID
            model.JOB_TYPE = 'office';
            model.CLIENT_ID = 'none';
            model.PROJECT_ID = 'none';
            model.CONTRACT_ID = 'none';
            model.SOURCE_ID = 3;
            if (element.Dev_ID == 1) {
              model.CLOCK_IN_TIME = moment(element.Att_Time, 'DD/MM/YYYY HH:mm').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
            } else if (element.Dev_ID == 2) {
              model.CLOCK_OUT_TIME = moment(element.Att_Time, 'DD/MM/YYYY HH:mm').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
            }
            // model.CLOCK_IN_TIME = moment(element.Att_Time, 'DD/MM/YYYY HH:mm').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
            // model.CLOCK_OUT_TIME = moment(element.Att_Time, 'DD/MM/YYYY HH:mm').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
            resource.resource.push(model);
          }
        });
        console.log(resource);
        return this.clockLogDbService.createByModel([resource, [], [], []]).pipe(
          map(res => {
            return res.data.resource;
          })
        );
        // return res;
      })
    )

  }

  public logImportAttendance([fileInfo, user]: [any, any]) {

    let model = new AttendanceUploadLogModel;
    let resource = new Resource(new Array);

    model.TENANT_GUID = user.TENANT_GUID;
    model.FILENAME = fileInfo.originalname;
    model.SIZE = fileInfo.size;
    model.CREATION_USER_GUID = user.USER_GUID;

    resource.resource.push(model);
    // console.log(resource);
    this.attendanceUploadLogDbService.createByModel([resource, [], [], []]).subscribe(
      data => { /*console.log(data);*/ },
      err => { /*console.log(err);*/ }
    );
    return fileInfo;
  }

  public getLogAttendanceUpload([user]) {
    return this.attendanceUploadLogDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        let arrayTemp = [];
        res.forEach(x => {
          arrayTemp.includes(x.CREATION_USER_GUID) ? null : arrayTemp.push(x.CREATION_USER_GUID);
        })
        let userInfo = this.userprofileDbService.findByFilterV4([[], [`(USER_GUID IN (${arrayTemp}))`], null, null, null, [], null]);
        return forkJoin([of(res), userInfo]);
      }), map(res => {
        console.log(res);
        res[0].forEach(x => {
          let uploaderName = res[1].find(y => y.USER_GUID === x.CREATION_USER_GUID);
          x['UPLOADER_NAME'] = uploaderName.FULLNAME;
        })
        return res[0];
      })
    );
  }
}