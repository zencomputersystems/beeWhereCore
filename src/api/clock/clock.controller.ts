import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { ClockService } from "./clock.service";
import { CreateClockDTO } from "./dto/create-clock.dto";
import { UpdateClockDTO } from "./dto/update-clock.dto";
import { ActivityClockDTO } from "./dto/activity-clock.dto";
import { runGetServiceV2, runCreateService, runUpdateService } from '../../common/helper/basic-function.service';

@Controller('api/clock')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ClockController {
  constructor(private readonly clockService: ClockService) { }

  @Post()
  @ApiOperation({ title: 'Clock in', description: 'Clock in user' })
  clockIn(@Body() createClockDTO: CreateClockDTO, @Res() res) {
    runCreateService([this.clockService.clockInProcess([createClockDTO]), res]);
  }

  @Patch()
  @ApiOperation({ title: 'Clock out', description: 'Clock out user' })
  clockOut(@Body() updateClockDTO: UpdateClockDTO, @Res() res) {
    runUpdateService([this.clockService.clockOutProcess([updateClockDTO]), res]);
  }

  @Get(':clockId')
  @ApiOperation({ title: 'Get clock in info', description: 'Get clock in info' })
  @ApiImplicitParam({ name: 'clockId', description: 'Clock log guid', required: true })
  getClockIn(@Param('clockId') id, @Res() res) {
    runGetServiceV2([this.clockService.getClockData([id]), res]);
  }

  @Patch('activity')
  @ApiOperation({ title: 'Update actitivy', description: 'Update activity' })
  updateActivity(@Body() activityClockDTO: ActivityClockDTO, @Res() res) {
    runUpdateService([this.clockService.updateActivityProgress([activityClockDTO]), res]);
  }

  @Get('activity/:clockId')
  @ApiOperation({ title: 'Get activity info', description: 'Get activity info' })
  @ApiImplicitParam({ name: 'clockId', description: 'Clock log guid', required: true })
  getActivityByClockId(@Param('clockId') clockId, @Res() res) {
    runGetServiceV2([this.clockService.getActivityProgress([clockId]), res]);
  }

  @Get('history/:type/:startdate/:enddate')
  @ApiOperation({ title: 'Get history clock', description: 'Get history clock' })
  @ApiImplicitParam({ name: 'type', description: 'Report type', required: true, enum: ['attendance', 'activity'] })
  @ApiImplicitParam({ name: 'startdate', description: 'Start date', required: true })
  @ApiImplicitParam({ name: 'enddate', description: 'End date', required: true })
  findHistory(@Param() params, @Req() req, @Res() res) {
    runGetServiceV2([this.clockService.getHistoryClock([req.user.USER_GUID, params]), res]);
  }

  @Get('history/list/:limit/:page')
  @ApiOperation({ title: 'Get history clock', description: 'Get history clock' })
  @ApiImplicitParam({ name: 'limit', description: 'Quantity limit', required: true })
  @ApiImplicitParam({ name: 'page', description: 'Offset page', required: true })
  findHistoryByLimit(@Param() params, @Req() req, @Res() res) {
    runGetServiceV2([this.clockService.getHistoryClockByLimit([req.user.USER_GUID, params]), res]);
  }

}