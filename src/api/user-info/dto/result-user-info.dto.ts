export class WorkingHourSettingDTO {
  start: string;
  end: string;
  message: string;
}

export class CalendarSettingDTO {
  restday: string[];
  message: string;
}

export class ProfileSettingDetailDTO {
  calendar: CalendarSettingDTO;
  workingHour: WorkingHourSettingDTO;
}

export class ResultUserInfoDTO {
  userId: string;
  email: string;
  companyName: string;
  profilePictureUrl: string;
  profileSetting: ProfileSettingDetailDTO;
}