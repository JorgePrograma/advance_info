import { Role } from "../../../shared/interfaces/user.model";

export interface AccountDirectoryModel {
  avatarPath: string;
  userName: string;
  token: string;
  roles: [Role];
}
