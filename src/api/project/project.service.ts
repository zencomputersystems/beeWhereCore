import { Injectable } from "@nestjs/common";
import { ProjectProfileDbService } from "../../common/db/table.db.service";
import { CreateProjectDTO } from "./dto/create-project.dto";
import { UserMainModel } from "../../common/model/user-main.model";
import { ProjectProfileModel } from "../../common/model/project-profile.model";
import { v1 } from "uuid";
import { Resource } from "../../common/model/resource.model";
import { UpdateProjectDTO } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {

  constructor(private readonly projectProfileDbService: ProjectProfileDbService) { }

  public createProject([ProjectData, req]: [CreateProjectDTO, UserMainModel]) {
    const data = new ProjectProfileModel();

    data.PROJECT_GUID = v1();
    data.CLIENT_GUID = v1();
    this.inputDataProject([data, ProjectData]);

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.projectProfileDbService.createByModel([resource, [], [], []]);
  }

  public updateProject([editProjectData, req]: [UpdateProjectDTO, UserMainModel]) {
    const data = new ProjectProfileModel

    data.PROJECT_GUID = editProjectData.id;
    this.inputDataProject([data, editProjectData]);

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.projectProfileDbService.updateByModel([resource, [], [], []]);
  }

  public getProject() {
    return this.projectProfileDbService.findByFilterV4([[], [], null, null, null, [], null]);
  }

  public inputDataProject([model, data]: [ProjectProfileModel, UpdateProjectDTO | CreateProjectDTO]) {

    model.NAME = data.name;
    model.SOC_NO = data.soc_no;
    model.DESCRIPTION = data.description;

    return model;
  }

}