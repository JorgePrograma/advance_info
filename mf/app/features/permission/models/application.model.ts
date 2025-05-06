export interface ApplicationModel {
  idAplication: string;
  nameAplication: string;
  descriptionAplication: string;
  version: string;
  modules: Module[];
}

export interface Module {
  idModule: string;
  nameModule: string;
  descriptionModule: string;
  subModules: SubModule[];
}

export interface SubModule {
  idSubModule: string;
  nameSubModule: string;
  descriptionSubModule: string;
  actions: Action[];
}

export interface Action {
  idAction: string;
  nameAction: string;
  descriptionAction: string;
}
