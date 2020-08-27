import { Controller, UseGuards, Post, Body, Req, Res, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { SupportService } from './support.service';
import { CreateSupportDTO } from "./dto/create-support.dto";
import { runCreateService, runGetServiceV2 } from '../../common/helper/basic-function.service';
import { CreateClarificationDTO } from './dto/create-clarification.dto';
import { CreateAdminClarificationDTO } from "./dto/create-admin-clarification.dto";

@Controller('support')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly supportService: SupportService) { }
  @Post()
  @ApiOperation({ title: 'Create support issue' })
  createSupportIssue(@Body() createSupportDTO: CreateSupportDTO, @Req() req, @Res() res) {
    runCreateService([this.supportService.createSupportIssue([createSupportDTO]), res]);
  }

  @Get()
  @ApiOperation({ title: 'Get support issue list' })
  getSupportIssue(@Res() res) {
    runGetServiceV2([this.supportService.getSupportIssue([null]), res]);
  }

  @Post('clarification')
  @ApiOperation({ title: 'Reply for clarification' })
  createClarification(@Body() createClarificationDTO: CreateClarificationDTO, @Res() res) {
    runCreateService([this.supportService.createClarification([createClarificationDTO]), res]);
  }

  @Post('admin/clarification')
  @ApiOperation({ title: 'Admin reply for clarification' })
  createAdminClarification(@Body() createAdminClarificationDTO: CreateAdminClarificationDTO, @Res() res) {
    runCreateService([this.supportService.createAdminClarification([createAdminClarificationDTO]), res]);
  }

  @Get(':supportId')
  @ApiOperation({ title: 'Get clarification list ' })
  @ApiImplicitParam({ name: 'supportId' })
  getClarificationList(@Param('supportId') supportId, @Res() res) {
    runGetServiceV2([this.supportService.getClarificationList([supportId]), res]);
  }
}