import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam, ApiOperation } from "@nestjs/swagger";
import { ReportService } from './report.service';
import { runGetServiceV2 } from '../../common/helper/basic-function.service';

@Controller('report')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) { };

  @Get('attendance/:startdate/:enddate/:userid')
  @ApiOperation({ title: 'Attendance report' })
  @ApiImplicitParam({ name: 'startdate', description: 'Start date', required: true })
  @ApiImplicitParam({ name: 'enddate', description: 'End date', required: true })
  @ApiImplicitParam({ name: 'userid', description: 'User id', required: true })
  getAttendanceReport(@Param() param, @Req() req, @Res() res) {
    runGetServiceV2([this.reportService.getReportListAttendance([param]), res]);
  }

  @Get('activity/:startdate/:enddate/:category/:input')
  @ApiOperation({ title: 'Activity report' })
  @ApiImplicitParam({ name: 'startdate', description: 'Start date', required: true })
  @ApiImplicitParam({ name: 'enddate', description: 'End date', required: true })
  @ApiImplicitParam({ name: 'category', description: 'Category', required: true, enum: ['project', 'contract', 'user'] })
  @ApiImplicitParam({ name: 'input', description: 'Input', required: true })
  getActivityReport(@Param() param, @Req() req, @Res() res) {
    runGetServiceV2([this.reportService.getActivityList([param]), res]);
  }


}