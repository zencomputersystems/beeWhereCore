// 20. to POST track login session
// Request:
// {
//   "userId": "561604d0-f98d-11ea-a922-075dec0319ed",
//     "loggedTimestamp": 1601622975, //in seconds format
//       "latitude": 2.9261295000000005,
//         "longitude": 101.6499236,
//           "address": "Cyberjaya, Selangor, Malaysia",
//             "deviceInfo": "Safari 13.0.3 on Apple iPhone (iOS 13.2.3)",
//               "devicePublicIp": "60.53.219.114"
// }

import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam, ApiOperation } from "@nestjs/swagger";
import { CreateLoginLogDTO } from "./dto/create-login-log.dto";
import { LoginLogService } from './login-log.service';
import { runCreateService, runGetServiceV2 } from '../../common/helper/basic-function.service';

// Response:
// {
//   "loginId": "xxxx"
// }

// 21. to get historical logged on session by user
// Request:
// {
//   "userId": "561604d0-f98d-11ea-a922-075dec0319ed",
// }

// Response:
// [
//   {
//     "loginId": "xxxx1",
//     "userId": "561604d0-f98d-11ea-a922-075dec0319ed",
//     "loginTimestamp": 1601622975, //in seconds format
//     "latitude": 2.9261295000000005,
//     "longitude": 101.6499236,
//     "address": "Cyberjaya, Selangor, Malaysia",
//     "deviceInfo": "Safari 13.0.3 on Apple iPhone (iOS 13.2.3)",
//     "devicePublicIp": "60.53.219.114"
//   },
//     .
//     .
//     .
// ]

@Controller('api/login-log')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) { }

  @Post()
  @ApiOperation({ title: 'Create login log' })
  createLoginLog(@Body() data: CreateLoginLogDTO, @Req() req, @Res() res) {
    runCreateService([this.loginLogService.createLoginLog([data]), res])
    //   .subscribe(
    //     data => {
    //       console.log(data);
    //       res.send(data);
    //     }, err => {
    //       res.send(err);
    //     }
    //   )
  }

  @Get(':id')
  @ApiOperation({ title: 'Get login log' })
  @ApiImplicitParam({ name: 'id', description: 'User id', required: true })
  getLoginLog(@Param() param, @Req() req, @Res() res) {
    runGetServiceV2([this.loginLogService.getLoginHistory([param.id]), res])
  }

}