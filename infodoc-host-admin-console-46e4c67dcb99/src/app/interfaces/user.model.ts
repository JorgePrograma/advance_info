export interface UserIdpResponse {
  data: DataPage;
  errors: ApiError[];
  statusCode: number;
}

export interface DataPage {
  items: UserModel[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface UserModel {
  id: string;
  idUserIDCS: string;
  avatarPath: string;
  userName: string;
  creationDate: Date;
  state: string;
  roles?: Role[];
}

export interface Role {
  id: string;
  name: string;
}

export interface ApiError {
  code?: string;
  message: string;
  [key: string]: any;
}
