import { Injectable, signal } from '@angular/core';
import { DocumentTypeModel } from '../../model/document-type.model';
import { DOCUMENT_TYPE_MOCK } from '../../mocks/documentTypeMock';

@Injectable({
  providedIn: 'root'
})

export class DocumentTypeService {
  // Signal para manejar el estado reactivo de los tipos de documentos
  documentTypesSignal = signal<DocumentTypeModel[]>(DOCUMENT_TYPE_MOCK);

  /**
   * Obtiene todos los tipos de documentos.
   */
  getDocumentTypes(): DocumentTypeModel[] {
    return this.documentTypesSignal();
  }

}
