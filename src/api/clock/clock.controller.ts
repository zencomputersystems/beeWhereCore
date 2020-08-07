import { Controller, UseGuards, Post, Body, Req, Res, Patch } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ClockService } from "./clock.service";
import { CreateClockDTO } from "./dto/create-clock.dto";
import { UpdateClockDTO } from "./dto/update-clock.dto";

@Controller('api/clock')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ClockController {
  constructor(private readonly clockService: ClockService) { }

  @Post()
  @ApiOperation({ title: 'Clock in', description: 'Clock in user' })
  clockIn(@Body() createClockDTO: CreateClockDTO, @Req() req, @Res() res) {
    this.clockService.clockInProcess([createClockDTO]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err); }
    )
  }

  @Patch()
  @ApiOperation({ title: 'Clock in', description: 'Clock in user' })
  clockOut(@Body() updateClockDTO: UpdateClockDTO, @Req() req, @Res() res) {
    this.clockService.clockOutProcess([updateClockDTO]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err); }
    )
  }

}