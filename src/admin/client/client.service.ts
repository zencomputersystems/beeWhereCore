import { Injectable } from "@nestjs/common";
import { ClientProfileModel } from '../../common/model/client-profile.model';
import { CreateClientDTO } from "./dto/create-client.dto";
import { UserMainModel } from '../../common/model/user-main.model';
import { Resource } from "../../common/model/resource.model";
import { v1 } from "uuid";
import { ClientProfileDbService, ClientLocationDbService, ClientContractDbService, ClientProjectDbService } from '../../common/db/table.db.service';
import { UpdateClientDTO } from "./dto/update-client.dto";
import { ClientLocationModel } from "../../common/model/client-location.model";
import { mergeMap } from "rxjs/operators";
import { ClientProjectModel } from "../../common/model/client-project.model";
import { ClientContractModel } from "../../common/model/client-contract.model";

@Injectable()
export class ClientService {

  constructor(
    private readonly clientProfileDbService: ClientProfileDbService,
    private readonly clientLocationDbService: ClientLocationDbService,
    private readonly clientContractDbService: ClientContractDbService,
    private readonly clientProjectDbService: ClientProjectDbService
  ) { }

  public createClient([clientData, req]: [CreateClientDTO, UserMainModel]) {
    const dataClient = new ClientProfileModel();

    dataClient.CLIENT_GUID = v1();
    const clientId = dataClient.CLIENT_GUID;
    this.inputDataClient([dataClient, clientData]);

    const resource = new Resource(new Array);
    resource.resource.push(dataClient);

    // let createClient = this.clientProfileDbService.createByModel([resource, [], [], []]);



    return this.clientProfileDbService.createByModel([resource, [], [], []]).pipe(
      mergeMap(res => {
        const dataLocation = new ClientLocationModel();

        const resource2 = new Resource(new Array);
        this.inputDataLocation([dataLocation, clientData, resource2, clientId]);

        return this.clientLocationDbService.createByModel([resource2, [], [], []]);
      }), mergeMap(res => {
        const dataProject = new ClientProjectModel();

        const resource3 = new Resource(new Array);
        this.inputDataProject([dataProject, clientData, resource3, clientId]);

        return this.clientProjectDbService.createByModel([resource3, [], [], []])
      }), mergeMap(res => {
        const dataContract = new ClientContractModel();

        const resource4 = new Resource(new Array);
        this.inputDataContract([dataContract, clientData, resource4, clientId]);

        return this.clientContractDbService.createByModel([resource4, [], [], []])
      })
    );
  }

  public updateClient([editClientData, req]: [UpdateClientDTO, UserMainModel]) {
    const data = new ClientProfileModel

    data.CLIENT_GUID = editClientData.id;
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

    return model;
  }

  public inputDataLocation([model, data, resource2, clientId]: [ClientLocationModel, CreateClientDTO, Resource, string]) {
    // const clientId = data.id;
    data.location.forEach(element => {
      model.LOCATION_GUID = v1();
      model.CLIENT_GUID = clientId;
      model.LATITUDE = element.lat;
      model.LONGITUDE = element.long;
      model.ADDRESS = element.address;

      resource2.resource.push(model);
    });

    return resource2;
  }

  public inputDataProject([model, data, resource3, clientId]: [ClientProjectModel, CreateClientDTO, Resource, string]) {
    // const clientId = data.id;
    data.project.forEach(element => {
      model.PROJECT_GUID = v1();
      model.CLIENT_GUID = clientId;
      model.NAME = element.name;
      model.SOC_NO = element.code;
      model.DESCRIPTION = element.description;

      resource3.resource.push(model);
    });

    return resource3;
  }

  public inputDataContract([model, data, resource4, clientId]: [ClientContractModel, CreateClientDTO, Resource, string]) {
    // const clientId = data.id;
    data.contract.forEach(element => {
      model.CONTRACT_GUID = v1();
      model.CLIENT_GUID = clientId;
      model.NAME = element.name;
      model.CONTRACT_NO = element.code;
      model.DESCRIPTION = element.description;

      resource4.resource.push(model);
    });

    return resource4;
  }

  public getByCoordinate([lat, long]: [number, number]) {

    const latMin = lat - 0.005;
    const latMax = Number(lat) + Number(0.005);

    const longMin = long - 0.005;
    const longMax = Number(long) + Number(0.005);

    let filter = [`(LATITUDE >= ${latMin})`, `AND (LATITUDE <= ${latMax})`, `AND (LONGITUDE >= ${longMin})`, `AND (LONGITUDE <= ${longMax})`];
    return this.clientLocationDbService.findByFilterV4([[], filter, null, null, null, ['CLIENT_DATA'], null]);
  }

}