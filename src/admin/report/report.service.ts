import { Injectable } from "@nestjs/common";
import moment = require("moment");
import { of, forkJoin } from 'rxjs';
import { map, mergeMap } from "rxjs/operators";
import { ClockLogDbService, WorkingHourDbService, UserprofileDbService, CalendarProfileDetailDbService, LeaveTransactionDbService, LeaveTypeDbService, ClockLogViewDbService } from '../../common/db/table.db.service';
import { ActivityDetailDTO, AttendanceDetailsDTO, ResultActivityDTO, ResultAttendanceDTO } from './dto/result-attendance.dto';

var { convertXMLToJson } = require('@zencloudservices/xmlparser');

@Injectable()
export class ReportService {
  constructor(
    private readonly clockLogDbService: ClockLogDbService,
    private readonly workingHourDbService: WorkingHourDbService,
    private readonly userprofileDbService: UserprofileDbService,
    private readonly calendarProfileDetailDbService: CalendarProfileDetailDbService,
    private readonly leaveTransactionDbService: LeaveTransactionDbService,
    private readonly leaveTypeDbService: LeaveTypeDbService,
    private readonly clockLogViewDbService: ClockLogViewDbService
  ) { }
  // public getReportListAttendance([data, user]) {
  //   const userArr = data.userid.split(',');
  //   // console.log(userArr);

  //   // // Accessing individual values
  //   // console.log(userArr[0]); // Outputs: Harry
  //   // console.log(userArr[1]); // Outputs: John
  //   // console.log(userArr[userArr.length - 1]); // Outputs: Alice

  //   return this.clockLogDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`
  //     // , `AND (CLOCK_IN_TIME > ` + data.startdate
  //     // + ` OR CLOCK_OUT_TIME >= ` + data.startdate + `OR CLOCK_IN_TIME <= ` + data.enddate 
  //     // + ` OR CLOCK_OUT_TIME < ` + data.enddate + `)`
  //     , `AND (TENANT_GUID = ${user.TENANT_GUID})`], null, null, null, ['USER_DATA', 'PROJECT_DATA', 'CONTRACT_DATA', 'CLIENT_DATA'], null]).pipe(
  //       // mergeMap(res => {
  //       //   let workinghoursData = this.workingHourDbService.findByFilterV4([[], [`(WORKING_HOURS_GUID=${res[0].USER_DATA.WORKING_HOURS_GUID})`], null, null, null, [], null]);
  //       //   return forkJoin([of(res), workinghoursData]);
  //       // }), 
  //       map(res => {
  //         console.log(res);
  //         let finalArr = [];
  //         userArr.forEach(userguid => {
  //           let userData = res.filter(x => x.USER_GUID === userguid);
  //           if (userData.length > 0) {
  //             let dataRes = new ResultAttendanceDTO;
  //             let userInfo = userData[0].USER_DATA;
  //             dataRes.userGuid = userInfo.USER_GUID;
  //             dataRes.employeeNo = userInfo.STAFF_ID;
  //             dataRes.employeeName = userInfo.FULLNAME;
  //             dataRes.designation = userInfo.DESIGNATION;
  //             dataRes.companyName = userInfo.COMPANY_NAME;
  //             dataRes.department = userInfo.DEPARTMENT;
  //             let attndnceArr = [];
  //             let prevDate;
  //             let clockInTemp;
  //             let clockOutTemp;
  //             userData.forEach(attndnceData => {
  //               let dataAttndnce = new AttendanceDetailsDTO;
  //               dataAttndnce.clock_in_time = attndnceData.CLOCK_IN_TIME != null ? moment(attndnceData.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

  //               dataAttndnce.address_in = attndnceData.ADDRESS_IN;
  //               dataAttndnce.job_type_in = attndnceData.JOB_TYPE;
  //               dataAttndnce.client_name = attndnceData.CLIENT_DATA.NAME ? attndnceData.CLIENT_DATA.NAME : null;
  //               dataAttndnce.project_code_in = attndnceData.PROJECT_DATA.SOC_NO ? attndnceData.PROJECT_DATA.SOC_NO : null;
  //               dataAttndnce.contract_code_in = attndnceData.CONTRACT_DATA.CONTRACT_NO ? attndnceData.CONTRACT_DATA.CONTRACT_NO : null;
  //               dataAttndnce.clock_out_time = attndnceData.CLOCK_OUT_TIME != null ? moment(attndnceData.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

