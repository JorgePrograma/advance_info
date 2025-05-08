export class PermissionConstant {
  static readonly APPLICATION_ID = 'dde09479-7e15-4d72-b73d-2fd703a143fe';

  // User Management
  static readonly LIST_USERS = 'cd656eb8-2e82-431e-9710-f4ce601ba8d9';
  static readonly TOGGLE_USER_STATUS = 'ed1edff6-12fb-4e0a-8bbd-a191871fd667';
  static readonly LIST_USER_GROUPS = '27c38fdb-8ec6-4bd8-8c5b-208e9a0f72ba';
  static readonly ASSIGN_GROUPS = '5546e0bc-7adb-449e-bc00-a39a4a1068a1';
  static readonly REVOKE_GROUPS = 'cf52a90d-aa84-40e0-8181-77712fe92ebf';
  static readonly LIST_USER_ROLES = 'ab8c5d91-8ad8-47cc-86fd-cfe41d7be6b7';
  static readonly ASSIGN_ROLES = '6b88a808-971d-4b2a-93d9-e0173dec0764';
  static readonly REVOKE_ROLES = '1e0fe29e-b038-4a62-a185-7e53fd65f4f7';
  static readonly BLOCK_USER = '8ae38222-1bdc-4442-9e03-c6d3ea7e7970';
  static readonly SUSPEND_USER = '04927286-0652-48f6-91c2-12b290efdaad';
  static readonly MANAGE_SIGNATURES = 'b9931710-59a1-486f-972c-829ab71429ff';

  // User Creation
  static readonly CREATE_USER = '0d6f2c96-7cff-46b8-9d88-71d5900b8a64';
  static readonly DELETE_USER = '0d6f2c96-7cff-46b8-9d88-71d5900b8a64';
  static readonly UPDATE_USER = '0d6f2c96-7cff-46b8-9d88-71d5900b8a64';
  static readonly ASSIGN_ROLES_ON_CREATE = 'b84b8e1b-e1dc-444a-a4e3-38c43e1f63ec';
  static readonly LIST_ROLES_FOR_CREATE = '698edbbc-6e25-48ee-af22-f40aaf7a4fe4';
  static readonly ASSIGN_GROUPS_ON_CREATE = '265c7ef2-42ee-457e-bdd9-660a71466342';
  static readonly LIST_GROUPS_FOR_CREATE = 'f16d669f-d3e6-4c25-966f-7b75ba0f8164';
}
/***
 *
 * export class PermissionConstant {
  // Grupos - Crear Grupo
  static readonly CREAR_GRUPO = 'dce6eb56-a433-466a-9566-64a82b8c7b2e';
  static readonly LISTAR_USUARIO = 'd30460c0-5ae0-47ce-9a3b-ff53c4a34f13';
  static readonly LISTAR_ROLES = '398e145c-d0cc-4171-bfb2-667ba8a32a05';
  static readonly ASIGNAR_USUARIO = 'ffe937d8-f5ca-4c2d-a040-059abe0c2be6';
  static readonly ASIGNAR_ROLES = '2cfd05cc-211c-473b-be39-d5ec34e76b41';

  // Grupos - Gestión de grupos
  static readonly LISTAR_GRUPOS = '15ec2a38-dd6f-43d0-a9fb-434fb885f1e5';
  static readonly EDITAR_GRUPOS = 'fafca100-f52f-4971-8e04-1a01194df9cc';
  static readonly EDITAR_MIEMBROS_DE_GRUPO = 'e59085fa-8d75-44b9-86f7-6b6384163377';
  static readonly EDITAR_ROLES_DE_GRUPO = '61717339-7369-4e08-8c79-a805f98cc993';
  static readonly ACTIVAR_DESACTIVAR_GRUPO = 'cd510ee2-e3de-47ce-b73e-62d8f27fc7c4';

  // Roles - Gestión de Roles
  static readonly LISTAR_ROLES_GESTION = 'f1f36dee-ae91-466a-a807-92c64b85d0f1';
  static readonly LISTAR_PERMISOS = '887ef3b7-61db-4e72-aa83-e122a27bd085';
  static readonly EDITAR_ROL = 'c2debf55-31b0-4856-8cfb-e85676517c06';
  static readonly ACTIVAR_DESACTIVAR_ROL = '8d9585a3-f7ce-45fd-b229-111074801f15';
  static readonly ASIGNAR_PERMISOS = '9b78d29d-7119-4cbd-8093-5d0265c2b7fd';
  static readonly REVOCAR_PERMISO = 'a006c329-2a3d-4e14-8ab0-0ad494aac534';

  // Roles - Crear Roles
  static readonly CREAR_ROL = '03806a4b-f371-4a8c-a43e-393eab849d54';
  static readonly ASIGNAR_PERMISOS_CREAR = '161efd0e-3a6e-40c1-bff9-f37b7ec25c37';
  static readonly LISTAR_PERMISOS_CREAR = '2e9ad600-abcb-4314-baf2-e3680317f37a';

  // Usuarios - Gestión de Usuarios
  static readonly LISTAR_USUARIOS = 'cd656eb8-2e82-431e-9710-f4ce601ba8d9';
  static readonly ACTIVAR_DESACTIVAR_USUARIO = 'ed1edff6-12fb-4e0a-8bbd-a191871fd667';
  static readonly LISTAR_GRUPOS_USUARIO = '27c38fdb-8ec6-4bd8-8c5b-208e9a0f72ba';
  static readonly ASIGNAR_GRUPOS = '5546e0bc-7adb-449e-bc00-a39a4a1068a1';
  static readonly REVOCAR_GRUPOS = 'cf52a90d-aa84-40e0-8181-77712fe92ebf';
  static readonly LISTAR_ROLES_USUARIO = 'ab8c5d91-8ad8-47cc-86fd-cfe41d7be6b7';
  static readonly ASIGNAR_ROLES_USUARIO = '6b88a808-971d-4b2a-93d9-e0173dec0764';
  static readonly REVOCAR_ROLES = '1e0fe29e-b038-4a62-a185-7e53fd65f4f7';
  static readonly BLOQUEAR_USUARIO = '8ae38222-1bdc-4442-9e03-c6d3ea7e7970';
  static readonly SUSPENDER_USUARIO = '04927286-0652-48f6-91c2-12b290efdaad';
  static readonly ADMINISTRAR_FIRMAS = 'b9931710-59a1-486f-972c-829ab71429ff';

  // Usuarios - Crear Usuario
  static readonly CREAR_USUARIO = '0d6f2c96-7cff-46b8-9d88-71d5900b8a64';
  static readonly ASIGNAR_ROLES_CREAR = 'b84b8e1b-e1dc-444a-a4e3-38c43e1f63ec';
  static readonly LISTAR_ROLES_CREAR = '698edbbc-6e25-48ee-af22-f40aaf7a4fe4';
  static readonly ASIGNAR_GRUPOS_CREAR = '265c7ef2-42ee-457e-bdd9-660a71466342';
  static readonly LISTAR_GRUPOS_CREAR = 'f16d669f-d3e6-4c25-966f-7b75ba0f8164';

  // Unidades Organizacionales - Gestión
  static readonly LISTAR_UNIDADES_ORGANIZACIONALES = '77cafd22-426f-4d11-bd13-8fb1abf44e37';
  static readonly ACTIVAR_DESACTIVAR_UNIDADES_ORGANIZACIONALES = '80b868f7-16d0-44d4-a2a5-aaad8bf1d2fb';
  static readonly EDITAR_UNIDADES_ORGANIZACIONALES = 'bc95542f-1a0c-4728-a44d-dce6001a80e9';

  // Unidades Organizacionales - Crear
  static readonly CREAR_UNIDAD_ORGANIZACIONAL = '452bef69-4e28-4df7-834d-7ae8f1285cff';

  // Configuración - General
  static readonly LISTAR_CONFIGURACIONES_DEL_SISTEMA = '29fcd3ee-6596-41f6-b1ef-2983bd643f4b';
  static readonly EDITAR_CONFIGURACIONES_DEL_SISTEMA = '934a822e-82ce-4eb6-a3b3-cab77e90169b';

  // Configuración - Licenciamiento
  static readonly LISTAR_CONFIGURACIONES_DE_LICENCIAMIENTO = '6ef99790-5bf8-44ac-9d7f-1b68086850cb';
  static readonly EDITAR_CONFIGURACIONES_DE_LICENCIAMIENTO = '1e9c3034-cc82-42a6-a3b4-54bed279c965';

  // Dias no hábiles - Gestión
  static readonly LISTAR_DIAS_NO_HABILES = '3b6bbfdc-b2ae-4060-acbd-49ee2fafd306';
  static readonly EDITAR_DIAS_NO_HABILES = '634279d3-28a0-4aad-a76a-4c0a047fc85c';

  // Dias no hábiles - Crear
  static readonly CREAR_DIAS_NO_HABILES = '2560e4a4-0f90-4ccd-96bf-2de0fb14af6a';

  // Aplicación
  static readonly APPLICATION_ID = 'dde09479-7e15-4d72-b73d-2fd703a143fe';
}
 */
