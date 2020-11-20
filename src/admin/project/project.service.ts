import { Injectable } from "@nestjs/common";
import { of } from "rxjs";
import { CreateProjectDTO } from './dto/create-project.dto';
import { ClientProjectDbService } from '../../common/db/table.db.service';
import { ClientProjectModel } from '../../common/model/client-project.model';
import { v1 } from "uuid";
import { Resource } from "../../common/model/resource.model";
import { UpdateProjectDTO } from "./dto/update-project.dto";
import { map } from "rxjs/operators";

@Injectable()
export class ProjectService {
  constructor(private readonly clientProjectDbService: ClientProjectDbService) { }
  public getAllProject([req]: [any]) {
    return this.clientProjectDbService.findByFilterV4([[], [], null, null, null, ['CLIENT_DATA'], null]).pipe(
      map(res => {
        res = res.filter(x => x.CLIENT_DATA.TENANT_GUID === req.user.TENANT_GUID);
        return res;
      })
    )
    // return of(data);
  }

  public getOneProject([clientId]: [string]) {
    return this.clientProjectDbService.findByFilterV4([[], [`(CLIENT_GUID=${clientId})`], null, null, null, [], null])
    // return of(data);
  }

  public createProject([createProjectDTO]: [CreateProjectDTO]) {

    const dataProject = new ClientProjectModel

    dataProject.PROJECT_GUID = v1();
    this.inputDataProject([dataProject, createProjectDTO]);

    const resource = new Resource(new Array);
    resource.resource.push(dataProject);

    return this.clientProjectDbService.createByModel([resource, [], [], []])
  }

  public updateProject([updateProjectDTO]: [UpdateProjectDTO]) {
    const data = new ClientProjectModel
    data.PROJECT_GUID = updateProjectDTO.projectId;
    this.inputDataProject([data, updateProjectDTO]);

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientProjectDbService.updateByModel([resource, [], [], []]);
    // return of(data);
  }

  public deleteProject([projectId]: [string]) {
    const data = new ClientProjectModel
    data.PROJECT_GUID = projectId;
    data.STATUS = 0;

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientProjectDbService.updateByModel([resource, [], [], []]);
  }

  public inputDataProject([model, data]: [ClientProjectModel, CreateProjectDTO]) {
    model.CLIENT_GUID = data.clientId;
    model.NAME = data.name;
    model.SOC_NO = data.socNo;
    model.DESCRIPTION = data.description;
    model.STATUS = 1;

    return model
  }
}