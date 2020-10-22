import { Injectable } from "@nestjs/common";
import moment = require("moment");
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { ClockLogDbService } from "../../common/db/table.db.service";
import { ActivityDetailDTO, AttendanceDetailsDTO, ResultActivityDTO, ResultAttendanceDTO } from './dto/result-attendance.dto';

var { convertXMLToJson } = require('@zencloudservices/xmlparser');

@Injectable()
export class ReportService {
  constructor(private readonly clockLogDbService: ClockLogDbService) { }
  public getReportListAttendance([data, user]) {
    const userArr = data.userid.split(',');
    // console.log(userArr);

    // // Accessing individual values
    // console.log(userArr[0]); // Outputs: Harry
    // console.log(userArr[1]); // Outputs: John
    // console.log(userArr[userArr.length - 1]); // Outputs: Alice

    return this.clockLogDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`, `AND (CLOCK_IN_TIME >= ` + data.startdate + `)`, `AND (CLOCK_IN_TIME <= ` + data.enddate + `)`, , `AND (TENANT_GUID = ${user.TENANT_GUID})`], null, null, null, ['USER_DATA', 'PROJECT_DATA', 'CONTRACT_DATA'], null]).pipe(
      map(res => {

        let finalArr = [];
        userArr.forEach(userguid => {
          let userData = res.filter(x => x.USER_GUID === userguid);
          if (userData.length > 0) {
            let dataRes = new ResultAttendanceDTO;
            let userInfo = userData[0].USER_DATA;
            dataRes.userGuid = userInfo.USER_GUID;
            dataRes.employeeNo = userInfo.STAFF_ID;
            dataRes.employeeName = userInfo.FULLNAME;
            dataRes.designation = userInfo.DESIGNATION;
            dataRes.companyName = userInfo.COMPANY_NAME;
            dataRes.department = userInfo.DEPARTMENT;
            let attndnceArr = [];
            userData.forEach(attndnceData => {
              let dataAttndnce = new AttendanceDetailsDTO;
              dataAttndnce.clock_in_time = attndnceData.CLOCK_IN_TIME;
              dataAttndnce.address_in = attndnceData.ADDRESS_IN;
              dataAttndnce.job_type_in = attndnceData.JOB_TYPE;

              dataAttndnce.project_code_in = attndnceData.PROJECT_DATA.SOC_NO ? attndnceData.PROJECT_DATA.SOC_NO : null;
              dataAttndnce.contract_code_in = attndnceData.CONTRACT_DATA.CONTRACT_NO ? attndnceData.CONTRACT_DATA.CONTRACT_NO : null;
              dataAttndnce.clock_out_time = attndnceData.CLOCK_OUT_TIME;
              dataAttndnce.address_out = attndnceData.ADDRESS_OUT;

              let clockout = moment(dataAttndnce.clock_out_time, 'YYYY-MM-DD HH:mm:ss');
              let clockin = moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss');
              let duration = moment.duration(clockout.diff(clockin));
              let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

              dataAttndnce.total_hrs = period != 'Invalid date' ? period : null;

              attndnceArr.push(dataAttndnce);
            });
            attndnceArr.sort(function (a, b) {
              var c = new Date(a.clock_in_time) as any;
              var d = new Date(b.clock_in_time) as any;
              return c - d;
            });

            dataRes.attendance = attndnceArr;
            finalArr.push(dataRes);
          }
        });
        return finalArr;
      })
    );

  }

  public getActivityList([data, user]) {
    if (data.category == 'project') {
      let filter = [`(PROJECT_ID IN (${data.input}))`, `AND (CLOCK_IN_TIME >= ` + data.startdate + `)`, `AND (CLOCK_IN_TIME <= ` + data.enddate + `)`, `AND (TENANT_GUID = ${user.TENANT_GUID})`];
      return this.getActivityDetails([filter]);
    }
    else if (data.category == 'contract') {
      let filter = [`(CONTRACT_ID IN (${data.input}))`, `AND (CLOCK_IN_TIME >= ` + data.startdate + `)`, `AND (CLOCK_IN_TIME <= ` + data.enddate + `)`, `AND (TENANT_GUID = ${user.TENANT_GUID})`];
      return this.getActivityDetails([filter])
    }
    else if (data.category == 'user') {
      let filter = [`(USER_GUID IN (${data.input}))`, `AND (CLOCK_IN_TIME >= ` + data.startdate + `)`, `AND (CLOCK_IN_TIME <= ` + data.enddate + `)`, `AND (TENANT_GUID = ${user.TENANT_GUID})`];
      return this.getActivityDetails([filter])
    }
    else { return of(data) }
  }

  public getActivityDetails([filters]) {
    return this.clockLogDbService.findByFilterV4([[], filters, null, null, null, ['USER_DATA', 'PROJECT_DATA', 'CONTRACT_DATA'], null]).pipe(
      map(res => {
        const userArr = [...new Set(res.map(item => item.USER_GUID))];

        let finalArr = [];
        userArr.forEach(userguid => {
          let userData = res.filter(x => x.USER_GUID === userguid);
          if (userData.length > 0) {
            let dataRes = new ResultActivityDTO;
            let userInfo = userData[0].USER_DATA;
            dataRes.userGuid = userInfo.USER_GUID;
            dataRes.employeeNo = userInfo.STAFF_ID;
            dataRes.employeeName = userInfo.FULLNAME;
            dataRes.designation = userInfo.DESIGNATION;
            dataRes.companyName = userInfo.COMPANY_NAME;
            dataRes.department = userInfo.DEPARTMENT;
            let activityArr = [];
            userData.forEach(activityData => {
              let dataActivity = new ActivityDetailDTO;

              if (activityData.ACTIVITY) {
                let activityList = convertXMLToJson(activityData.ACTIVITY);
                if (activityList.root) {

                  dataActivity.date = activityData.CLOCK_IN_TIME;
                  dataActivity.project_code_in = activityData.PROJECT_DATA.SOC_NO ? activityData.PROJECT_DATA.SOC_NO : null;;
                  dataActivity.contract_code_in = activityData.CONTRACT_DATA.CONTRACT_NO ? activityData.CONTRACT_DATA.CONTRACT_NO : null;

                  dataActivity.completed = [];
                  dataActivity.pending = [];

                  if (activityList.root.activity.length == undefined) {
                    if (activityList.root.activity.statusFlag) {
                      dataActivity.completed.push(activityList.root.activity.name);
                    } else {
                      if (activityList.root.activity.name)
                        dataActivity.pending.push(activityList.root.activity.name);
                    }

                  } else {
                    activityList.root.activity.forEach(element => {
                      if (element.statusFlag) {
                        dataActivity.completed.push(element.name);
                      } else {
                        if (element.name)
                          dataActivity.pending.push(element.name);
                      }
                    });
                  }

                  if (dataActivity.completed.length > 0 || dataActivity.pending.length > 0)
                    activityArr.push(dataActivity);
                }
              }
            });
            activityArr.sort(function (a, b) {
              var c = new Date(a.date) as any;
              var d = new Date(b.date) as any;
              return c - d;
            });
            dataRes.activity = activityArr;
            if (dataRes.activity.length > 0)
              finalArr.push(dataRes);
          }
        });
        return finalArr;

      })
    );
  }

}