import { CreateUpdateModel } from './create-update.model';
export class ClientContractModel extends CreateUpdateModel {
  CONTRACT_GUID: string;
  CLIENT_GUID: string;
  NAME: string;
  CONTRACT_NO: string;
  DESCRIPTION: string;
  STATUS: number;
}