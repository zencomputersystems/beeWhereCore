import { Injectable } from "@nestjs/common";
import { ClientProfileModel } from '../../common/model/client-profile.model';
import { CreateClientDTO } from "./dto/create-client.dto";
import { UserMainModel } from '../../common/model/user-main.model';
import { Resource } from "../../common/model/resource.model";
import { v1 } from "uuid";
import { ClientProfileDbService, ClientLocationDbService, ClientContractDbService, ClientProjectDbService } from '../../common/db/table.db.service';
import { UpdateClientDTO } from "./dto/update-client.dto";
import { ClientLocationModel } from "../../common/model/client-location.model";
import { mergeMap, map } from "rxjs/operators";
import { ClientProjectModel } from "../../common/model/client-project.model";
import { ClientContractModel } from "../../common/model/client-contract.model";
import { UpdateClientBundleDTO, PatchBundleDTO, PostBundleDTO, DeleteBundleDTO } from './dto/update-bundle.dto';
import { of } from "rxjs";
import { ProjectService } from '../project/project.service';
import { LocationService } from '../location/location.service';
import { ContractService } from "../contract/contract.service";

@Injectable()
export class ClientService {

  constructor(
    private readonly clientProfileDbService: ClientProfileDbService,
    private readonly clientLocationDbService: ClientLocationDbService,
    private readonly clientContractDbService: ClientContractDbService,
    private readonly clientProjectDbService: ClientProjectDbService,
    private readonly contractService: ContractService,
    private readonly projectService: ProjectService,
    private readonly locationService: LocationService
  ) { }

