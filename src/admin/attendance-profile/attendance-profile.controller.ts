import { Controller, UseGuards, Post, Req, Res, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { map } from "rxjs/operators";

import { AttendanceProfileService } from "./attendance-profile.service";

import { AttendanceDTO } from "./dto/attendance.dto";
import { UpdateAttendanceDTO } from "./dto/update-attendance.dto";
import { UpdateUserAttendanceDTO } from "./dto/update-userattendance.dto";

import { runCreateService, runGetServiceV2, runUpdateService } from "../../common/helper/basic-function.service";

var { convertXMLToJson } = require('@zencloudservices/xmlparser');

/**
 * Controller for attendance
 *
 * @export
 * @class AttendanceProfileController
 */
@Controller('/api/admin/attendance')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AttendanceProfileController {

	/**
	 *Creates an instance of AttendanceProfileController.
	 * @param {AttendanceProfileService} attendanceProfileService attendance profile service
	 * @memberof AttendanceProfileController
	 */
	constructor(private readonly attendanceProfileService: AttendanceProfileService) { }

	/**
	 * Method get attendance profile list
	 *
	 * @param {*} req
	 * @param {*} res
	 * @memberof AttendanceProfileController
	 */
	@Get('attendance-profile')
	@ApiOperation({ title: 'Get attendance profile list' })
	findAllAttendance(@Req() req, @Res() res) {
		runGetServiceV2(this.attendanceProfileService.getAttendanceProfileList(req.user), res);
	}

	/**
	 * Method setup new attendance
	 *
	 * @param {AttendanceDTO} attendanceSetupDTO
	 * @param {*} req
	 * @param {*} res
	 * @memberof AttendanceProfileController
	 */
	@Post('attendance-profile')
	@ApiOperation({ title: 'Setup new attendance profile' })
	create(@Body() attendanceSetupDTO: AttendanceDTO, @Req() req, @Res() res) {
		runCreateService(this.attendanceProfileService.create([req.user, attendanceSetupDTO]), res);
	}

	/**
	 * Method update attendance profile
	 *
	 * @param {UpdateAttendanceDTO} updateAttendanceDTO
	 * @param {*} req
	 * @param {*} res
	 * @memberof AttendanceProfileController
	 */
	@Patch('attendance-profile')
	@ApiOperation({ title: 'Edit attendance profile' })
	update(@Body() updateAttendanceDTO: UpdateAttendanceDTO, @Req() req, @Res() res) {
		this.attendanceProfileService.updateAttendance([req.user, updateAttendanceDTO]).pipe(
			map(res => {
				const data = res.data.resource[0];
				let resultFormat = new UpdateAttendanceDTO();
				resultFormat.attendance_profile_guid = data.ATTENDANCE_GUID;
				resultFormat.data = convertXMLToJson(data.PROPERTIES_XML);
				return resultFormat;
			})
		).subscribe(
			data => {
				res.status(200);
				res.send(data);
			},
			err => {
				const response: { status: string } = { status: 'Fail to update resource' };
				res.status(400);
				res.send(response);
			}
		);
	}

	/**
	 * Delete attendance
	 *
	 * @param {*} id
	 * @param {*} req
	 * @param {*} res
	 * @memberof AttendanceProfileController
	 */
	@Delete('attendance-profile/:id')
	@ApiOperation({ title: 'Delete attendance profile' })
	@ApiImplicitParam({ name: 'id', description: 'Delete by ATTENDANCE_GUID', required: true })
	deleteAttendanceProfile(@Param('id') id, @Req() req, @Res() res) {
		runUpdateService(this.attendanceProfileService.deleteAttendance([req.user, id]), res);
	}

	/**
	 * Get employee attach to attendance profile
	 *
	 * @param {*} id
	 * @param {*} req
	 * @param {*} res
	 * @memberof AttendanceProfileController
	 */
	@Get('attendance-profile/users/:id')
	@ApiOperation({ title: 'Get employee list by attendance profile' })
	@ApiImplicitParam({ name: 'id', description: 'Filter by ATTENDANCE_GUID', required: true })
	findEmployeeAttendanceProfile(@Param('id') id, @Req() req, @Res() res) {
		runGetServiceV2(this.attendanceProfileService.getEmployeeAttendanceAttach([id, req.user.TENANT_GUID]), res);
	}

	/**
	 * Get attendance detail by attendance profile guid
	 *
	 * @param {*} id
	 * @param {*} res
	 * @memberof AttendanceProfileController
	 */
	@Get(':id')
	@ApiOperation({ title: 'Get attendance detail by attendance profile guid' })
	@ApiImplicitParam({ name: 'id', description: 'Filter by ATTENDANCE_GUID', required: true })
	findOne(@Param('id') id, @Res() res) {
		runGetServiceV2(this.attendanceProfileService.getAttendanceDetail(id), res);
	}

	/**
	 * Assign attendance profile to employee
	 * Pending : Need to update just only one latest
	 *
	 * @param {UpdateUserAttendanceDTO} updateUserAttendanceDTO
	 * @param {*} req
	 * @param {*} res
	 * @memberof AttendanceProfileController
	 */
	@Patch('user-attendance')
	@ApiOperation({ title: 'Assign attendance profile to employee' })
	updateToEmployee(@Body() updateUserAttendanceDTO: UpdateUserAttendanceDTO, @Req() req, @Res() res) {
		runUpdateService(this.attendanceProfileService.updateToEmployee([req.user, updateUserAttendanceDTO]), res);
	}

}