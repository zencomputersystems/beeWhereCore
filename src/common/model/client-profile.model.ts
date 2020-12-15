import { CreateUpdateModel } from './create-update.model';
export class ClientProfileModel extends CreateUpdateModel {
  CLIENT_GUID: string;
  TENANT_GUID: string;
  NAME: string;
  ABBR: string;
  STATUS: number;
}