import { HttpModule, HttpStatus, BadRequestException, HttpService } from '@nestjs/common';
import { DreamFactory } from "../../config/dreamfactory";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { QueryParserService } from './query-parser.service';

//  ---------------------------------------------------------------------------------------------------------------------------------------------------


/**
 * Declare base module http
 */
const baseModule = HttpModule.register({ headers: { 'Content-Type': 'application/json', 'X-Dreamfactory-API-Key': DreamFactory.df_key } });
/**
 * Return http base module
 *
 * @export
 * @returns
 */
export function getModuleHttp() {
  return baseModule;
}

// From common function service

/**
     * general create function
     *
     * @param {*} method
     * @param {*} res
     * @memberof CommonFunctionService
     */
export function runCreateService(method, res) {
  this.getResults([method, res, 'Fail to create resource']);
}

/**
 * general update function
 *
 * @param {*} method
 * @param {*} res
 * @memberof CommonFunctionService
 */
export function runUpdateService(method, res) {
  this.getResults([method, res, 'Fail to update resource']);
}

/**
 * calendar profile n role profile list
 *
 * @param {*} method
 * @param {*} res
 * @memberof CommonFunctionService
 */
export function runGetServiceV2(method, res) {
  method.subscribe(
    data => { res.send(data); },
    err => { this.sendResError('Fail to fetch resource', res); }
  );
}

/**
 * Get result method refactor
 *
 * @param {*} method
 * @param {*} res
 * @param {*} message
 * @memberof CommonFunctionService
 */
export function getResults([method, res, message]) {
  method.subscribe(
    data => {
      if (data.status === 200) {
        res.send(data.data.resource);
      } else {
        res.status(data.status);
        res.send();
      }
    },
    err => {
      const response: { status: string } = { status: message };
      this.sendResError(response, res);
    }
  );
}




/**
 * failed response with code 400
 *
 * @param {*} message
 * @param {*} res
 * @memberof CommonFunctionService
 */
export function sendResError(message, res) {
  res.status(400);
  res.send(message);
}

/**
 * Failed response with custom code
 *
 * @param {*} res
 * @param {*} code
 * @param {*} msg
 * @memberof CommonFunctionService
 */
export function sendResErrorV2(res, code, msg) { //sendErrorV2
  res.status(code);
  res.send(msg);
}

/**
 * Failed response with checking response data
 *
 * @param {*} err
 * @param {*} res
 * @memberof CommonFunctionService
 */
export function sendResErrorV3(err, res) { //sendError
  // if (err.response.data) {
  //     res.status(err.response.data.error.status_code);
  //     res.send(err.response.data.error.message)
  // } else {
  //     res.status(500);
  //     res.send(err);
  // }

  res.status(HttpStatus.BAD_REQUEST).send(new BadRequestException('Input missing'));
}




/**
 * Get list data
 *
 * @param {*} method
 * @returns
 * @memberof CommonFunctionService
 */
export function getListData(method) {
  return method.pipe(map(res => {
    return this.getResData(res);
  }))
}

/**
 * Get resource data
 *
 * @param {*} res
 * @returns
 * @memberof CommonFunctionService
 */
export function getResData(res) {
  if (res.status == 200) {
    return res.data.resource;
  }
}

/**
 * find all list refactor
 *
 * @param {*} fields
 * @param {*} tenantId
 * @param {*} queryService
 * @param {*} httpService
 * @param {*} tableName
 * @returns {Observable<any>}
 * @memberof CommonFunctionService
 */
export function findAllList(data): Observable<any> {
  let fields = data[0];
  let tenantId = data[1];
  let queryService = data[2];
  let httpService = data[3];
  let tableName = data[4];

  // const fields = ['BRANCH'];
  let filters = ['(TENANT_GUID=' + tenantId + ')'];

  if (tableName === 'tenant_company') { filters = ['(DELETED_AT IS NULL)'] }

  //url
  const url = queryService.generateDbQueryV2(tableName, fields, filters, []);

  //call DF to validate the user
  return httpService.get(url);

}

/**
 * Refactor to get all data
 *
 * @param {*} [fields, filters, queryService, httpService, tableName]
 * @returns
 * @memberof CommonFunctionService
 */
export function findAllData([fields, filters, queryService, httpService, tableName]: [any, any, QueryParserService, HttpService, string]) {
  const url = queryService.generateDbQueryV2([tableName, fields, filters, []]);
  return httpService.get(url);
}

  // End common function