import { Controller, UseGuards, Post, Body, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { SupportService } from './support.service';
import { CreateSupportDTO } from "./dto/create-support.dto";
import { runCreateService } from '../../common/helper/basic-function.service';

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
}