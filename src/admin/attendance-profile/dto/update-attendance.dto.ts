import { AttendanceDTO } from './attendance.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Data update attendance
 *
 * @export
 * @class UpdateAttendanceDTO
 */
export class UpdateAttendanceDTO {
    /**
     * Data update attendance - attendance_guid
     *
     * @type {string}
     * @memberof UpdateAttendanceDTO
     */
    @ApiModelProperty({ description: 'Attendance profile guid', example: '7ed41000-98aa-11e9-b9d9-0901b57c06f4' })
    @IsString()
    @IsNotEmpty()
    attendance_profile_guid: string;

    /**
     * Data update attendance - data
     *
     * @type {AttendanceDTO}
     * @memberof UpdateAttendanceDTO
     */
    @ApiModelProperty({ description: 'Attendance details', type: AttendanceDTO })
    @IsNotEmpty()
    @Type(() => AttendanceDTO)
    data: AttendanceDTO;
}