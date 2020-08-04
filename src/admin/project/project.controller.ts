import { Controller, UseGuards, Post, Body, Req, Res, Patch, Get, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiImplicitParam } from "@nestjs/swagger";
import { ProjectService } from "./project.service";
import { CreateProjectDTO } from "./dto/create-project.dto";
import { UpdateProjectDTO } from "./dto/update-project.dto";

@Controller('api/project')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }
  @Post()
  @ApiOperation({ title: 'Add project to client', description: 'Add project to client' })
  createProject(@Body() createProjectData: CreateProjectDTO, @Req() req, @Res() res) {
    this.projectService.createProject([createProjectData]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Patch()
  @ApiOperation({ title: 'Update client project', description: 'Update client project' })
  updateProject(@Body() updateProjectData: UpdateProjectDTO, @Req() req, @Res() res) {
    this.projectService.updateProject([updateProjectData]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Get()
  @ApiOperation({ title: 'Get all project', description: 'Get all project' })
  getAllProject(@Req() req, @Res() res) {
    this.projectService.getAllProject([req]).subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

  @Get(':clientid')
  @ApiOperation({ title: 'Get client project', description: 'Get client project' })
  @ApiImplicitParam({ name: 'clientid' })
  createClient(@Param('clientid') clientId, @Req() req, @Res() res) {
    this.projectService.getOneProject([clientId]).subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

}