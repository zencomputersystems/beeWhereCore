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
  constructor(private readonly clientLocationDbService: ClientLocationDbService) { }
  public getAllLocation([req]: [any]) {
    return this.clientLocationDbService.findByFilterV4([[], [], null, null, null, [], null])
    // return of(data);
  }

  public getOneLocation([clientId]: [string]) {
    return this.clientLocationDbService.findByFilterV4([[], [`(CLIENT_GUID=${clientId})`], null, null, null, [], null])
    // return of(data);
  }

  public createLocation([createlocationDTO]: [CreateLocationDTO]) {

    const datalocation = new ClientLocationModel

    datalocation.LOCATION_GUID = v1();
    this.inputDataLocation([datalocation, createlocationDTO]);

    const resource = new Resource(new Array);
    resource.resource.push(datalocation);

    return this.clientLocationDbService.createByModel([resource, [], [], []])
  }

  public updateLocation([updatelocationDTO]: [UpdateLocationDTO]) {
    const data = new ClientLocationModel
    data.LOCATION_GUID = updatelocationDTO.locationId;
    this.inputDataLocation([data, updatelocationDTO]);

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientLocationDbService.updateByModel([resource, [], [], []]);
    // return of(data);
  }

  public inputDataLocation([model, data]: [ClientLocationModel, CreateLocationDTO]) {
    model.CLIENT_GUID = data.clientId;
    model.LATITUDE = data.latitude;
    model.LONGITUDE = data.latitude;
    model.ADDRESS = data.address;

    return model
  }
}