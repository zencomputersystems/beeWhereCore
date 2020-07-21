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
 * DB table : user main tenant : user_main
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
 * DB table : user main tenant : user_main
 *
 * @export
 * @class UsereLeaveDbService
 * @extends {BaseDBService}
 */
@Injectable()
export class ProjectProfileDbService extends BaseDBService {
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