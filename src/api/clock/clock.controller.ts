import { Controller, UseGuards, Post, Body, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ClockService } from "./clock.service";
import { CreateClockDTO } from "./dto/create-clock.dto";

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
}