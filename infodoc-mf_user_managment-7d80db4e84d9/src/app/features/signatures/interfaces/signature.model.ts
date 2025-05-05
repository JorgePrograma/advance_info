export enum SignatureType {
  DIGITAL = 'digital',
  MECHANICAL = 'mechanical',
  RUBRICA = 'rubrica'
}

export interface SignatureModel {
  id: string;
  userId: string;
  type: SignatureType;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
}
