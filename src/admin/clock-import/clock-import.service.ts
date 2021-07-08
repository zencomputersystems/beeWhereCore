import { Injectable } from "@nestjs/common";
import { forkJoin, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { Resource } from "../../common/model/resource.model";
import { AttendanceUploadLogDbService, ClockImportLogDbService, ClockLogDbService, UserprofileDbService } from "../../common/db/table.db.service";
import { ClockLogModel } from '../../common/model/clock-log.model';
import { v1 } from 'uuid';
import moment = require("moment");
import { AttendanceUploadLogModel } from "../../common/model/attendance-upload-log.model";
import { ClockImportLogModel } from "../../common/model/clock-import-log.model";

@Injectable()
export class ClockImportService {
  constructor(
    private readonly userprofileDbService: UserprofileDbService,
    private readonly attendanceUploadLogDbService: AttendanceUploadLogDbService,
    private readonly clockLogDbService: ClockLogDbService,
    private readonly clockImportLogDbService: ClockImportLogDbService
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
            // console.log(element.Att_Time);
            if (element.Dev_ID == 1) {
              model.CLOCK_IN_TIME = moment(element.Att_Time).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
              // console.log(model.CLOCK_IN_TIME);
            } else if (element.Dev_ID == 2) {
              model.CLOCK_OUT_TIME = moment(element.Att_Time).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
              // console.log(model.CLOCK_OUT_TIME);
            }
            // model.CLOCK_IN_TIME = moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
            // model.CLOCK_OUT_TIME = moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
            resource.resource.push(model);
          }
        });
        // console.log(resource);
        return this.clockLogDbService.createByModel([resource, [], [], []]).pipe(
          map(res => {
            return res.data.resource;
          })
        );
        // return of(res);
      })
    )

  }

  public importCsvProcessUpload([data, user, attendanceId]) {
    return this.userprofileDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`, `AND (DELETED_AT IS NULL)`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        let existData = this.clockImportLogDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`, 'AND DATE(CREATION_TS) > (DATE_SUB(curdate(), INTERVAL 1 MONTH))'], null, null, null, [], null]);
        return forkJoin([of(res), existData]);
      }),
      mergeMap(res => {
        let [resultUser, existData] = res;
        let resource = new Resource(new Array);
        let failedList = [];
        let successList = [];
        // console.log(existData);
        data.forEach(element => {
          let userData = resultUser.find(x => x.STAFF_ID === element.UserID)

          if (userData != undefined) {
            // check existing data
            let statusData = false;

            // existData.find(x=> x.USER_GUID === userData.USER_GUID && x.CLOCK_IN_TIME === )

            let model = new ClockImportLogModel;
            model.ATTENDANCE_UPLOAD_GUID = attendanceId;
            model.CLOCK_LOG_GUID = v1();
            model.TENANT_GUID = user.TENANT_GUID;
            model.USER_GUID = userData.USER_GUID
            model.JOB_TYPE = 'office';
            model.CLIENT_ID = 'none';
            model.PROJECT_ID = 'none';
            model.CONTRACT_ID = 'none';
            model.SOURCE_ID = 3;
            // console.log(element.Att_Time);
            // console.log(moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss'));

            if (element.Dev_ID == 1) {
              let checkingClockIn = existData.find(x => x.USER_GUID === userData.USER_GUID && x.CLOCK_IN_TIME === moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss'));
              // console.log(checkingClockIn);
              if (!checkingClockIn) {
                model.CLOCK_IN_TIME = moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
                statusData = true;
              }
              // console.log(model.CLOCK_IN_TIME);
            } else if (element.Dev_ID == 2) {
              let checkingClockOut = existData.find(x => x.USER_GUID === userData.USER_GUID && x.CLOCK_OUT_TIME === moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss'));
              // console.log(checkingClockOut);
              if (!checkingClockOut) {
                model.CLOCK_OUT_TIME = moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
                statusData = true;
              }
              // console.log(model.CLOCK_OUT_TIME);
            }
            // model.CLOCK_IN_TIME = moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
            // model.CLOCK_OUT_TIME = moment(element.Att_Time, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss');

            if (statusData) {
              resource.resource.push(model);
              element.message = 'Successfully imported';
              successList.push(element);
            } else {
              element.message = 'Existing data';
              failedList.push(element);
            }
          }
          else {
            element.message = 'Cannot find user with this staff id';
            failedList.push(element);
          }
        });
        // console.log(successList);
        // console.log(failedList);
        // console.log(resource);
        if (resource.resource.length > 0) {
          return this.clockImportLogDbService.createByModel([resource, [], [], []]).pipe(
            // map(res => {
            //   this.clockImportLogDbService.createByModel([resource, [], [], []]).subscribe();
            //   return res;
            // }),
            mergeMap(res => {
              // return res.data.resource;
              return forkJoin([of(successList), of(failedList)]);
            })
          );
        } else {
          return forkJoin([of(successList), of(failedList)]);
        }

        // return of(res);
      })
    )

  }

  public logImportAttendance([fileInfo, user, filename]: [any, any, string]) {

    let model = new AttendanceUploadLogModel;
    let resource = new Resource(new Array);

    model.TENANT_GUID = user.TENANT_GUID;
    // model.FILENAME = fileInfo.originalname;
    model.FILENAME = filename;
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

  public logImportAttendanceUpload([fileInfo, user, filename]: [any, any, string]) {

    let model = new AttendanceUploadLogModel;
    let resource = new Resource(new Array);

    model.ATTENDANCE_UPLOAD_GUID = v1();
    model.TENANT_GUID = user.TENANT_GUID;
    model.FILENAME = filename;
    model.SIZE = fileInfo.size;
    model.CREATION_USER_GUID = user.USER_GUID;

    resource.resource.push(model);
    return this.attendanceUploadLogDbService.createByModel([resource, [], [], []]).pipe(
      map(res => {
        return res.data.resource[0];
      })
    );
  }

  public getLogAttendanceUpload([user]) {
    return this.attendanceUploadLogDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        let arrayTemp = [];
        res.forEach(x => {
          arrayTemp.includes(x.CREATION_USER_GUID) ? null : arrayTemp.push(x.CREATION_USER_GUID);
        })
        let userInfo = of([])
        if (arrayTemp.length > 0) {
          userInfo = this.userprofileDbService.findByFilterV4([[], [`(USER_GUID IN (${arrayTemp}))`], null, null, null, [], null]);
        }
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