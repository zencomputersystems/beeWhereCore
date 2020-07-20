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
