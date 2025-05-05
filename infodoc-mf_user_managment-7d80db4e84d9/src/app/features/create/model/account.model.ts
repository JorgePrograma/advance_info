import { Role } from "../../../shared/interfaces/user.model";

export interface AccountModel {
  id:string;
  avatarPath: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  businessEmail: string;
  password: string;
  roles: [Role];
  token:string;
}
