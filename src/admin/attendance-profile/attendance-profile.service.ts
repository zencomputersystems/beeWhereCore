import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { v1 } from 'uuid';

import { AttendanceDTO } from './dto/attendance.dto';
import { AttendanceListDTO } from './dto/attendance-list.dto';
import { UpdateAttendanceDTO } from './dto/update-attendance.dto';
import { UpdateUserAttendanceDTO } from './dto/update-userattendance.dto';

import { UpdateUserAttendanceModel } from './model/update-attendance.model';

import { Resource } from '../../common/model/resource.model';
import { AttendanceProfileModel } from '../../common/model/attendance-profile.model';

import { AttendanceProfileDbService, UserprofileDbService, UserinfoDbService } from '../../common/db/table.db.service';
import { AssignerDataService } from '../../common/helper/assigner-data.service';
import { findAllData } from '../../common/helper/basic-function.service';

/** XMLparser from zen library  */
var { convertXMLToJson, convertJsonToXML } = require('@zencloudservices/xmlparser');

/**
 * Service for attendance
 *
 * @export
 * @class AttendanceProfileService
 */
@Injectable()
export class AttendanceProfileService {
	/**
	 *Creates an instance of AttendanceProfileService.
	 * @param {AttendanceProfileDbService} attendanceProfileDbService
	 * @param {AssignerDataService} assignerDataService
	 * @param {UserinfoDbService} userinfoDbService
	 * @param {UserprofileDbService} userprofileDbService
	 * @memberof AttendanceProfileService
	 */
	constructor(
		private readonly attendanceProfileDbService: AttendanceProfileDbService,
		private readonly assignerDataService: AssignerDataService,
		private readonly userinfoDbService: UserinfoDbService,
		private readonly userprofileDbService: UserprofileDbService
	) { }

	/**
	 * Get attendance profile function
	 *
	 * @param {*} user
	 * @returns
	 * @memberof AttendanceProfileService
	 */
	public getAttendanceProfileList(user: any) {
		let url = this.attendanceProfileDbService.queryService.generateDbQueryV2(['l_view_attendance_profile', ['ATTENDANCE_GUID', 'CODE', 'DESCRIPTION', 'TOTAL_EMPLOYEE_ATTACH'], ['(TENANT_GUID=' + user.TENANT_GUID + ')'], []]);
		return this.assignerDataService.processProfile([url, this.attendanceProfileDbService, AttendanceListDTO]);
	}

	/**
	 * Get employee attach to attendance
	 *
	 * @param {[string, string]} [attendanceId, tenant_guid]
	 * @returns
	 * @memberof AttendanceProfileService
	 */
	public getEmployeeAttendanceAttach([attendanceId, tenant_guid]: [string, string]) {
		const filters = ['(ATTENDANCE_GUID=' + attendanceId + ')', 'AND (TENANT_GUID=' + tenant_guid + ')', 'AND (DELETED_AT IS NULL)'];
		const fields = ['USER_GUID', 'FULLNAME', 'PERSONAL_ID_TYPE'];

		const url = this.attendanceProfileDbService.queryService.generateDbQueryV3([this.userprofileDbService.tableDB, fields, filters, null, null, null, [], null]);

		return this.assignerDataService.processProfile([url, this.attendanceProfileDbService, AttendanceListDTO]);
	}

	/**
	 * Function to get attendance detail from attendance id function
	 *
	 * @param {string} attendanceId
	 * @returns
	 * @memberof AttendanceProfileService
	 */
	public getAttendanceDetail(attendanceId: string) {
		return this.findAll(attendanceId).pipe(map(res => {
			if (res.status == 200) { return convertXMLToJson(res.data.resource[0].PROPERTIES_XML); }
		}))
	}

	/**
	 * Method to create new attendance profile
	 *
	 * @param {[any, AttendanceDTO]} [user, data]
	 * @returns
	 * @memberof AttendanceProfileService
	 */
	create([user, data]: [any, AttendanceDTO]) {

		const resource = new Resource(new Array);
		const modelData = new AttendanceProfileModel();

		modelData.CODE = data.code;
		modelData.ATTENDANCE_GUID = v1();
		modelData.TENANT_GUID = user.TENANT_GUID;
		modelData.CREATION_TS = new Date().toISOString();
		modelData.CREATION_USER_GUID = user.USER_GUID;
		modelData.PROPERTIES_XML = convertJsonToXML(data);
		modelData.UPDATE_TS = null;
		modelData.UPDATE_USER_GUID = null;
		modelData.DESCRIPTION = data.description;

		resource.resource.push(modelData);

		return this.attendanceProfileDbService.createByModel([resource, [], [], []]);
	}

