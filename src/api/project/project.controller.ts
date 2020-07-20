import { Controller, Post, Res, Patch, Get, UseGuards, Req, Body } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ProjectService } from './project.service';
import { AuthGuard } from "@nestjs/passport";
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from "./dto/update-project.dto";

@Controller('api/project')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }
  @Post()
  @ApiOperation({ title: 'Create project', description: 'Create project' })
  createProject(@Body() createProjectData: CreateProjectDTO, @Req() req, @Res() res) {
    this.projectService.createProject([createProjectData, req]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Patch()
  @ApiOperation({ title: 'Update project', description: 'Update project' })
  updateProject(@Body() updateProjectData: UpdateProjectDTO, @Req() req, @Res() res) {
    this.projectService.updateProject([updateProjectData, req]).subscribe(
      data => { res.send(data.data.resource); },
      err => { res.send(err) }
    )
  }

  @Get()
  @ApiOperation({ title: 'Get project', description: 'Get project' })
  findProject(@Res() res) {
    this.projectService.getProject().subscribe(
      data => { res.send(data); },
      err => { res.send(err) }
    )
  }

}