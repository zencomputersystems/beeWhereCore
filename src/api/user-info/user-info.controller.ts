import { Controller, UseGuards, Get, Param, Res, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { UserInfoService } from './user-info.service';
import { runGetServiceV2 } from '../../common/helper/basic-function.service';

@Controller('api/user-info')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) { }

  @Get()
  @ApiOperation({ title: 'Get user profile setting', description: 'Get user profile setting details' })
  findUserInfo(@Req() req, @Res() res) {
    runGetServiceV2([this.userInfoService.getUserInfo([req.user.USER_GUID]), res]);
  }
}