import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Data for attendance list
 *
 * @export
 * @class AttendanceListDTO
 */
export class AttendanceListDTO {

    /**
     * Data attendance list - attendance_profile_guid
     *
     * @type {string}
     * @memberof AttendanceListDTO
     */
    @ApiModelProperty({ description: 'Attendance profile guid', example: '7ed41000-98aa-11e9-b9d9-0901b57c06f4' })
    attendance_profile_guid: string;

    /**
     * Data attendance list - code
     *
     * @type {string}
     * @memberof AttendanceListDTO
     */
    @ApiModelProperty({ description: 'Code', example: 'Department Admin' })
    code: string;

    /**
     * Data attendance list - description
     *
     * @type {string}
     * @memberof AttendanceListDTO
     */
    @ApiModelProperty({ description: 'Description', example: 'Department admin for all staff' })
    description: string;

    /**
     * Data attendance list - total_employee_attach
     *
     * @type {string}
     * @memberof AttendanceListDTO
     */
    @ApiModelProperty({ description: 'Total employee attach', example: '1' })
    total_employee_attach: string;

}