  //               dataAttndnce.address_out = attndnceData.ADDRESS_OUT;
  //               dataAttndnce.source = attndnceData.SOURCE_ID == 1 ? 'System' : attndnceData.SOURCE_ID == 2 ? 'Raise request' : attndnceData.SOURCE_ID == 3 ? 'Imported' : null;
  //               dataAttndnce.problem = 'Short hours';

  //               let clockout = moment(dataAttndnce.clock_out_time, 'YYYY-MM-DD HH:mm:ss');
  //               let clockin = moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss');
  //               let duration = moment.duration(clockout.diff(clockin));
  //               let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

  //               dataAttndnce.hours = period != 'Invalid date' ? period : null;

  //               attndnceArr.push(dataAttndnce);
  //             });
  //             attndnceArr.sort(function (a, b) {
  //               var c = new Date(a.clock_in_time) as any;
  //               var d = new Date(b.clock_in_time) as any;
  //               return c - d;
  //             });

  //             attndnceArr.forEach(dataAttndnce => {
  //               if (prevDate != moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
  //                 clockInTemp = dataAttndnce.clock_in_time;
  //               if (prevDate == moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')) {
  //                 clockOutTemp = dataAttndnce.clock_out_time;

  //                 let clockout = moment(clockOutTemp, 'YYYY-MM-DD HH:mm:ss');
  //                 let clockin = moment(clockInTemp, 'YYYY-MM-DD HH:mm:ss');
  //                 let duration = moment.duration(clockout.diff(clockin));
  //                 let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

  //                 dataAttndnce.total_hrs = (moment(dataAttndnce.total_hrs || '00:00', 'HH:mm').add(period).format('HH:mm')).toString();
  //               }
  //               else {
  //                 dataAttndnce.total_hrs = dataAttndnce.hours;
  //               }

  //               prevDate = moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');

  //             });

  //             dataRes.attendance = attndnceArr;
  //             finalArr.push(dataRes);
  //           }
  //         });
  //         return finalArr;
  //       })
  //     );

  // }

  // public getReportListAttendance([data, user]) {
  //   const userArr = data.userid.split(',');

  //   return this.clockLogDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`, `AND (TENANT_GUID = ${user.TENANT_GUID})`], null, null, null, ['USER_DATA', 'PROJECT_DATA', 'CONTRACT_DATA', 'CLIENT_DATA'], null]).pipe(
  //     mergeMap(res => {
  //       let workinghoursData = this.workingHourDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`], null, null, null, [], null]);
  //       return forkJoin([of(res), workinghoursData]);
  //     }),
  //     map(res => {

  //       let finalArr = [];
  //       userArr.forEach(userguid => {

  //         let userData = res[0].filter(x => x.USER_GUID === userguid);
  //         let workinghours;
  //         if (userData.length > 0)
  //           workinghours = res[1].find(x => x.WORKING_HOURS_GUID === userData[0].USER_DATA.WORKING_HOURS_GUID);
  //         else {
  //           workinghours = res[1][0];
  //         }
  //         let workingHourdDetails = convertXMLToJson(workinghours.PROPERTIES_XML);
  //         let durationFullday = workingHourdDetails.property.fullday;
  //         let durationPerDay = moment(durationFullday.end_time, 'HH:mm').subtract(durationFullday.start_time).format('H');
  //         console.log('before');
  //         if (userData.length > 0) {
  //           let dataRes = new ResultAttendanceDTO;
  //           let userInfo = userData[0].USER_DATA;
  //           dataRes.userGuid = userInfo.USER_GUID;
  //           dataRes.employeeNo = userInfo.STAFF_ID;
  //           dataRes.employeeName = userInfo.FULLNAME;
  //           dataRes.designation = userInfo.DESIGNATION;
  //           dataRes.companyName = userInfo.COMPANY_NAME;
  //           dataRes.department = userInfo.DEPARTMENT;
  //           let attndnceArr = [];
  //           // for (var i = -1; i < moment(data.enddate).diff(data.startdate, "days"); i++) {
  //           // for (var i = -1; moment(data.startdate).diff(data.enddate, "days") < i; i++) {
  //           for (var i = 0; i <= moment(data.enddate).diff(data.startdate, "days"); i++) {
  //             // var startdate = moment(data.enddate).utc().subtract(i, "days").format("YYYY-MM-DD");
  //             var startdate = moment(data.startdate).utc().add(i, "days").format("YYYY-MM-DD");
  //             let byDate = userData.filter(x => moment(x.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD') === startdate || moment(x.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD') === startdate);

