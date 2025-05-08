export interface SignatureSecretModel {
  compartmentId: string; // variable de entorno
  vaultId: string; // variable de entorno
  keyId: string; // variable de entorno
  secretName: string; // document
  content: Content;
  contentName: string;
  description: string;
}

export interface Content {
  value: string; // firma en base 64
  status: string;
  passwordHash?: string;
}