/**
 *
 * acciones del usuario  {"idAplication":"dde09479-7e15-4d72-b73d-2fd703a143fe","nameAplication":"Consola Administrativa","modules":[{"idModule":"5e2f74e3-a9a2-44ec-9a24-3cc2d5a5f15a","nameModule":"Grupos","subModules":[{"idSubModule":"af158282-3dc0-4c6a-b277-06483a53987a","nameSubModule":"Crear Grupo","actions":[{"idAction":"dce6eb56-a433-466a-9566-64a82b8c7b2e","nameAction":"CrearGrupo"},{"idAction":"d30460c0-5ae0-47ce-9a3b-ff53c4a34f13","nameAction":"ListarUsuario"},{"idAction":"398e145c-d0cc-4171-bfb2-667ba8a32a05","nameAction":"ListarRoles"},{"idAction":"ffe937d8-f5ca-4c2d-a040-059abe0c2be6","nameAction":"AsignarUsuario"},{"idAction":"2cfd05cc-211c-473b-be39-d5ec34e76b41","nameAction":"AsignarRoles"}]},{"idSubModule":"3f7e89c1-8906-4f16-805b-bc5310ed1a4e","nameSubModule":"Gestión de grupos","actions":[{"idAction":"15ec2a38-dd6f-43d0-a9fb-434fb885f1e5","nameAction":"ListarGrupos"},{"idAction":"fafca100-f52f-4971-8e04-1a01194df9cc","nameAction":"EditarGrupos"},{"idAction":"e59085fa-8d75-44b9-86f7-6b6384163377","nameAction":"EditarMiembrosDeGrupo"},{"idAction":"61717339-7369-4e08-8c79-a805f98cc993","nameAction":"EditarRolesDeGrupo"},{"idAction":"cd510ee2-e3de-47ce-b73e-62d8f27fc7c4","nameAction":"ActivarDesactivarGrupo"}]}]},{"idModule":"a03022a2-b675-4026-880b-9d34167f3ec9","nameModule":"Roles","subModules":[{"idSubModule":"4c4e2ea5-0776-4d43-a5df-a88bbcd7d194","nameSubModule":"Gestión de Roles","actions":[{"idAction":"f1f36dee-ae91-466a-a807-92c64b85d0f1","nameAction":"ListarRoles"},{"idAction":"887ef3b7-61db-4e72-aa83-e122a27bd085","nameAction":"ListarPermisos"},{"idAction":"c2debf55-31b0-4856-8cfb-e85676517c06","nameAction":"EditarRol"},{"idAction":"8d9585a3-f7ce-45fd-b229-111074801f15","nameAction":"ActivarDesactivarRol"},{"idAction":"9b78d29d-7119-4cbd-8093-5d0265c2b7fd","nameAction":"AsignarPermisos"},{"idAction":"a006c329-2a3d-4e14-8ab0-0ad494aac534","nameAction":"RevocarPermiso"}]},{"idSubModule":"d15b9ecb-9640-47de-a580-e46e62ad904f","nameSubModule":"Crear Roles","actions":[{"idAction":"03806a4b-f371-4a8c-a43e-393eab849d54","nameAction":"CrearRol"},{"idAction":"161efd0e-3a6e-40c1-bff9-f37b7ec25c37","nameAction":"AsignarPermisos"},{"idAction":"2e9ad600-abcb-4314-baf2-e3680317f37a","nameAction":"ListarPermisos"}]}]},{"idModule":"e1809f43-02aa-48d9-b71f-479a7e881834","nameModule":"Usuarios","subModules":[{"idSubModule":"38b905a9-c9c9-4258-8990-77b0c64d418e","nameSubModule":"Gestión de Usuarios","actions":[{"idAction":"cd656eb8-2e82-431e-9710-f4ce601ba8d9","nameAction":"ListarUsuarios"},{"idAction":"ed1edff6-12fb-4e0a-8bbd-a191871fd667","nameAction":"ActivarDesactivarUsuario"},{"idAction":"27c38fdb-8ec6-4bd8-8c5b-208e9a0f72ba","nameAction":"ListarGrupos"},{"idAction":"5546e0bc-7adb-449e-bc00-a39a4a1068a1","nameAction":"AsignarGrupos"},{"idAction":"cf52a90d-aa84-40e0-8181-77712fe92ebf","nameAction":"RevocarGrupos"},{"idAction":"ab8c5d91-8ad8-47cc-86fd-cfe41d7be6b7","nameAction":"ListarRoles"},{"idAction":"6b88a808-971d-4b2a-93d9-e0173dec0764","nameAction":"AsignarRoles"},{"idAction":"1e0fe29e-b038-4a62-a185-7e53fd65f4f7","nameAction":"RevocarRoles"},{"idAction":"8ae38222-1bdc-4442-9e03-c6d3ea7e7970","nameAction":"BloquearUsuario"},{"idAction":"04927286-0652-48f6-91c2-12b290efdaad","nameAction":"SuspenderUsuario"},{"idAction":"b9931710-59a1-486f-972c-829ab71429ff","nameAction":"AdministrarFirmas"}]},{"idSubModule":"f5510590-9186-4288-915e-229559ca3a3c","nameSubModule":"Crear Usuario","actions":[{"idAction":"0d6f2c96-7cff-46b8-9d88-71d5900b8a64","nameAction":"CrearUsuario"},{"idAction":"b84b8e1b-e1dc-444a-a4e3-38c43e1f63ec","nameAction":"AsignarRoles"},{"idAction":"698edbbc-6e25-48ee-af22-f40aaf7a4fe4","nameAction":"ListarRoles"},{"idAction":"265c7ef2-42ee-457e-bdd9-660a71466342","nameAction":"AsignarGrupos"},{"idAction":"f16d669f-d3e6-4c25-966f-7b75ba0f8164","nameAction":"ListarGrupos"}]}]},{"idModule":"a98880dd-facb-4031-a513-7ecf3478b797","nameModule":"Unidades Organizacionales","subModules":[{"idSubModule":"e0b563ee-0c34-4cdb-a8d0-768851dba076","nameSubModule":"Gestión de Unidades Organizacionales","actions":[{"idAction":"77cafd22-426f-4d11-bd13-8fb1abf44e37","nameAction":"ListarUnidadesOrganizacionales"},{"idAction":"80b868f7-16d0-44d4-a2a5-aaad8bf1d2fb","nameAction":"ActivarDesactivarUnidadesOrganizacionales"},{"idAction":"bc95542f-1a0c-4728-a44d-dce6001a80e9","nameAction":"EditarUnidadesOrganizacionales"}]},{"idSubModule":"56453e3b-efce-439c-862a-7b0fe89ba9ea","nameSubModule":"Crear Unidad Organizacional","actions":[{"idAction":"452bef69-4e28-4df7-834d-7ae8f1285cff","nameAction":"CrearUnidadOrganizacional"}]}]},{"idModule":"d98a612f-ebbb-41a2-8140-edb522a9244c","nameModule":"Configuración","subModules":[{"idSubModule":"1ae2619f-7dbf-4257-889d-bb0b8fc390fd","nameSubModule":"Configuración General","actions":[{"idAction":"29fcd3ee-6596-41f6-b1ef-2983bd643f4b","nameAction":"ListarConfiguracionesDelSistema"},{"idAction":"934a822e-82ce-4eb6-a3b3-cab77e90169b","nameAction":"EditarConfiguracionesDelSistema"}]},{"idSubModule":"c83d0a16-46d3-4c49-8dc4-4f5c8f087f1e","nameSubModule":"Licenciamiento","actions":[{"idAction":"6ef99790-5bf8-44ac-9d7f-1b68086850cb","nameAction":"ListarConfiguracionesDeLicenciamiento"},{"idAction":"1e9c3034-cc82-42a6-a3b4-54bed279c965","nameAction":"EditarConfiguracionesDeLicenciamiento"}]}]},{"idModule":"a8eda4f3-544c-4b94-8459-6c5d838d3d28","nameModule":"Dias no hábiles","subModules":[{"idSubModule":"2ccb5e8d-cc35-44aa-8332-c50f0173f261","nameSubModule":"Gestión Dias no hábiles","actions":[{"idAction":"3b6bbfdc-b2ae-4060-acbd-49ee2fafd306","nameAction":"ListarDiasNoHabiles"},{"idAction":"634279d3-28a0-4aad-a76a-4c0a047fc85c","nameAction":"EditarDiasNoHabiles"}]},{"idSubModule":"3ce4a716-609a-4cac-9220-4b6ec0ef236d","nameSubModule":"Crear Dias no hábiles","actions":[{"idAction":"2560e4a4-0f90-4ccd-96bf-2de0fb14af6a","nameAction":"CrearDiasNoHabiles"}]}]}]}
 */
