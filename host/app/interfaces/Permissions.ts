import { signal } from "@angular/core";

export interface Permissions {
  idRole: string;
  nameRole: string;
  descriptionRole: string;
  creationDate: Date;
  firstUseDate: null;
  lastUpdateDate: Date;
  isActive: boolean;
  version: number;
  permissions: Permission[];
}

export interface Permission {
  aplications: Aplication[];
}

export interface Aplication {
  idAplication: string;
  nameAplication: NameAplication;
  modules: Module[];
}

export interface Module {
  idModule: string;
  nameModule: NameModule;
  subModules: SubModule[];
}

export enum NameModule {
  Configuración = 'Configuración',
  Correspondencia = 'Correspondencia',
  DiasNoHábiles = 'Dias no hábiles',
  Grupos = 'Grupos',
  Roles = 'Roles',
  UnidadesOrganizacionales = 'Unidades Organizacionales',
  Usuarios = 'Usuarios',
}

export interface SubModule {
  idSubModule: string;
  nameSubModule: string;
  actions: Action[];
}

export interface Action {
  idAction: string;
  nameAction: string;
}

export enum NameAplication {
  ConsolaAdministrativa = 'Consola Administrativa',
  Sgdea = 'SGDEA',
}

export const permissionsActionsSignal = signal<Action[]>([]);
export const permissionsSignal = signal<Permissions[]>([]);
