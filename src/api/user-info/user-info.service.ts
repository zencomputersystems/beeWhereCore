import { UserprofileDbService, WorkingHourDbService, CalendarProfileDbService, CalendarProfileDetailDbService } from '../../common/db/table.db.service';
import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { ResultUserInfoDTO, WorkingHourSettingDTO, ProfileSettingDetailDTO, CalendarSettingDTO } from './dto/result-user-info.dto';
import { of } from 'rxjs';
var { convertXMLToJson } = require('@zencloudservices/xmlparser');
@Injectable()
export class UserInfoService {
  constructor(
    private readonly userprofileDbService: UserprofileDbService,
    private readonly workingHourDbService: WorkingHourDbService,
    private readonly calendarProfileDetailDbService: CalendarProfileDetailDbService
  ) { }
  public getUserInfo([userId]) {
    let calendarRestDay = [];
    let workingHourTime = [];
    let profileData;

    return this.userprofileDbService.findByFilterV4([[], [`(USER_GUID=${userId})`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        // setup global profile data 
        profileData = res[0];
        // find working hour data
        if (res[0].WORKING_HOURS_GUID != null) {
          return this.workingHourDbService.findByFilterV4([[], [`(WORKING_HOURS_GUID=${res[0].WORKING_HOURS_GUID})`], null, null, null, [], null]).pipe(
            map(res2 => {
              let workingHourData = convertXMLToJson(res2[0].PROPERTIES_XML);
              workingHourTime = workingHourData.property.fullday;

              // send empty data if have working hour id but not assign fullday time
              if (workingHourTime == undefined) {
                workingHourTime = [];
              }

              return res2;
            })
          );
        } else {
          // send null working hour data if not assign
          workingHourTime = null;
          return of(res[0]);
        }
      }), mergeMap(res => {
        // find calendar data to find rest day
        if (profileData.CALENDAR_GUID != null) {
          return this.calendarProfileDetailDbService.findByFilterV4([[], [`(CALENDAR_GUID=${profileData.CALENDAR_GUID})`, `AND (YEAR=${new Date().getFullYear()})`], null, null, null, [], null]).pipe(
            map(res2 => {
              let calendarData = convertXMLToJson(res2[0].PROPERTIES_XML);
              calendarRestDay = calendarData.rest;
              // send empty array if have calendar id but not assign rest day
              if (calendarRestDay == undefined) {
                calendarRestDay = [];
              }
              return res2;
            })
          )
        } else {
          // send null calendar rest day data if not assign
          calendarRestDay = null;
          return of(res[0]);
        }
      }), map(res => {
        let responseData = new ResultUserInfoDTO();
        responseData.userId = profileData.USER_GUID;
        responseData.email = profileData.EMAIL;
        responseData.companyName = profileData.COMPANY_NAME;
        responseData.profilePictureUrl = process.env.URL_STORAGE_ELEAVE + profileData.PROFILE_PICTURE;

        let workingHourTemp = new WorkingHourSettingDTO;

        if (workingHourTime == null) {
          workingHourTemp = null;
        }
        else {
          workingHourTemp.start = workingHourTime['start_time'];
          workingHourTemp.end = workingHourTime['end_time'];
        }

        let calendarTemp = new CalendarSettingDTO;

        if (calendarRestDay == null) {
          calendarTemp = null;
        } else {
          let restDay = [];
          calendarRestDay.forEach(element => {
            restDay.push(element.fullname.toLowerCase());
          });
          calendarTemp.restday = restDay;
        }

        let profileSetting = new ProfileSettingDetailDTO;
        profileSetting.calendar = calendarTemp;
        profileSetting.workingHour = workingHourTemp;

        responseData.profileSetting = profileSetting;

        return responseData;
      })
    )
  }
}