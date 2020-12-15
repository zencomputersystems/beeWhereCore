import { Injectable } from "@nestjs/common";
import { of } from "rxjs";
import { CreateLocationDTO } from './dto/create-location.dto';
import { ClientLocationDbService } from '../../common/db/table.db.service';
import { ClientLocationModel } from '../../common/model/client-location.model';
import { v1 } from "uuid";
import { Resource } from "../../common/model/resource.model";
import { UpdateLocationDTO } from "./dto/update-location.dto";

@Injectable()
export class LocationService {
  constructor(public clientLocationDbService: ClientLocationDbService) { }
  public getAllLocation([req]: [any]) {
    return this.clientLocationDbService.findByFilterV4([[], [], null, null, null, [], null])
    // return of(data);
  }

  public getOneLocation([clientId]: [string]) {
    return this.clientLocationDbService.findByFilterV4([[], [`(CLIENT_GUID=${clientId})`], null, null, null, [], null])
    // return of(data);
  }

  public createLocation([createlocationDTO, user]: [CreateLocationDTO, any]) {

    const datalocation = new ClientLocationModel

    datalocation.LOCATION_GUID = v1();
    this.inputDataLocation([datalocation, createlocationDTO]);
    datalocation.CREATION_USER_GUID = user.USER_GUID;

    const resource = new Resource(new Array);
    resource.resource.push(datalocation);

    return this.clientLocationDbService.createByModel([resource, [], [], []])
  }

  public updateLocation([updatelocationDTO, user]: [UpdateLocationDTO, any]) {
    const data = new ClientLocationModel
    data.LOCATION_GUID = updatelocationDTO.locationId;
    this.inputDataLocation([data, updatelocationDTO]);
    data.UPDATE_USER_GUID = user.USER_GUID;
    data.UPDATE_TS = new Date().toISOString();

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientLocationDbService.updateByModel([resource, [], [], []]);
    // return of(data);
  }

  public deleteLocation([locationId]: [string]) {
    const data = new ClientLocationModel
    data.LOCATION_GUID = locationId;
    data.STATUS = 0;

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientLocationDbService.updateByModel([resource, [], [], []]);
  }

  public inputDataLocation([model, data]: [ClientLocationModel, CreateLocationDTO]) {
    model.CLIENT_GUID = data.clientId;
    model.LATITUDE = data.latitude;
    model.LONGITUDE = data.longitude;
    model.ADDRESS = data.address;
    model.STATUS = 1;

    return model
  }
}