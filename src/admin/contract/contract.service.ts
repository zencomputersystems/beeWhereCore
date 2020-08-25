import { Injectable } from "@nestjs/common";
import { of } from "rxjs";
import { CreateContractDTO } from './dto/create-contract.dto';
import { ClientContractDbService } from '../../common/db/table.db.service';
import { ClientContractModel } from '../../common/model/client-contract.model';
import { v1 } from "uuid";
import { Resource } from "../../common/model/resource.model";
import { UpdateContractDTO } from "./dto/update-contract.dto";

@Injectable()
export class ContractService {
  constructor(private readonly clientContractDbService: ClientContractDbService) { }
  public getAllContract([req]: [any]) {
    return this.clientContractDbService.findByFilterV4([[], [], null, null, null, [], null])
    // return of(data);
  }

  public getOneContract([clientId]: [string]) {
    return this.clientContractDbService.findByFilterV4([[], [`(CLIENT_GUID=${clientId})`], null, null, null, [], null])
    // return of(data);
  }

  public createContract([createContractDTO]: [CreateContractDTO]) {

    const dataContract = new ClientContractModel

    dataContract.CONTRACT_GUID = v1();
    this.inputDataContract([dataContract, createContractDTO]);

    const resource = new Resource(new Array);
    resource.resource.push(dataContract);

    return this.clientContractDbService.createByModel([resource, [], [], []])
  }

  public updateContract([updateContractDTO]: [UpdateContractDTO]) {
    const data = new ClientContractModel
    data.CONTRACT_GUID = updateContractDTO.contractId;
    this.inputDataContract([data, updateContractDTO]);

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientContractDbService.updateByModel([resource, [], [], []]);
    // return of(data);
  }

  public deleteContract([contractId]: [string]) {
    const data = new ClientContractModel
    data.CONTRACT_GUID = contractId;
    data.STATUS = 0;

    const resource = new Resource(new Array);
    resource.resource.push(data);

    return this.clientContractDbService.updateByModel([resource, [], [], []]);
  }

  public inputDataContract([model, data]: [ClientContractModel, CreateContractDTO]) {
    model.CLIENT_GUID = data.clientId;
    model.NAME = data.name;
    model.CONTRACT_NO = data.contractNo;
    model.DESCRIPTION = data.description;
    model.STATUS = 1;

    return model
  }
}