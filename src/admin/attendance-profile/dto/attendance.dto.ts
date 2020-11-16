import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Autoclockout filter details
 *
 * @export
 * @class AutoClockoutDTO
 */
export class AutoClockoutDTO {
    /**
     * Value enable setting
     *
     * @type {boolean}
     * @memberof AutoClockoutDTO
     */
    @ApiModelProperty({ description: 'Values enable', example: false })
    @IsBoolean()
    value: boolean;

    /**
     * Range in meter
     *
     * @type {number}
     * @memberof AutoClockoutDTO
     */
    @ApiModelProperty({ description: 'Range in meter', enum: [500, 1000, 1500, 2000] })
    @IsNumber()
    range: number;
}

/**
 * Properties data details
 *
 * @export
 * @class PropertiesDetailDTO
 */
export class PropertiesDetailDTO {
    /**
     * Values enabled setting
     *
     * @type {boolean}
     * @memberof PropertiesDetailDTO
     */
    @ApiModelProperty({ description: 'Values enable', example: true })
    @IsBoolean()
    value: boolean;
    /**
     * Client list setting
     *
     * @type {boolean}
     * @memberof PropertiesDetailDTO
     */
    @ApiModelProperty({ description: 'Client list', example: true })
    @IsBoolean()
    client_list: boolean;
    /**
     * Project selection setting
     *
     * @type {boolean}
     * @memberof PropertiesDetailDTO
     */
    @ApiModelProperty({ description: 'Project selection', example: true })
    @IsBoolean()
    project_selection: boolean;
    /**
     * Contract selection setting
     *
     * @type {boolean}
     * @memberof PropertiesDetailDTO
     */
    @ApiModelProperty({ description: 'Contract selection', example: true })
    @IsBoolean()
    contract_selection: boolean;
    /**
     * Activity list setting
     *
     * @type {boolean}
     * @memberof PropertiesDetailDTO
     */
    @ApiModelProperty({ description: 'Activity list', example: true })
    @IsBoolean()
    activity_list: boolean;
    /**
     * Geofence filter setting
     *
     * @type {boolean}
     * @memberof PropertiesDetailDTO
     */
    @ApiModelProperty({ description: 'Geofence filter', example: true })
    @IsBoolean()
    geofence_filter: boolean;

    /**
     * Autoclockout filter
     *
     * @type {AutoClockoutDTO}
     * @memberof PropertiesDetailDTO
     */
    @ApiModelProperty({ description: 'Autoclock filter', type: AutoClockoutDTO })
    @IsNotEmpty()
    @Type(() => AutoClockoutDTO)
    autoclockout_filter: AutoClockoutDTO;

    /**
     * Clock location
     *
     * @type {boolean}
     * @memberof PropertiesDetailDTO
     */
    @ApiModelProperty({ description: 'Clock location', example: true })
    @IsBoolean()
    clockLocation: boolean;
}

/**
 * Data attendance properties
 *
 * @export
 * @class AttendancePropertiesDTO
 */
export class AttendancePropertiesDTO {
    /**
     * Office setting
     *
     * @type {PropertiesDetailDTO}
     * @memberof AttendancePropertiesDTO
     */
    @ApiModelProperty({ description: 'Office', type: PropertiesDetailDTO })
    @IsNotEmpty()
    @Type(() => PropertiesDetailDTO)
    office: PropertiesDetailDTO;
    /**
     * Site setting
     *
     * @type {PropertiesDetailDTO}
     * @memberof AttendancePropertiesDTO
     */
    @ApiModelProperty({ description: 'Site', type: PropertiesDetailDTO })
    @IsNotEmpty()
    @Type(() => PropertiesDetailDTO)
    site: PropertiesDetailDTO;
    /**
     * Home setting
     *
     * @type {PropertiesDetailDTO}
     * @memberof AttendancePropertiesDTO
     */
    @ApiModelProperty({ description: 'Home', type: PropertiesDetailDTO })
    @IsNotEmpty()
    @Type(() => PropertiesDetailDTO)
    home: PropertiesDetailDTO;
    /**
     * Others setting
     *
     * @type {PropertiesDetailDTO}
     * @memberof AttendancePropertiesDTO
     */
    @ApiModelProperty({ description: 'Others', type: PropertiesDetailDTO })
    @IsNotEmpty()
    @Type(() => PropertiesDetailDTO)
    others: PropertiesDetailDTO;
}

/**
 * Data for Attendance
 *
 * @export
 * @class AttendanceDTO
 */
export class AttendanceDTO {
    /**
     * Data Attendance name
     *
     * @type {string}
     * @memberof AttendanceDTO
     */
    @ApiModelProperty({ description: 'Attendance code', example: 'Department Admin' })
    @IsString()
    code: string;
    /**
     * Data Attendance description
     *
     * @type {string}
     * @memberof AttendanceDTO
     */
    @ApiModelProperty({ description: 'Description for Attendance', example: 'Department Admin for all staff' })
    @IsString()
    description: string;
    /**
     * Data Attendance properties
     *
     * @type {AttendancePropertiesDTO}
     * @memberof AttendanceDTO
     */
    @ApiModelProperty({ description: 'Properties Attendance', type: AttendancePropertiesDTO })
    @IsNotEmpty()
    @Type(() => AttendancePropertiesDTO)
    property: AttendancePropertiesDTO;

}