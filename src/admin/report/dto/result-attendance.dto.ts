export class ActivityDetailDTO {
  date: string;
  project_code_in: string;
  contract_code_in: string;
  completed: string[];
  pending: string[];
}

export class AttendanceDetailsDTO {
  clock_in_time: string;// "2020-09-30 09:34:43",
  address_in: string;// "2, Persiara Flora 6, 63000 Cyberjaya, Selangor",
  job_type_in: string;// "Office" / "Home" / "Site" / "Others",
  project_code_in: string;// "ABC",
  contract_code_in: string;// "",
  clock_out_time: string;// "2020-09-30 10:34:43",
  address_out: string;// "2, Persiara Flora 6, 63000 Cyberjaya, Selangor",
  total_hrs: string;// 1
}

export class ResultUserDTO {
  userGuid: string;// "b1cecca2-fbd4-11ea-a922-075dec0319ed"
  employeeNo: string;// "3116",
  employeeName: string;// "Candise Chong Lee Ping",
  designation: string;// "Senior Finance & Admin Executive",
  companyName: string;// "Zen Computer Systems Sdn Bhd",
  department: string;// "Finance & Management Office",
}

export class ResultAttendanceDTO extends ResultUserDTO {
  attendance: AttendanceDetailsDTO[];//
}

export class ResultActivityDTO extends ResultUserDTO {
  activity: ActivityDetailDTO[];
}