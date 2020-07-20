import { Injectable } from '@nestjs/common';
import { UsereLeaveDbService } from '../common/db/table.db.service';

/**
 * Service for user
 *
 * @export
 * @class UserService
 */
@Injectable()
export class UserService {

  /**
   *Creates an instance of UserService.
   * @param {UserDbService} userDbService DB service for user
   * @memberof UserService
   */
  constructor(public readonly usereLeaveDbService: UsereLeaveDbService) { }

  /**
   * Find one data by payload JWT
   *
   * @param {*} payload
   * @returns {Promise<any>}
   * @memberof UserService
   */
  public async findOneByPayload(payload): Promise<any> {
    // const fields = ['USER_GUID', 'LOGIN_ID', 'PASSWORD', 'EMAIL', 'FULLNAME', 'ROLE', 'ACTIVATION_FLAG'];
    // const filters = ['(EMAIL=' + payload.email + ')', '(USER_GUID=' + payload.userId + ')', '(LOGIN_ID=' + payload.loginId + ')']

    const fields = ['USER_GUID', 'EMAIL', 'TENANT_GUID'];
    const filters = ['(EMAIL=' + payload.email + ')', '(TENANT_GUID=' + payload.tenantId + ')']


    const url = this.usereLeaveDbService.queryService.generateDbQuery([this.usereLeaveDbService.tableDB, fields, filters]);
    return this.usereLeaveDbService.httpService.get(url).toPromise();
  }

}