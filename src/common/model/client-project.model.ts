import { CreateUpdateModel } from './create-update.model';
export class ClientProjectModel extends CreateUpdateModel {
  PROJECT_GUID: string;
  CLIENT_GUID: string;
  NAME: string;
  SOC_NO: string;
  DESCRIPTION: string;
  STATUS: number;
}