  //             var dateIn = byDate.map(function (x) { return x.CLOCK_IN_TIME ? new Date(x.CLOCK_IN_TIME) : null; }).filter(x => x != null);

  //             var earliest = new Date(Math.min.apply(null, dateIn));
  //             var dateOut = byDate.map(function (x) { return x.CLOCK_OUT_TIME ? new Date(x.CLOCK_OUT_TIME) : null; }).filter(x => x != null);

  //             var latest = new Date(Math.max.apply(null, dateOut));


  //             let clockout = moment(latest, 'YYYY-MM-DD HH:mm:ss');
  //             let clockin = moment(earliest, 'YYYY-MM-DD HH:mm:ss');
  //             let duration = moment.duration(clockout.diff(clockin));
  //             let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

  //             let periodTemp = moment(period, 'HH:mm');
  //             let durationPerDayTemp = moment(durationPerDay, 'H');
  //             let timeDiff = moment.duration(periodTemp.diff(durationPerDayTemp)).minutes();

  //             let resultArray = [];
  //             byDate.forEach(attndnceData => {

  //               let dataAttndnce = new AttendanceDetailsDTO;

  //               dataAttndnce.clock_in_time = attndnceData.CLOCK_IN_TIME != null ? moment(attndnceData.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

  //               dataAttndnce.address_in = attndnceData.ADDRESS_IN;
  //               dataAttndnce.job_type_in = attndnceData.JOB_TYPE;
  //               dataAttndnce.client_name = attndnceData.CLIENT_DATA.NAME ? attndnceData.CLIENT_DATA.NAME : null;
  //               dataAttndnce.project_code_in = attndnceData.PROJECT_DATA.SOC_NO ? attndnceData.PROJECT_DATA.SOC_NO : null;
  //               dataAttndnce.contract_code_in = attndnceData.CONTRACT_DATA.CONTRACT_NO ? attndnceData.CONTRACT_DATA.CONTRACT_NO : null;
  //               dataAttndnce.clock_out_time = attndnceData.CLOCK_OUT_TIME != null ? moment(attndnceData.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

  //               dataAttndnce.address_out = attndnceData.ADDRESS_OUT;
  //               dataAttndnce.source = attndnceData.SOURCE_ID == 1 ? 'System' : attndnceData.SOURCE_ID == 2 ? 'Raise request' : attndnceData.SOURCE_ID == 3 ? 'Imported' : null;

  //               let clockout = moment(dataAttndnce.clock_out_time, 'YYYY-MM-DD HH:mm:ss');
  //               let clockin = moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss');
  //               let duration = moment.duration(clockout.diff(clockin));
  //               let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

  //               dataAttndnce.hours = period != 'Invalid date' ? period : null;

  //               resultArray.push(dataAttndnce);

  //             });

  //             let arrTemp = {};
  //             arrTemp['date'] = startdate;
  //             arrTemp['total_hours'] = period != 'Invalid date' ? period : null;

  //             if (byDate.length == 0) {
  //               arrTemp['problem'] = 'Absent';
  //             } else if (timeDiff < 0) {
  //               arrTemp['problem'] = 'Early out';
  //             } else if (moment(earliest).add(8, 'hours').format('HH:mm') > moment(durationFullday.start_time, 'HH:mm').add(15, 'minutes').format('HH:mm')) {
  //               arrTemp['problem'] = 'Late';
  //             } else {
  //               arrTemp['problem'] = null;
  //             }
  //             resultArray.sort(function (a, b) {
  //               var c = new Date(a.clock_in_time) as any;
  //               var d = new Date(b.clock_in_time) as any;
  //               return c - d;
  //             });

  //             if (resultArray.length == 0) {
  //               let dataAttndnce = new AttendanceDetailsDTO;
  //               dataAttndnce.clock_in_time = null;
  //               dataAttndnce.address_in = null;
  //               dataAttndnce.job_type_in = null;
  //               dataAttndnce.client_name = null;
  //               dataAttndnce.project_code_in = null;
  //               dataAttndnce.contract_code_in = null;
  //               dataAttndnce.clock_out_time = null;
  //               dataAttndnce.address_out = null;
  //               dataAttndnce.source = null;
  //               dataAttndnce.hours = null;

