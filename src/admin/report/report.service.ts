import { Injectable } from "@nestjs/common";
import moment = require("moment");
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { ClockLogDbService } from "../../common/db/table.db.service";
import { AttendanceDetailsDTO, ResultAttendanceDTO } from './dto/result-attendance.dto';

@Injectable()
export class ReportService {
  constructor(private readonly clockLogDbService: ClockLogDbService) { }
  public getReportListAttendance([data]) {
    const userArr = data.userid.split(',');
    // console.log(userArr);

    // // Accessing individual values
    // console.log(userArr[0]); // Outputs: Harry
    // console.log(userArr[1]); // Outputs: John
    // console.log(userArr[userArr.length - 1]); // Outputs: Alice

    return this.clockLogDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`, `AND (CLOCK_IN_TIME >= ` + data.startdate + `)`, `AND (CLOCK_IN_TIME <= ` + data.enddate + `)`], null, null, null, ['USER_DATA', 'PROJECT_DATA', 'CONTRACT_DATA'], null]).pipe(
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
              dataAttndnce.project_code_in = attndnceData.PROJECT_DATA.CODE;
              dataAttndnce.contract_code_in = attndnceData.CONTRACT_DATA.CODE;
              dataAttndnce.clock_out_time = attndnceData.CLOCK_OUT_TIME;
              dataAttndnce.address_out = attndnceData.ADDRESS_OUT;

              let clockout = moment(dataAttndnce.clock_out_time, 'YYYY-MM-DD HH:mm:ss');
              let clockin = moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss');
              let duration = moment.duration(clockout.diff(clockin));
              let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

              dataAttndnce.total_hrs = period != 'Invalid date' ? period : null;

              attndnceArr.push(dataAttndnce);
            });
            dataRes.attendance = attndnceArr;
            finalArr.push(dataRes);
          }
        });
        return finalArr;
      })
    );

  }
}