  public createClient([clientData, req]: [CreateClientDTO, any]) {
    const dataClient = new ClientProfileModel();

    dataClient.CLIENT_GUID = v1();
    dataClient.TENANT_GUID = req.user.TENANT_GUID;
    const clientId = dataClient.CLIENT_GUID;
    this.inputDataClient([dataClient, clientData]);

    const resource = new Resource(new Array);
    resource.resource.push(dataClient);

    // let createClient = this.clientProfileDbService.createByModel([resource, [], [], []]);



    return this.clientProfileDbService.createByModel([resource, [], [], []]).pipe(
      mergeMap(res => {
        if (clientData.location.length > 0) {
          const resource2 = new Resource(new Array);
          this.inputDataLocation([clientData, resource2, clientId]);
          return this.clientLocationDbService.createByModel([resource2, [], [], []]);
        } else {
          return of(res);
        }
      }), mergeMap(res => {
        if (clientData.project.length > 0) {
          const resource3 = new Resource(new Array);
          this.inputDataProject([clientData, resource3, clientId]);
          return this.clientProjectDbService.createByModel([resource3, [], [], []])
        } else {
          return of(res);
        }
      }), mergeMap(res => {
        if (clientData.contract.length > 0) {
          const resource4 = new Resource(new Array);
          this.inputDataContract([clientData, resource4, clientId]);
          return this.clientContractDbService.createByModel([resource4, [], [], []])
        } else {
          return of(res);
        }
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

  public updateClientBundle([bundleClientData, req]: [UpdateClientBundleDTO, UserMainModel]) {
    let patchData = bundleClientData.patch;
    let postData = bundleClientData.post;
    let deleteData = bundleClientData.delete;

    let patchResource = this.patchProcessBundle([patchData]);
    let postResource = this.postProcessBundle([postData]);
    let deleteResource = this.deleteProcessBundle([deleteData]);



    return of(bundleClientData);

    // const data = new ClientProfileModel

    // data.CLIENT_GUID = editClientData.id;
    // this.inputDataClient([data, editClientData]);

    // const resource = new Resource(new Array);
    // resource.resource.push(data);

    // return this.clientProfileDbService.updateByModel([resource, [], [], []]);
  }

  private deleteProcessBundle([deleteData]: [DeleteBundleDTO]) {
    if (deleteData.contract.length > 0) {
      deleteData.contract.forEach(element => {
        this.contractService.deleteContract([element.id]).subscribe();
      });
    }
    if (deleteData.project.length > 0) {
      deleteData.project.forEach(element => {
        this.projectService.deleteProject([element.id]).subscribe();
      })
    }
    if (deleteData.location.length > 0) {
      deleteData.location.forEach(element => {
        this.locationService.deleteLocation([element.id]).subscribe();
      });
    }
  }

  private patchProcessBundle([patchData]: [PatchBundleDTO]) {
    if (patchData.client.length > 0) {
      patchData.client.forEach(element => {
        this.updateClient([element, null]).subscribe();
      });
    }
    if (patchData.contract.length > 0) {
      patchData.contract.forEach(element => {
        this.contractService.updateContract([element]).subscribe();
      });
    }
    if (patchData.project.length > 0) {
      patchData.project.forEach(element => {
        this.projectService.updateProject([element]).subscribe();
      })
    }
    if (patchData.location.length > 0) {
      patchData.location.forEach(element => {
        this.locationService.updateLocation([element]).subscribe();
      });
    }
  }

  private postProcessBundle([postData]: [PostBundleDTO]) {
    if (postData.contract.length > 0) {
      postData.contract.forEach(element => {
        this.contractService.createContract([element]).subscribe();
      });
    }
    if (postData.project.length > 0) {
      postData.project.forEach(element => {
        this.projectService.createProject([element]).subscribe();
      })
    }
    if (postData.location.length > 0) {
      postData.location.forEach(element => {
        this.locationService.createLocation([element]).subscribe();
      });
    }
  }

  public getClient([type, req]: [string, any]) {
    let method;
    if (type == 'detail') {
      let url = this.clientProfileDbService.queryService.generateDbQueryV3(['a_client_profile', ['CLIENT_GUID', 'NAME', 'ABBR'], [`(STATUS=1)`, `AND (TENANT_GUID=${req.user.TENANT_GUID})`], null, null, null, ['LOCATION_DATA', 'CONTRACT_DATA', 'PROJECT_DATA'], null]);

      const projectFieldUrl = '&PROJECT_DATA.fields=PROJECT_GUID,NAME,SOC_NO,DESCRIPTION,STATUS';
      const locationFieldUrl = '&LOCATION_DATA.fields=LOCATION_GUID,LATITUDE,LONGITUDE,ADDRESS,STATUS';
      const contractFieldUrl = '&CONTRACT_DATA.fields=CONTRACT_GUID,NAME,CONTRACT_NO,DESCRIPTION,STATUS';

      url = url + projectFieldUrl + locationFieldUrl + contractFieldUrl

      method = this.clientProfileDbService.httpService.get(url)
        .pipe(
          map(res => {
            if (res.status == 200) {
              res.data.resource.forEach(element => {
                element.PROJECT_DATA = element.PROJECT_DATA.filter(x => x.STATUS === 1);
                element.CONTRACT_DATA = element.CONTRACT_DATA.filter(x => x.STATUS === 1);
                element.LOCATION_DATA = element.LOCATION_DATA.filter(x => x.STATUS === 1);
                element.PROJECT_DATA.forEach(x => { delete x.STATUS; });
                element.CONTRACT_DATA.forEach(x => { delete x.STATUS; });
                element.LOCATION_DATA.forEach(x => { delete x.STATUS; });
              });
              return res.data.resource.sort((a, b) => 0 - (a.NAME > b.NAME ? -1 : 1));;
            }
          })
        )

    } else {
      method = this.clientProfileDbService.findByFilterV4([['CLIENT_GUID', 'NAME', 'ABBR'], [`(STATUS=1)`, `AND (TENANT_GUID=${req.user.TENANT_GUID})`], null, null, null, [], null]).pipe(
        map(res => {
          return res.sort((a, b) => 0 - (a.NAME > b.NAME ? -1 : 1));
        })
      );
    }
    return method;
  }

  public inputDataClient([model, data]: [ClientProfileModel, UpdateClientDTO | CreateClientDTO]) {

    model.NAME = data.name;
    model.ABBR = data.abbr;
    model.STATUS = 1;

    return model;
  }

  public inputDataLocation([data, resource2, clientId]: [CreateClientDTO, Resource, string]) {
    // const clientId = data.id;
    data.location.forEach(element => {
      let model = new ClientLocationModel;
      model.LOCATION_GUID = v1();
      model.CLIENT_GUID = clientId;
      model.LATITUDE = element.lat;
      model.LONGITUDE = element.long;
      model.ADDRESS = element.address;
      model.STATUS = 1;

      resource2.resource.push(model);
    });

    return resource2;
  }

  public inputDataProject([data, resource3, clientId]: [CreateClientDTO, Resource, string]) {

    data.project.forEach(element => {
      let model = new ClientProjectModel;
      model.PROJECT_GUID = v1();
      model.CLIENT_GUID = clientId;
      model.NAME = element.name;
      model.SOC_NO = element.code;
      model.DESCRIPTION = element.description;
      model.STATUS = 1;

      resource3.resource.push(model);
    });
    return resource3;
  }

  public inputDataContract([data, resource4, clientId]: [CreateClientDTO, Resource, string]) {
    // const clientId = data.id;
    data.contract.forEach(element => {
      let model = new ClientContractModel;
      model.CONTRACT_GUID = v1();
      model.CLIENT_GUID = clientId;
      model.NAME = element.name;
      model.CONTRACT_NO = element.code;
      model.DESCRIPTION = element.description;
      model.STATUS = 1;

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

  public deleteClient([clientId]: [string]) {
    const data = new ClientProfileModel

    data.CLIENT_GUID = clientId;
    data.STATUS = 0;

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientProfileDbService.updateByModel([resource, [], [], []]);
  }
}