import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms'; // FormsModule se importa pero no se usa activamente en la plantilla básica mostrada.
import { AppService } from '../../../../app.service';


// -----------------------------------------
// 2. Componente (basic.component.ts) con plantilla inline
// -----------------------------------------
@Component({
  selector: 'app-basic', // Cómo usarás este componente en otro HTML: <app-basic></app-basic>
  standalone: true,     // Indica que es un componente autónomo
  imports: [
    CommonModule,       // Necesario para directivas como *ngIf, *ngFor
    NgxDatatableModule, // Módulo para la tabla
    FormsModule         // Para funcionalidades de formularios (aunque no se usa en esta plantilla)
  ],
  // Plantilla HTML directamente aquí usando backticks ``
  template: `
    <div class="row">
      <div class="col-sm-12">
        <h3>Tabla básica</h3>
        <ul>
          <li>Configuración básica</li>
        </ul>
        <ngx-datatable
          class="material"
          [rows]="data"
          [columns]="columns"
          [columnMode]="'force'"
          [headerHeight]="50"
          [rowHeight]="'auto'"
          [footerHeight]="0">
        </ngx-datatable>
      </div>
    </div>
    <!-- Aquí podrían ir otras tablas usando las otras variables como dataBasicNoData, etc. -->
    <!-- pero no están incluidas en el ejemplo original de HTML -->
  `,
  // No es necesario 'providers: [AppService]' porque se usó providedIn: 'root' en el servicio.
})
export class BasicComponent implements OnInit {

  // Propiedades para la tabla básica (la única mostrada en la plantilla)
  data: { id: string; name: string; phone: string; company: string; zip: string; city: string; date: string; country: string; }[] = [];
  columns: any[] = []; // Definido como any[] para flexibilidad, aunque podría ser más específico.
  options: Record<string, any> = {}; // No usado en la tabla básica de la plantilla

  // --- Propiedades para otras configuraciones (definidas pero NO usadas en la plantilla HTML proporcionada) ---
  optionsBasicNoData = {};
  dataBasicNoData: any[] = [];
  columnsBasicNoData: any[] = [];

  optionsWithCaption = {};
  dataWithCaption: { id: string; name: string; phone: string; company: string; zip: string; city: string; date: string; country: string; }[] = [];
  columnsWithCaption: any[] = [];

  columnsWithFeatures: any[] = [];
  optionsWithFeatures: any = {};
  dataWithFeatures: any[] = [];

  optionsWithoutClass = {};
  dataWithoutClass: { id: string; name: string; phone: string; company: string; zip: string; city: string; date: string; country: string; }[] = [];
  columnsWithoutClass: any[] = [];
  // --- Fin de propiedades no usadas en la plantilla ---


  // Inyecta el servicio AppService
  constructor(private readonly appService: AppService) {}

  ngOnInit(): void {
    // --- Inicialización para la TABLA BÁSICA (la que se muestra) ---
    this.data = this.appService.getData();
    this.columns = [
        { prop: 'id', name: "ID" }, // 'prop' es el nombre estándar en ngx-datatable, aunque 'key' puede funcionar
        { prop: 'name', name: 'Name' },
        { prop: 'phone', name: 'Phone' },
        { prop: 'company', name: 'Company'},
        { prop: 'date', name: 'Date' },
        // { prop: 'phone', name: 'Phone' }, // Columna 'Phone' duplicada, usualmente se quita una. La dejo como en el original.
    ];

    // --- Inicializaciones para las OTRAS TABLAS (no mostradas en el HTML) ---
    this.optionsBasicNoData = {
        emptyDataMessage : 'No data available in table'
    };
    this.dataBasicNoData = []; // Intencionalmente vacío
    this.columnsBasicNoData = [
        { prop: 'id', name: "ID" },
        { prop: 'name', name: 'Name' },
        { prop: 'phone', name: 'Phone' },
        { prop: 'company', name: 'Company'},
        { prop: 'date', name: 'Date' },
        // { prop: 'phone', name: 'Phone' },
    ];

    this.dataWithCaption = this.appService.getData();
    this.columnsWithCaption = [
        { prop: 'id', name: "ID" },
        { prop: 'name', name: 'Name' },
        { prop: 'phone', name: 'Phone' },
        { prop: 'company', name: 'Company'},
        { prop: 'date', name: 'Date' },
        // { prop: 'phone', name: 'Phone' }
    ];

    this.optionsWithFeatures = {
        // rowClickEvent: true, // Esta opción no parece ser estándar de ngx-datatable, se maneja con (activate)
        messages: {
           totalMessage: 'total',
           emptyMessage: 'No data to display' // Mensaje si no hay datos
        },
        limit: 5, // Define cuántas filas por página (equivalente a rowPerPage)
        // Las opciones de menú por página se configuran a menudo fuera de las opciones directas o con plantillas de pie de página.
        // rowPerPageMenu: [5, 10, 20, 30], // No es una opción directa estándar
    };
    this.dataWithFeatures = this.appService.getData();
    // Ajustando la definición de columnas para 'optionsWithFeatures' según ngx-datatable
    // Nota: Las opciones como align, noWrap, sorting, width no son estándar de ngx-datatable, se manejan con CSS o plantillas de celda/cabecera.
    // 'sorting' se habilita/deshabilita a nivel de tabla o por columna con [sortable]="boolean" si se usan características avanzadas.
    // El ancho se controla mejor con CSS o [columnMode]="'flex'" y flexGrow.
    this.columnsWithFeatures = [
        { prop: 'id', name: "ID", width: 50 /* sorting: true */ }, // El sorting se activa globalmente o se anula por columna
        { prop: 'name', name: 'Name', width: 100 },
        { prop: 'phone', name: 'Phone', /* align: { head: 'center' }, */ width: 100, sortable: false }, // Ejemplo de deshabilitar ordenamiento para esta columna
        { prop: 'company', name: 'Company', width: 300, /* sorting: true, align: { head: 'right', body: 'right' }, noWrap: { head: true, body: true } */ },
        { prop: 'date', name: 'Date', sortable: false },
        { prop: 'zip', name: 'ZIP Title with text wrap', width: 80, /* sorting: true, noWrap: { head: true, body: true } */ },
        { prop: 'company', name: 'Company', width: 200, /* noWrap: { head: true, body: true } */ }, // Columna 'Company' duplicada
        { prop: 'zip', name: 'ZIP', sortable: false }, // Columna 'ZIP' duplicada
        { prop: 'date', name: 'Date', sortable: false },// Columna 'Date' duplicada
        { prop: 'zip', name: 'ZIP', sortable: false }  // Columna 'ZIP' triplicada
    ];
    // Nota: Hay varias columnas duplicadas en columnsWithFeatures. Probablemente sea un error en el código original.

    this.dataWithoutClass = this.appService.getData();
    this.columnsWithoutClass = [
        { prop: 'id', name: "ID" },
        { prop: 'name', name: 'Name' },
        { prop: 'phone', name: 'Phone' },
        { prop: 'company', name: 'Company'},
        { prop: 'date', name: 'Date' },
        // { prop: 'phone', name: 'Phone' }
    ];
  }

  // --- Métodos de ejemplo (no conectados en la plantilla básica) ---
  onClickBtn() {
      alert("Hi Add Button !!!!!");
  }

  // Para manejar clics en filas en ngx-datatable, se usa el evento (activate)
  onRowClick(event: any) {
      // El evento 'activate' usualmente tiene la estructura { type: 'click', row: ..., ... }
      if (event.type === 'click') {
          alert(JSON.stringify(event.row));
      }
  }
}
