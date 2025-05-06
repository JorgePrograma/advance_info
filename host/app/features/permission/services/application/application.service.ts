import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { fetchApiData } from '../../../../core/utils/api';
import {
  ApplicationModel,
  applicationSignal,
} from '../../models/application.model';

interface ActionInfo {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
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
        console.log("busqueda de aplicacion es ", response)
        const apps = response.data.items.flat();
        applicationSignal.set(apps);
      },
      error: (error) => console.error('Error:', error),
    });
  }
}
