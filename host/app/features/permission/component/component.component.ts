import { Component, computed, effect } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { applicationSignal } from '../models/application.model';

@Component({
  selector: 'app-component',
  standalone: true,
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css'],
})
export class ComponentComponent {
  displayedColumns = [
    'appName',
    'moduleName',
    'subModuleName',
    'actionName',
    'actionId',
  ];

  // Computed para aplanar los datos
  flatRows = computed(() => {
    const rows: any[] = [];
    for (const app of applicationSignal() ?? []) {
      for (const module of app.modules ?? []) {
        for (const subModule of module.subModules ?? []) {
          for (const action of subModule.actions ?? []) {
            rows.push({
              appName: app.nameAplication,
              moduleName: module.nameModule,
              subModuleName: subModule.nameSubModule,
              actionName: action.nameAction,
              actionId: action.idAction
            });
          }
        }
      }
    }
    return rows;
  });

  // DataSource de Angular Material
  dataSource = new MatTableDataSource<any>([]);

  constructor() {
    // Actualiza el dataSource cada vez que cambian los datos del signal
    effect(() => {
      this.dataSource.data = this.flatRows();
    });
  }
}
