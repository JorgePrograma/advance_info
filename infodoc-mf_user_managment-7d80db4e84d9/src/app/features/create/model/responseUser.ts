import { BasicInfoModel } from "./basic-info.model";

export interface ResponseUser{
  items:      BasicInfoModel[];
  totalCount: number;
  pageNumber: number;
  pageSize:   number;
}
