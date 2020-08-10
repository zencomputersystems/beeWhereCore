export class WorkingHourSettingDTO {
  start: string;
  end: string;
}

export class CalendarSettingDTO {
  restday: string[];
}

export class ProfileSettingDetailDTO {
  calendar: CalendarSettingDTO;
  workingHour: WorkingHourSettingDTO;
}

export class ResultUserInfoDTO {
  username: string;
  companyName: string;
  profilePictureUrl: string;
  profileSetting: ProfileSettingDetailDTO;
}