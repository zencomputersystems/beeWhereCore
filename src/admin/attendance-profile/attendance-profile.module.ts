import { Module } from '@nestjs/common';
import { QueryParserService } from '../../common/helper/query-parser.service';
import { AssignerDataService } from '../../common/helper/assigner-data.service';
import { AttendanceProfileDbService, UserprofileDbService, UserinfoDbService } from '../../common/db/table.db.service';
import { getModuleHttp } from '../../common/helper/basic-function.service';
import { AttendanceProfileController } from './attendance-profile.controller';
import { AttendanceProfileService } from './attendance-profile.service';

/**
 * Module for Attendance
 *
 * @export
 * @class AttendanceModule
 */
@Module({
    imports: [
        getModuleHttp()
    ],
    providers: [
        QueryParserService,
        AssignerDataService,
        AttendanceProfileService,
        AttendanceProfileDbService,
        AssignerDataService,
        UserinfoDbService,
        UserprofileDbService
    ],
    controllers: [AttendanceProfileController]
})
export class AttendanceProfileModule { }