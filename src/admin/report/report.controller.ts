import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam, ApiOperation } from "@nestjs/swagger";
import { ReportService } from './report.service';
import { runGetServiceV2 } from '../../common/helper/basic-function.service';
import { ReportAttendanceDTO } from "./dto/report-attendance.dto";

@Controller('report')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) { };

  @Post('attendance')
  @ApiOperation({ title: 'Attendance report' })
  // @ApiImplicitParam({ name: 'startdate', description: 'Start date e.g: 2020-10-20', required: true })
  // @ApiImplicitParam({ name: 'enddate', description: 'End date e.g: 2020-11-20', required: true })
  // @ApiImplicitParam({ name: 'userid', description: 'User id', required: true })
  // getAttendanceReport(@Body() reportAttendanceDTO: ReportAttendanceDTO, @Param() param, @Req() req, @Res() res) {
  getAttendanceReport(@Body() reportAttendanceDTO: ReportAttendanceDTO, @Req() req, @Res() res) {
    // runGetServiceV2([this.reportService.getReportListAttendance([param, req.user]), res]);
    runGetServiceV2([this.reportService.getReportListAttendance([reportAttendanceDTO, req.user]), res]);
  }

  @Get('activity/:startdate/:enddate/:category/:input')
  @ApiOperation({ title: 'Activity report' })
  @ApiImplicitParam({ name: 'startdate', description: 'Start date e.g 2020-10-20', required: true })
  @ApiImplicitParam({ name: 'enddate', description: 'End date e.g 2020-11-20', required: true })
  @ApiImplicitParam({ name: 'category', description: 'Category', required: true, enum: ['project', 'contract', 'user'] })
  @ApiImplicitParam({ name: 'input', description: 'Input', required: true })
  getActivityReport(@Param() param, @Req() req, @Res() res) {
    runGetServiceV2([this.reportService.getActivityList([param, req.user]), res]);
  }


}