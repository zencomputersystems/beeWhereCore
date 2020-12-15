import { CreateUpdateModel } from "./create-update.model";

export class ClientLocationModel extends CreateUpdateModel {
  LOCATION_GUID: string;
  CLIENT_GUID: string;
  LATITUDE: string;
  LONGITUDE: string;
  ADDRESS: string;
  STATUS: number;
}