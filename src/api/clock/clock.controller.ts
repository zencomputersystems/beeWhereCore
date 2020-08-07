import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { ClockService } from "./clock.service";
import { CreateClockDTO } from "./dto/create-clock.dto";
import { UpdateClockDTO } from "./dto/update-clock.dto";
import { ActivityClockDTO } from "./dto/activity-clock.dto";

@Controller('api/clock')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth()
export class ClockController {
  constructor(private readonly clockService: ClockService) { }

  @Post()
  @ApiOperation({ title: 'Clock in', description: 'Clock in user' })
  clockIn(@Body() createClockDTO: CreateClockDTO, @Res() res) {
    this.clockService.clockInProcess([createClockDTO]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err); }
    )
  }

  @Patch()
  @ApiOperation({ title: 'Clock out', description: 'Clock out user' })
  clockOut(@Body() updateClockDTO: UpdateClockDTO, @Res() res) {
    this.clockService.clockOutProcess([updateClockDTO]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err); }
    )
  }

  @Get(':clockId')
  @ApiOperation({ title: 'Get clock in info', description: 'Get clock in info' })
  @ApiImplicitParam({ name: 'clockId', description: 'Clock log guid', required: true })
  getClockIn(@Param('clockId') id, @Res() res) {
    this.clockService.getClockData([id]).subscribe(
      data => { res.send(data); },
      err => { res.send(err); }
    )
  }

  @Patch('activity')
  @ApiOperation({ title: 'Update actitivy', description: 'Update activity' })
  updateActivity(@Body() activityClockDTO: ActivityClockDTO, @Res() res) {
    this.clockService.updateActivityProgress([activityClockDTO]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err); }
    )
  }

  @Get('activity/:clockId')
  @ApiOperation({ title: 'Get activity info', description: 'Get activity info' })
  @ApiImplicitParam({ name: 'clockId', description: 'Clock log guid', required: true })
  getActivityByClockId(@Param('clockId') clockId, @Res() res) {
    this.clockService.getActivityProgress([clockId]).subscribe(
      data => { res.send(data); },
      err => { res.send(err); }
    )
  }

}