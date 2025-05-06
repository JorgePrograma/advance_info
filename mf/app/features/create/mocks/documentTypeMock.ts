import { DocumentTypeModel } from '../model/document-type.model';

export const DOCUMENT_TYPE_MOCK: DocumentTypeModel[] = [
  {
    id: 'CC',
    name: 'Cédula de Ciudadanía',
    prefix: 'CC'
  },
  {
    id: 'TI',
    name: 'Tarjeta de Identidad',
    prefix: 'TI'
  },
  {
    id: 'CE',
    name: 'Cédula de Extranjería',
    prefix: 'CE'
  },
  {
    id: 'PA',
    name: 'Pasaporte',
    prefix: 'PA'
  },
  {
    id: 'RC',
    name: 'Registro Civil',
    prefix: 'RC'
  }
];
