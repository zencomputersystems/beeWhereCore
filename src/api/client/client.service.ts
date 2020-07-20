import { Injectable } from "@nestjs/common";
import { ClientProfileModel } from '../../common/model/client-profile.model';
import { CreateClientDTO } from "./dto/create-client.dto";
import { UserMainModel } from '../../common/model/user-main.model';
import { Resource } from "../../common/model/resource.model";
import { v1 } from "uuid";
import { ClientProfileDbService } from '../../common/db/table.db.service';
import { UpdateClientDTO } from "./dto/update-client.dto";

@Injectable()
export class ClientService {

  constructor(private readonly clientProfileDbService: ClientProfileDbService) { }

  public createClient([ClientData, req]: [CreateClientDTO, UserMainModel]) {
    const data = new ClientProfileModel();

    data.PROFILE_GUID = v1();
    data.CLIENT_GUID = v1();
    this.inputDataClient([data, ClientData]);

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientProfileDbService.createByModel([resource, [], [], []]);
  }

  public updateClient([editClientData, req]: [UpdateClientDTO, UserMainModel]) {
    const data = new ClientProfileModel

    data.PROFILE_GUID = editClientData.id;
    this.inputDataClient([data, editClientData]);

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientProfileDbService.updateByModel([resource, [], [], []]);
  }

  public getClient() {
    return this.clientProfileDbService.findByFilterV4([[], [], null, null, null, [], null]);
  }

  public inputDataClient([model, data]: [ClientProfileModel, UpdateClientDTO | CreateClientDTO]) {

    model.NAME = data.name;
    model.ABBR = data.abbr;
    model.LATITUDE = data.latitude;
    model.LONGITUDE = data.longitude;

    return model;
  }
}