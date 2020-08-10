import { Controller, UseGuards, Get, Param, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { UserInfoService } from './user-info.service';

@Controller('api/user-info')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth()
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) { }

  @Get(':userId')
  @ApiOperation({ title: 'Get user profile setting', description: 'Get user profile setting details' })
  @ApiImplicitParam({ name: 'userId', description: 'User guid', required: true })
  findUserInfo(@Param('userId') userId, @Res() res) {
    this.userInfoService.getUserInfo([userId]).subscribe(
      data => { res.send(data); },
      err => { res.send(err); }
    )
  }
}