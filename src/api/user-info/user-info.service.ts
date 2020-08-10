import { UserprofileDbService, WorkingHourDbService, CalendarProfileDbService, CalendarProfileDetailDbService } from '../../common/db/table.db.service';
import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { ResultUserInfoDTO, WorkingHourSettingDTO, ProfileSettingDetailDTO, CalendarSettingDTO } from './dto/result-user-info.dto';
var { convertXMLToJson } = require('@zencloudservices/xmlparser');
@Injectable()
export class UserInfoService {
  constructor(
    private readonly userprofileDbService: UserprofileDbService,
    private readonly workingHourDbService: WorkingHourDbService,
    // private readonly calendarProfileDbService:CalendarProfileDbService,
    private readonly calendarProfileDetailDbService: CalendarProfileDetailDbService
  ) { }
  public getUserInfo([userId]) {
    let calendarId;
    let calendarRestDay = [];
    let workingHourTime = [];
    let usernameText, companyText, profilePictureText;

    return this.userprofileDbService.findByFilterV4([[], [`(USER_GUID=${userId})`], null, null, null, [], null]).pipe(
      mergeMap(res => {
        calendarId = res[0].CALENDAR_GUID;
        usernameText = res[0].EMAIL;
        companyText = res[0].COMPANY_NAME;
        profilePictureText = res[0].PROFILE_PICTURE;
        return this.workingHourDbService.findByFilterV4([[], [`(WORKING_HOURS_GUID=${res[0].WORKING_HOURS_GUID})`], null, null, null, [], null]);
      }), mergeMap(res => {

        return this.calendarProfileDetailDbService.findByFilterV4([[], [`(CALENDAR_GUID=${calendarId})`, `AND (YEAR=${new Date().getFullYear()})`], null, null, null, [], null]).pipe(
          map(res2 => {
            let workingHourData = convertXMLToJson(res[0].PROPERTIES_XML);
            let calendarData = convertXMLToJson(res2[0].PROPERTIES_XML);

            workingHourTime = workingHourData.property.fullday;
            calendarRestDay = calendarData.rest;

            return res2;
          })
        )
      }), map(res => {

        let responseData = new ResultUserInfoDTO();
        responseData.username = usernameText;
        responseData.companyName = companyText;
        responseData.profilePictureUrl = process.env.URL_STORAGE_ELEAVE + profilePictureText;

        let workingHourTemp = new WorkingHourSettingDTO;
        workingHourTemp.start = workingHourTime['start_time'];
        workingHourTemp.end = workingHourTime['end_time'];

        let restDay = [];
        calendarRestDay.forEach(element => {
          restDay.push(element.fullname.toLowerCase());
        });

        let calendarTemp = new CalendarSettingDTO;
        calendarTemp.restday = restDay;

        let profileSetting = new ProfileSettingDetailDTO;
        profileSetting.calendar = calendarTemp;
        profileSetting.workingHour = workingHourTemp;

        responseData.profileSetting = profileSetting;

        return responseData;
      })
    )
  }
}