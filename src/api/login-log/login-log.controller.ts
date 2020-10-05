import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam, ApiOperation } from "@nestjs/swagger";
import { CreateLoginLogDTO } from "./dto/create-login-log.dto";
import { LoginLogService } from './login-log.service';
import { runCreateService, runGetServiceV2, runUpdateService } from '../../common/helper/basic-function.service';
import { UpdateLoginLogActivityDTO } from './dto/activity-log.dto';


@Controller('api/login-log')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) { }

  @Post()
  @ApiOperation({ title: 'Create login log' })
  createLoginLog(@Body() data: CreateLoginLogDTO, @Req() req, @Res() res) {
    runCreateService([this.loginLogService.createLoginLog([data]), res])
  }

  @Get(':id')
  @ApiOperation({ title: 'Get login log' })
  @ApiImplicitParam({ name: 'id', description: 'User id', required: true })
  getLoginLog(@Param() param, @Req() req, @Res() res) {
    runGetServiceV2([this.loginLogService.getLoginHistory([param.id]), res])
  }

  @Patch()
  @ApiOperation({ title: 'Log activity based on login' })
  loginLogActivity(@Body() activityLogDto: UpdateLoginLogActivityDTO, @Req() req, @Res() res) {
    runUpdateService([this.loginLogService.updateLoginLogActivity([activityLogDto]), res]);
  }

}