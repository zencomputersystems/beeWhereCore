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
 * DB table : user main tenant : user_main
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
 * DB table : user main tenant : a_clock_log
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
 * DB table : user main tenant : user_main
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
 * DB table : user main tenant : user_main
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