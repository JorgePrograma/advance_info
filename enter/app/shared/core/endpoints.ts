export class EndPoints {
  static readonly base_url =
    'https://ib3m6t7bp7sjmglwvvpg3xrmzu.apigateway.sa-bogota-1.oci.customer-oci.com/api/v1';
  static readonly USERS = this.base_url + '/user/get-by-filter';
  static readonly EMPLOYEES = this.base_url + '/employee/get-filter';
  static readonly CONTACTS = this.base_url + '/contact-details/get-filter';
  static readonly PERSONS = this.base_url + '/person/get-filter';

  static readonly GET_ALL_BRANCHES = this.base_url + '/redis/get-value/branches';
  static readonly GET_ALL_LOCATIONS =
    this.base_url + '/redis/get-value/location';
  static readonly GET_ALL_ROLES = this.base_url + '/role/get-all-roles';
  static readonly GET_ALL_GROUPS = this.base_url + '/group/get-all';
  static readonly GET_ALL_DOCUMENTS_TYPE = this.base_url + 'role/get-all-roles';
  static readonly GET_ALL_POSITION =
    this.base_url + '/position/get-positions';

  static readonly CREATE_PEOPLE = this.base_url + '/person/create';
  static readonly CREATE_CONTACT = this.base_url + '/contact-details/create';
  static readonly CREATE_EMPLOYEE = this.base_url + '/employee/create';
  static readonly CREATE_ACCOUNT = this.base_url + '/user/create';
  static readonly CREATE_AVATAR = this.base_url + '/file/save';
  static readonly CREATE_ACCOUNT_WITH_DIRECTORY =
    this.base_url + '/user/sync-from-da';
    static readonly GET_USER_BY_DOCUMENT = this.base_url + '/person/get-filter';
    static readonly GET_USER_BY_USER = this.base_url + '/user/get-by-filter';

  static readonly UPDATE_PEOPLE = this.base_url + '/person/update';
  static readonly UPDATE_CONTACT = this.base_url + '/contact-details/update';
  static readonly UPDATE_USERS = this.base_url + '/user/update';
  static readonly UPDATE_EMPLOYEE = this.base_url + '/employee/update-employee';
  static readonly GENERATE_AUTH_FOR_USER =
    this.base_url + '/token/generate-by-parameters';
  static readonly CREATE_SIGNATURE = this.base_url + '/signature/create';
  static readonly GENERATE_SECRET = this.base_url + '/secret/create';
  static readonly PASSORD_PARAMATER = this.base_url + '/security/password-criteria';
  static readonly SAVE_IMAGE = this.base_url + '/file/upload-url-signed';
}
