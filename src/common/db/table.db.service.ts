import { Injectable, HttpService } from "@nestjs/common";
import { BaseDBService } from "../base/base.db.service";
import { QueryParserService } from "../helper/query-parser.service";

/**
 * DB table : user main tenant : user_main
 *
 * @export
 * @class UsereLeaveDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class UsereLeaveDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'user_main';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof UserDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "user_main") }
}


/**
 * DB table : user main tenant : a_client_profile
 *
 * @export
 * @class UsereLeaveDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class ClientProfileDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'a_client_profile';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof UserDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "a_client_profile") }
}

/**
 * DB table : user main tenant : a_client_location
 *
 * @export
 * @class ClientLocationDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class ClientLocationDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'a_client_location';
  /**
   *Creates an instance of ClientLocationDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof ClientLocationDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "a_client_location") }
}

/**
 * DB table : user main tenant : a_project_profile
 *
 * @export
 * @class ClientProjectDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class ClientProjectDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'a_project_profile';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof UserDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "a_project_profile") }
}

/**
 * DB table : user main tenant : a_contract_profile
 *
 * @export
 * @class ClientContractDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class ClientContractDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'a_contract_profile';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof UserDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "a_contract_profile") }
}

/**
 * DB table : user_main
 *
 * @export
 * @class UsereLeaveDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class AttendanceProfileDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'a_attendance_profile';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof UserDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "a_attendance_profile") }
}

/**
 * DB table : a_clock_log
 *
 * @export
 * @class ClockLogDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class ClockImportLogDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof ClockLogDbService
   */
  public tableDB = 'a_clock_import_log';
  /**
   *Creates an instance of ClockLogDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof ClockLogDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "a_clock_import_log") }
}

/**
 * DB table : a_clock_log
 *
 * @export
 * @class ClockLogDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class ClockImportLogViewDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof ClockLogDbService
   */
  public tableDB = 'a_clock_log_view';
  /**
   *Creates an instance of ClockLogDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof ClockLogDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "a_clock_log_view") }
}
/**
 * DB table : a_clock_log
 *
 * @export
 * @class ClockLogDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class ClockLogDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof ClockLogDbService
   */
  public tableDB = 'a_clock_log';
  /**
   *Creates an instance of ClockLogDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof ClockLogDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "a_clock_log") }
}

/**
 * DB table : user_main
 *
 * @export
 * @class UsereLeaveDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class UserprofileDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'l_view_user_profile_list';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof UserDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_view_user_profile_list") }
}

/**
 * DB table : user_main
 *
 * @export
 * @class UsereLeaveDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class UserinfoDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'user_info';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof UserDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "user_info") }
}

@Injectable()
export class AttendanceUploadLogDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof UsereLeaveDbService
   */
  public tableDB = 'l_attendance_upload_log';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof UserDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_attendance_upload_log") }
}

/**
 * DB table : l_working_hours_profile
 *
 * @export
 * @class WorkingHourDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class WorkingHourDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof WorkingHourDbService
   */
  public tableDB = 'l_working_hours_profile';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof WorkingHourDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_working_hours_profile") }
}

/**
 * DB table : l_main_leave_transaction
 *
 * @export
 * @class LeaveTransactionDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class LeaveTransactionDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof LeaveTransactionDbService
   */
  public tableDB = 'l_main_leave_transaction';
  /**
   *Creates an instance of LeaveTransactionDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof LeaveTransactionDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_main_leave_transaction") }
}

/**
 * DB table : l_main_leavetype
 *
 * @export
 * @class LeaveTypeDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class LeaveTypeDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof LeaveTypeDbService
   */
  public tableDB = 'l_main_leavetype';
  /**
   *Creates an instance of LeaveTypeDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof LeaveTypeDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_main_leavetype") }
}

/**
 * DB table : l_calendar_profile
 *
 * @export
 * @class CalendarProfileDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class CalendarProfileDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof CalendarProfile
   */
  public tableDB = 'l_calendar_profile';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof CalendarProfile
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_calendar_profile") }
}

/**
 * DB table : l_calendar_profile_details
 *
 * @export
 * @class CalendarProfileDetailDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class CalendarProfileDetailDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof CalendarProfileDetailDbService
   */
  public tableDB = 'l_calendar_profile_details';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof CalendarProfileDetailDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_calendar_profile_details") }
}

/**
 * DB table : s_log_ticket
 *
 * @export
 * @class SupportTicketDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class SupportTicketDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof SupportTicketDbService
   */
  public tableDB = 's_log_ticket';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof SupportTicketDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "s_log_ticket") }
}

@Injectable()
export class SupportClarificationDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof SupportClarificationDbService
   */
  public tableDB = 's_clarification';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof SupportClarificationDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "s_clarification") }
}

@Injectable()
export class LoginLogDbService extends BaseDBService {
  /**
   * Declare table
   *
   * @memberof SupportClarificationDbService
   */
  public tableDB = 'l_login_log';
  /**
   *Creates an instance of UserDbService.
   * @param {HttpService} httpService http service
   * @param {QueryParserService} queryService query service
   * @memberof SupportClarificationDbService
   */
  constructor(public readonly httpService: HttpService, public readonly queryService: QueryParserService) { super(httpService, queryService, "l_login_log") }
}
