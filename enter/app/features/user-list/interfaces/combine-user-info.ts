import { BasicInfoModel } from "../../create/model/basic-info.model";
import { ContactInfoModel } from "../../create/model/contact-info.model";
import { EmployeeInfoModel } from "../../create/model/employee-info.model";
import { UserModel } from "../../../shared/interfaces/user.model";
import { SignatureModel } from "../../create/model/signature.model";

export interface CombinedUserInfo {
  user?: UserModel | null;
  employee?: EmployeeInfoModel | null;
  person: BasicInfoModel;
  contact?: ContactInfoModel | null;
  signature?: SignatureModel | null;
}