  //               resultArray.push(dataAttndnce);
  //             }
  //             arrTemp['attendance'] = resultArray;
  //             attndnceArr.push(arrTemp);

  //           }

  //           dataRes.attendance = attndnceArr;
  //           finalArr.push(dataRes);
  //         }
  //       });
  //       console.log(finalArr);
  //       return finalArr;
  //     })
  //   );

  // }

  public getReportListAttendance([data, user]) {
    // split by user guid
    const userArr = data.userid.split(',');

    let calendarIdList;
    let workingHourIdList;
    let userDataList;
    let calendarList
    let workingHourList;
    let leaveList;
    let clockList;
    let leavetypeList;

    return this.userprofileDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`, `AND (TENANT_GUID = ${user.TENANT_GUID})`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        // group calendar id and working hours id by user profile
        calendarIdList = [...new Set(res.map(item => item.CALENDAR_GUID))];
        workingHourIdList = [...new Set(res.map(item => item.WORKING_HOURS_GUID))];
        // find calendar profile data details (for public holiday and rest day)
        // let calendarProfileDetails = this.calendarProfileDetailDbService.findByFilterV4([[], [`(CALENDAR_GUID IN (${calendarIdList}))`, `AND (YEAR=${new Date().getFullYear()})`], null, null, null, [], null]);

        // let calendarProfileDetails = this.calendarProfileDetailDbService.findByFilterV4([[], [`(CALENDAR_GUID IN (${calendarIdList}))`, `AND (YEAR=${new Date(data.startdate).getFullYear()})`], null, null, null, [], null]);

        let calendarProfileDetails = this.calendarProfileDetailDbService.findByFilterV4([[], [`(CALENDAR_GUID IN (${calendarIdList}))`, `AND (YEAR IN (${new Date(data.startdate).getFullYear()},${new Date(data.enddate).getFullYear()}))`], null, null, null, [], null]);

        // find working hours data details (to check early out, late)
        let workingHoursData = this.workingHourDbService.findByFilterV4([[], [`(WORKING_HOURS_GUID IN (${workingHourIdList}))`], null, null, null, [], null]);

        let startdateTime = moment(data.startdate).subtract(3, 'months').format('YYYY-MM-DD');
        let enddateTime = moment(data.startdate).add(3, 'months').format('YYYY-MM-DD');
        // console.log(startdateTime);
        // get all leave by date (to state user apply leave on that day)
        let leaveTransactionData = this.leaveTransactionDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`, `AND (USER_GUID IN (${data.userid}))`, `AND (START_DATE >= ${startdateTime})`, `AND (END_DATE <= ${enddateTime})`, `AND (STATUS = APPROVED)`], null, null, null, [], null]);

        // get all clock log 
        // let clockLogData = this.clockLogDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`, `AND (CREATION_TS >= ${data.startdate})`, `AND (TENANT_GUID = ${user.TENANT_GUID})`], null, null, null, ['USER_DATA', 'PROJECT_DATA', 'CONTRACT_DATA', 'CLIENT_DATA'], null]);
        // let clockLogData = this.clockLogViewDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`, `AND (CREATION_TS >= ${data.startdate})`, `AND (CREATION_TS <= ${data.enddate} OR CLOCK_OUT_TIME <= ${data.enddate})`, `AND (TENANT_GUID = ${user.TENANT_GUID})`], null, null, null, ['USER_DATA', 'PROJECT_DATA', 'CONTRACT_DATA', 'CLIENT_DATA'], null]);
        let startdateTemp = moment(data.startdate).subtract(1, 'days').format('YYYY-MM-DD');
        let enddateTemp = moment(data.enddate).add(1, 'days').format('YYYY-MM-DD');
        let clockLogData = this.clockLogViewDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`, `AND (KEY_TIME >= ${startdateTemp})`, `AND (KEY_TIME <= ${enddateTemp})`, `AND (TENANT_GUID = ${user.TENANT_GUID})`], null, null, null, [], null]);

        // get all leavetype
        let leavetypeData = this.leaveTypeDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`], null, null, null, [], null])

        return forkJoin([of(res), calendarProfileDetails, workingHoursData, leaveTransactionData, clockLogData, leavetypeData]);
      }), map(res => {
        [userDataList, calendarList, workingHourList, leaveList, clockList, leavetypeList] = res;

        let finalArr = [];

        userArr.forEach(userguid => {

          // find user info for current looping user
          let userData = userDataList.find(x => x.USER_GUID === userguid);

          // find working hours data for current looping user
          let workinghours = workingHourList.find(x => x.WORKING_HOURS_GUID === userData.WORKING_HOURS_GUID);

          let workingHourdDetails = convertXMLToJson(workinghours.PROPERTIES_XML);
          let durationFullday = workingHourdDetails.property.fullday;
          let durationPerDay = moment(durationFullday.end_time, 'HH:mm').subtract(durationFullday.start_time).format('H');

          // find calendar data for current looping user
          // let calendarDetailsInfo = calendarList.find(x => x.CALENDAR_GUID === userData.CALENDAR_GUID);
          let calendarDetailsInfo = calendarList.filter(x => x.CALENDAR_GUID === userData.CALENDAR_GUID);

          let calendarDetails = convertXMLToJson(calendarDetailsInfo[0].PROPERTIES_XML);
          let calendarDetails2 = null;
          if (calendarDetailsInfo.length > 1) {
            calendarDetails2 = convertXMLToJson(calendarDetailsInfo[1].PROPERTIES_XML);
          }

          // console.log(leaveList);

          let calendarRestDay = Array.isArray(calendarDetails.rest) ? calendarDetails.rest : [calendarDetails.rest];
          let restDay = [...new Set(calendarRestDay.map(item => item.fullname))];

          if (userData) {
            let dataRes = new ResultAttendanceDTO;
            let userInfo = userData;
            dataRes.userGuid = userInfo.USER_GUID;
            dataRes.employeeNo = userInfo.STAFF_ID;
            dataRes.employeeName = userInfo.FULLNAME;
            dataRes.designation = userInfo.DESIGNATION;
            dataRes.companyName = userInfo.COMPANY_NAME;
            dataRes.department = userInfo.DEPARTMENT;
            let attndnceArr = [];

            for (var i = 0; i <= moment(data.enddate).diff(data.startdate, "days"); i++) {

              var startdate = moment(data.startdate).utc().add(i, "days").format("YYYY-MM-DD");
              // console.log(startdate);
              // console.log(moment(startdate).format('dddd').toUpperCase());
              // console.log(calendarDetails.rest);

              // find leave taken by current looping user
              // let leaveTaken = leaveList.find(x => (x.USER_GUID === userguid && x.START_DATE === startdate));
              let leaveTaken = leaveList.find(x => (x.USER_GUID === userguid && (moment(startdate, 'YYYY-MM-DD').isBetween(x.START_DATE, x.END_DATE) || moment(startdate, 'YYYY-MM-DD').isSame(x.START_DATE) || moment(startdate, 'YYYY-MM-DD').isSame(x.END_DATE))));

              let restday = restDay.includes(moment(startdate).format('dddd').toUpperCase()) ? 1 : 0;
              // console.log(restday);
              let publicHoliday = calendarDetails.holiday.find(x => x.start === startdate);
              if (publicHoliday == null && calendarDetails2 != null) {
                publicHoliday = calendarDetails2.holiday.find(x => x.start === startdate);
              }
              // console.log(publicHoliday);
              // console.log(clockList);
              // let byDate = clockList.filter(x => x.USER_GUID === userguid && (moment(x.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD') === startdate || moment(x.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD') === startdate));
              // console.log(startdate);
              let byDate = clockList.filter(x => x.USER_GUID === userguid && (moment(x.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD') === startdate || moment(x.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD') === startdate));
              // console.log(byDate);
              var dateIn = byDate.map(function (x) { return x.CLOCK_IN_TIME ? new Date(x.CLOCK_IN_TIME) : null; }).filter(x => x != null);

              var earliest = new Date(Math.min.apply(null, dateIn));
              var dateOut = byDate.map(function (x) { return x.CLOCK_OUT_TIME ? new Date(x.CLOCK_OUT_TIME) : null; }).filter(x => x != null);

              var latest = new Date(Math.max.apply(null, dateOut));


              let clockout = moment(latest, 'YYYY-MM-DD HH:mm:ss');
              let clockin = moment(earliest, 'YYYY-MM-DD HH:mm:ss');
              let duration = moment.duration(clockout.diff(clockin));
              let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

              let periodTemp = moment(period, 'HH:mm');
              let durationPerDayTemp = moment(durationPerDay, 'H');
              let timeDiff = moment.duration(periodTemp.diff(durationPerDayTemp)).minutes();

              let resultArray = [];
              byDate.forEach(attndnceData => {

                let dataAttndnce = new AttendanceDetailsDTO;

                dataAttndnce.clock_in_time = attndnceData.CLOCK_IN_TIME != null ? moment(attndnceData.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

                dataAttndnce.address_in = attndnceData.ADDRESS_IN;
                dataAttndnce.job_type_in = attndnceData.JOB_TYPE;
                // dataAttndnce.client_name = attndnceData.CLIENT_DATA.NAME ? attndnceData.CLIENT_DATA.NAME : null;
                dataAttndnce.client_name = attndnceData.CLIENT_NAME;
                // dataAttndnce.project_code_in = attndnceData.PROJECT_DATA.SOC_NO ? attndnceData.PROJECT_DATA.SOC_NO : null;
                dataAttndnce.project_code_in = attndnceData.PROJECT_SOC;
                // dataAttndnce.contract_code_in = attndnceData.CONTRACT_DATA.CONTRACT_NO ? attndnceData.CONTRACT_DATA.CONTRACT_NO : null;
                dataAttndnce.contract_code_in = attndnceData.CONTRACT_NO;
                dataAttndnce.clock_out_time = attndnceData.CLOCK_OUT_TIME != null ? moment(attndnceData.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

                dataAttndnce.address_out = attndnceData.ADDRESS_OUT;
                dataAttndnce.source = attndnceData.SOURCE_ID == 1 ? 'System' : attndnceData.SOURCE_ID == 2 ? 'Raise request' : attndnceData.SOURCE_ID == 3 ? 'Imported' : null;
                dataAttndnce.key_time = attndnceData.KEY_TIME;
                let clockout = moment(dataAttndnce.clock_out_time, 'YYYY-MM-DD HH:mm:ss');
                let clockin = moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss');
                let duration = moment.duration(clockout.diff(clockin));
                let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

                dataAttndnce.hours = period != 'Invalid date' ? period : null;

                resultArray.push(dataAttndnce);

              });

              let arrTemp = {};
              arrTemp['date'] = startdate;
              arrTemp['total_hours'] = period != 'Invalid date' ? period : null;
              // console.log(byDate);
              if (byDate.length == 0) {
                arrTemp['problem'] = 'Absent';
              } else if (timeDiff < 0) {
                arrTemp['problem'] = 'Early out';
              } else if (moment(earliest).add(8, 'hours').format('HH:mm') > moment(durationFullday.start_time, 'HH:mm').add(15, 'minutes').format('HH:mm')) {
                arrTemp['problem'] = 'Late';
              } else {
                arrTemp['problem'] = null;
              }

              if (restday == 1) {
                arrTemp['problem'] = 'Rest day';
              }

              if (publicHoliday != undefined) {
                arrTemp['problem'] = publicHoliday.holidayName;
              }

              if (leaveTaken != undefined) {
                let leavetypeInfo = leavetypeList.find(x => x.LEAVE_TYPE_GUID === leaveTaken.LEAVE_TYPE_GUID);

                // arrTemp['problem'] = leavetypeInfo != undefined ? leavetypeInfo.CODE : 'Birthday Leave';
                arrTemp['problem'] = leavetypeInfo != undefined ? leavetypeInfo.CODE + (leaveTaken.TIME_SLOT ? ' - ' + leaveTaken.TIME_SLOT : '') : 'Birthday Leave';
              }

              // resultArray.sort(function (a, b) {
              //   var c = new Date(a.clock_in_time) as any;
              //   var d = new Date(b.clock_in_time) as any;
              //   // return c - d;
              //   return d - c;
              // });

              resultArray.sort(function (a, b) {
                var c = new Date(a.key_time) as any;
                var d = new Date(b.key_time) as any;
                // return c - d;
                return c - d;
              });

              if (resultArray.length == 0) {
                let dataAttndnce = new AttendanceDetailsDTO;
                dataAttndnce.clock_in_time = null;
                dataAttndnce.address_in = null;
                dataAttndnce.job_type_in = null;
                dataAttndnce.client_name = null;
                dataAttndnce.project_code_in = null;
                dataAttndnce.contract_code_in = null;
                dataAttndnce.clock_out_time = null;
                dataAttndnce.address_out = null;
                dataAttndnce.source = null;
                dataAttndnce.hours = null;
                dataAttndnce.key_time = null;

                resultArray.push(dataAttndnce);
              }
              arrTemp['attendance'] = resultArray;
              attndnceArr.push(arrTemp);

            }

            dataRes.attendance = attndnceArr;
            finalArr.push(dataRes);
          }

        });
        // console.log(finalArr);
        return finalArr;
        // return workingHourList;
      })
    )
    // .subscribe(
    //   data => { console.log(data); },
    //   err => { console.log(err); }
    // )

    // return this.clockLogDbService.findByFilterV4([[], [`(USER_GUID IN (${data.userid}))`, `AND (TENANT_GUID = ${user.TENANT_GUID})`], null, null, null, ['USER_DATA', 'PROJECT_DATA', 'CONTRACT_DATA', 'CLIENT_DATA'], null]).pipe(
    //   mergeMap(res => {
    //     let workinghoursData = this.workingHourDbService.findByFilterV4([[], [`(TENANT_GUID=${user.TENANT_GUID})`], null, null, null, [], null]);
    //     return forkJoin([of(res), workinghoursData]);
    //   }),
    //   map(res => {

    //     let finalArr = [];
    //     userArr.forEach(userguid => {

    //       let userData = res[0].filter(x => x.USER_GUID === userguid);
    //       let workinghours;
    //       if (userData.length > 0)
    //         workinghours = res[1].find(x => x.WORKING_HOURS_GUID === userData[0].USER_DATA.WORKING_HOURS_GUID);
    //       else {
    //         workinghours = res[1][0];
    //       }
    //       let workingHourdDetails = convertXMLToJson(workinghours.PROPERTIES_XML);
    //       let durationFullday = workingHourdDetails.property.fullday;
    //       let durationPerDay = moment(durationFullday.end_time, 'HH:mm').subtract(durationFullday.start_time).format('H');
    //       console.log('before');
    //       if (userData.length > 0) {
    //         let dataRes = new ResultAttendanceDTO;
    //         let userInfo = userData[0].USER_DATA;
    //         dataRes.userGuid = userInfo.USER_GUID;
    //         dataRes.employeeNo = userInfo.STAFF_ID;
    //         dataRes.employeeName = userInfo.FULLNAME;
    //         dataRes.designation = userInfo.DESIGNATION;
    //         dataRes.companyName = userInfo.COMPANY_NAME;
    //         dataRes.department = userInfo.DEPARTMENT;
    //         let attndnceArr = [];
    //         // for (var i = -1; i < moment(data.enddate).diff(data.startdate, "days"); i++) {
    //         // for (var i = -1; moment(data.startdate).diff(data.enddate, "days") < i; i++) {
    //         for (var i = 0; i <= moment(data.enddate).diff(data.startdate, "days"); i++) {
    //           // var startdate = moment(data.enddate).utc().subtract(i, "days").format("YYYY-MM-DD");
    //           var startdate = moment(data.startdate).utc().add(i, "days").format("YYYY-MM-DD");
    //           let byDate = userData.filter(x => moment(x.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD') === startdate || moment(x.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD') === startdate);

    //           var dateIn = byDate.map(function (x) { return x.CLOCK_IN_TIME ? new Date(x.CLOCK_IN_TIME) : null; }).filter(x => x != null);

    //           var earliest = new Date(Math.min.apply(null, dateIn));
    //           var dateOut = byDate.map(function (x) { return x.CLOCK_OUT_TIME ? new Date(x.CLOCK_OUT_TIME) : null; }).filter(x => x != null);

    //           var latest = new Date(Math.max.apply(null, dateOut));


    //           let clockout = moment(latest, 'YYYY-MM-DD HH:mm:ss');
    //           let clockin = moment(earliest, 'YYYY-MM-DD HH:mm:ss');
    //           let duration = moment.duration(clockout.diff(clockin));
    //           let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

    //           let periodTemp = moment(period, 'HH:mm');
    //           let durationPerDayTemp = moment(durationPerDay, 'H');
    //           let timeDiff = moment.duration(periodTemp.diff(durationPerDayTemp)).minutes();

    //           let resultArray = [];
    //           byDate.forEach(attndnceData => {

    //             let dataAttndnce = new AttendanceDetailsDTO;

    //             dataAttndnce.clock_in_time = attndnceData.CLOCK_IN_TIME != null ? moment(attndnceData.CLOCK_IN_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

    //             dataAttndnce.address_in = attndnceData.ADDRESS_IN;
    //             dataAttndnce.job_type_in = attndnceData.JOB_TYPE;
    //             dataAttndnce.client_name = attndnceData.CLIENT_DATA.NAME ? attndnceData.CLIENT_DATA.NAME : null;
    //             dataAttndnce.project_code_in = attndnceData.PROJECT_DATA.SOC_NO ? attndnceData.PROJECT_DATA.SOC_NO : null;
    //             dataAttndnce.contract_code_in = attndnceData.CONTRACT_DATA.CONTRACT_NO ? attndnceData.CONTRACT_DATA.CONTRACT_NO : null;
    //             dataAttndnce.clock_out_time = attndnceData.CLOCK_OUT_TIME != null ? moment(attndnceData.CLOCK_OUT_TIME).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') : null;

    //             dataAttndnce.address_out = attndnceData.ADDRESS_OUT;
    //             dataAttndnce.source = attndnceData.SOURCE_ID == 1 ? 'System' : attndnceData.SOURCE_ID == 2 ? 'Raise request' : attndnceData.SOURCE_ID == 3 ? 'Imported' : null;

    //             let clockout = moment(dataAttndnce.clock_out_time, 'YYYY-MM-DD HH:mm:ss');
    //             let clockin = moment(dataAttndnce.clock_in_time, 'YYYY-MM-DD HH:mm:ss');
    //             let duration = moment.duration(clockout.diff(clockin));
    //             let period = moment.utc(duration.asMilliseconds()).format('HH:mm');

    //             dataAttndnce.hours = period != 'Invalid date' ? period : null;

    //             resultArray.push(dataAttndnce);

    //           });

    //           let arrTemp = {};
    //           arrTemp['date'] = startdate;
    //           arrTemp['total_hours'] = period != 'Invalid date' ? period : null;

    //           if (byDate.length == 0) {
    //             arrTemp['problem'] = 'Absent';
    //           } else if (timeDiff < 0) {
    //             arrTemp['problem'] = 'Early out';
    //           } else if (moment(earliest).add(8, 'hours').format('HH:mm') > moment(durationFullday.start_time, 'HH:mm').add(15, 'minutes').format('HH:mm')) {
    //             arrTemp['problem'] = 'Late';
    //           } else {
    //             arrTemp['problem'] = null;
    //           }
    //           resultArray.sort(function (a, b) {
    //             var c = new Date(a.clock_in_time) as any;
    //             var d = new Date(b.clock_in_time) as any;
    //             return c - d;
    //           });

    //           if (resultArray.length == 0) {
    //             let dataAttndnce = new AttendanceDetailsDTO;
    //             dataAttndnce.clock_in_time = null;
    //             dataAttndnce.address_in = null;
    //             dataAttndnce.job_type_in = null;
    //             dataAttndnce.client_name = null;
    //             dataAttndnce.project_code_in = null;
    //             dataAttndnce.contract_code_in = null;
    //             dataAttndnce.clock_out_time = null;
    //             dataAttndnce.address_out = null;
    //             dataAttndnce.source = null;
    //             dataAttndnce.hours = null;

    //             resultArray.push(dataAttndnce);
    //           }
    //           arrTemp['attendance'] = resultArray;
    //           attndnceArr.push(arrTemp);

    //         }

    //         dataRes.attendance = attndnceArr;
    //         finalArr.push(dataRes);
    //       }
    //     });
    //     console.log(finalArr);
    //     return finalArr;
    //   })
    // );

  }


  // public predictsort() {
  //   const sorter = function(c, d, key) {
  //     return new Date(d[key]) - new Date(c[key]);
  //   }
  //   return function(a, b) {
  //     return sorter(a, b, "date");
  //   }
  // }

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