import { CreateUpdateModel } from './create-update.model';
export class AttendanceProfileModel extends CreateUpdateModel {
  ATTENDANCE_GUID: string;
  TENANT_GUID: string;
  CODE: string;
  DESCRIPTION: string;
  PROPERTIES_XML: string;
}