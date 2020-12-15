import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { ProjectService } from "./project.service";
import { CreateProjectDTO } from "./dto/create-project.dto";
import { UpdateProjectDTO } from "./dto/update-project.dto";
import { runGetServiceV2, runCreateService, runUpdateService } from '../../common/helper/basic-function.service';

@Controller('api/project')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }
  @Post()
  @ApiOperation({ title: 'Add project to client', description: 'Add project to client' })
  createProject(@Body() createProjectData: CreateProjectDTO, @Req() req, @Res() res) {
    runCreateService([this.projectService.createProject([createProjectData, req.user]), res]);
  }

  @Patch()
  @ApiOperation({ title: 'Update client project', description: 'Update client project' })
  updateProject(@Body() updateProjectData: UpdateProjectDTO, @Req() req, @Res() res) {
    runUpdateService([this.projectService.updateProject([updateProjectData, req.user]), res]);
  }

  @Get()
  @ApiOperation({ title: 'Get all project', description: 'Get all project' })
  getAllProject(@Req() req, @Res() res) {
    runGetServiceV2([this.projectService.getAllProject([req]), res]);
  }

  @Get(':clientid')
  @ApiOperation({ title: 'Get client project', description: 'Get client project' })
  @ApiImplicitParam({ name: 'clientid' })
  createClient(@Param('clientid') clientId, @Req() req, @Res() res) {
    runGetServiceV2([this.projectService.getOneProject([clientId]), res]);
  }

}