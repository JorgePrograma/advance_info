import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ApplicationModel } from '../../models/application.model';
import { fetchApiData } from '../../../user-list/core/utils/api.utils';
import { PermissionConstant } from '../../../../shared/core/permission.constant';

interface ActionInfo {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  // Cambiar el tipo para guardar objetos con ID y Name
  private readonly _actions = signal<ActionInfo[]>([]);
  public readonly actions = this._actions.asReadonly();

  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient) {}

  loadAllData() {
    fetchApiData<ApplicationModel[]>(
      'https://ib3m6t7bp7sjmglwvvpg3xrmzu.apigateway.sa-bogota-1.oci.customer-oci.com/api/v1/application/get-all',
      {},
      this.http,
      false
    ).subscribe({
      next: (response) => {
        const apps = response.data.items.flat();

        const allActions = apps
          .filter(
            (app) =>
              app.idAplication.trim() === PermissionConstant.APPLICATION_ID
          )
          .flatMap((app) =>
            app.modules.flatMap((module) =>
              module.subModules.flatMap((subModule) =>
                subModule.actions.map((action) => ({
                  id: action.idAction,
                  name: action.nameAction,
                }))
              )
            )
          );

        this._actions.set(allActions);
      },
      error: (error) => console.error('Error:', error),
    });
  }
}