	/**
	 * Method to update existing attendance profile
	 *
	 * @param {[any, UpdateAttendanceDTO]} [user, d]
	 * @returns
	 * @memberof AttendanceProfileService
	 */
	updateAttendance([user, d]: [any, UpdateAttendanceDTO]) {
		const resource = new Resource(new Array);
		const data = new AttendanceProfileModel();

		data.PROPERTIES_XML = convertJsonToXML(d.data);
		data.CODE = d.data.code;
		data.UPDATE_TS = new Date().toISOString();
		data.UPDATE_USER_GUID = user.USER_GUID;
		data.DESCRIPTION = d.data.description;

		resource.resource.push(data);

		return this.attendanceProfileDbService.updateByModel([resource, [], ['(ATTENDANCE_GUID=' + d.attendance_profile_guid + ')'], ['ATTENDANCE_GUID', 'CODE', 'PROPERTIES_XML']]);
	}

	/**
	 * Method to assign attendance to employee
	 *
	 * @param {[any, UpdateUserAttendanceDTO]} [user, d]
	 * @returns
	 * @memberof AttendanceProfileService
	 */
	updateToEmployee([user, d]: [any, UpdateUserAttendanceDTO]) {
		const resource = new Resource(new Array);
		const data = new UpdateUserAttendanceModel;

		data.ATTENDANCE_GUID = d.attendance_guid;
		data.UPDATE_TS = new Date().toISOString();
		data.UPDATE_USER_GUID = user.USER_GUID;

		let userList = this.assignerDataService.setBundleUserGuid(d);

		resource.resource.push(data);

		return this.userinfoDbService.updateByModel([resource, [], ['(USER_GUID IN (' + userList + '))'], []]);
	}

	/**
	 * Verify if attendance profile have user attach
	 *
	 * @param {[any, string]} [user, attendanceId]
	 * @returns
	 * @memberof AttendanceProfileService
	 */
	deleteAttendance([user, attendanceId]: [any, string]) {
		const filters = ['(ATTENDANCE_GUID=' + attendanceId + ')', 'AND (TENANT_GUID=' + user.TENANT_GUID + ')', 'AND (DELETED_AT IS NULL)'];
		return this.findEmployeeAndDelete([filters, this.deleteProcessAttendance([user, attendanceId])]);
	}

	/**
	 * Delete attendance profile: update deleted_at field
	 *
	 * @param {[any, string]} [user, attendanceId]
	 * @returns
	 * @memberof AttendanceProfileService
	 */
	deleteProcessAttendance([user, attendanceId]: [any, string]) {
		const resource = new Resource(new Array);
		const data = new AttendanceProfileModel();

		data.UPDATE_TS = new Date().toISOString();
		data.UPDATE_USER_GUID = user.USER_GUID;
		data.DELETED_AT = new Date().toISOString();

		resource.resource.push(data);

		return this.attendanceProfileDbService.updateByModel([resource, [], ['(ATTENDANCE_GUID=' + attendanceId + ')'], ['ATTENDANCE_GUID', 'CODE']]);
	}

	/**
	 * Method find all attendance detail
	 *
	 * @param {string} attendanceId
	 * @returns {Observable<any>}
	 * @memberof AttendanceProfileService
	 */
	public findAll(attendanceId: string): Observable<any> {

		const fields = ['PROPERTIES_XML'];
		const filters = ['(ATTENDANCE_GUID=' + attendanceId + ')'];

		return findAllData([fields, filters, this.attendanceProfileDbService.queryService, this.attendanceProfileDbService.httpService, this.attendanceProfileDbService.tableName]);
	}

	/**
	 * Find employee and delete if no one attached
	 *
	 * @param {[string[], any]} [filters, method]
	 * @returns {Observable<any>}
	 * @memberof AttendanceProfileService
	 */
	public findEmployeeAndDelete([filters, method]: [string[], any]): Observable<any> {
		return this.findEmployeeAssign([filters]).pipe(
			mergeMap(res => {
				if (res.data.resource.length > 0) {
					// will return user attach to this profile
					return of(res);
				} else {
					// will show deleted profile
					let deletedData = method;
					return deletedData;
				}
			}),
		);
	}

	/**
	 * Returns data user attach
	 *
	 * @param {[string[]]} [filters]
	 * @returns {Observable<any>}
	 * @memberof AttendanceProfileService
	 */
	public findEmployeeAssign([filters]: [string[]]): Observable<any> {

		const fields = ['USER_GUID', 'FULLNAME', 'PERSONAL_ID_TYPE'];
		let d = this.userprofileDbService.tableDB;
		const url = this.userprofileDbService.queryService.generateDbQueryV3([this.userprofileDbService.tableDB, fields, filters, null, null, null, [], null]);
		//call DF to validate the user
		return this.userprofileDbService.httpService.get(url);

	}

}