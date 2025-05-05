import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LocationService } from '../../services/location/location.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoComponent implements OnInit {
  @Input({ required: true }) formGroupRef!: FormGroup;
  
  // Servicios
  private readonly locationService = inject(LocationService);
  private readonly locationSignal = this.locationService.datosGeograficosSignal;
  isDirectoryActive = signal<boolean>(false);

  locationOptions = computed(() => {
    const countries = this.locationSignal();
    return countries.map((item) => ({
      value: item.name,
      label: item.name,
    }));
  });

  protected selectedCountry = signal<string>('');
  protected selectedDepartment = signal<string>('');

  departmentOptions = computed(() => {
    const countries = this.locationSignal();
    const selectedCountryData = countries.find(
      (c) => c.name === this.selectedCountry()
    );
    return (
      selectedCountryData?.states.map((d) => ({
        value: d.name,
        label: d.name,
      })) || []
    );
  });

  cityOptions = computed(() => {
    const countries = this.locationSignal();
    const selectedCountryData = countries.find(
      (c) => c.name === this.selectedCountry()
    );
    const departament = selectedCountryData?.states.find(
      (c) => c.name === this.selectedDepartment()
    );
    const cities =
      departament?.cities.map((city) => ({
        value: city.id,
        label: city.name,
      })) || [];
    return cities;
  });

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.locationService.getAllCountries().subscribe();
    this.setupCountryListener();
    this.setupDepartmentListener();
  }

  private setupCountryListener() {
    const countryControl = this.formGroupRef.get('country');
    if (countryControl) {
      countryControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.selectedCountry.set(value); // Actualizar la señal con el valor seleccionado
          this.updateDepartments();
        });
    }
  }

  private setupDepartmentListener() {
    const departmentControl = this.formGroupRef.get('department');
    if (departmentControl) {
      departmentControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.selectedDepartment.set(value); // Actualizar la señal con el valor seleccionado
          this.updateCities();
        });
    }
  }

  private updateDepartments() {
    const departmentControl = this.formGroupRef.get('department');
    if (departmentControl) {
      if (!this.selectedCountry()) {
        departmentControl.disable(); // Deshabilitar si no hay país seleccionado
        console.log(
          'Departamento deshabilitado porque no hay país seleccionado.'
        );
      } else {
        departmentControl.reset();
        departmentControl.enable(); // Habilitar el control si se seleccionó un país
        console.log('Departamentos actualizados:', [
          ...this.departmentOptions(),
        ]);
      }
    }

    // Resetear el control de ciudad
    const cityControl = this.formGroupRef.get('city');
    if (cityControl) {
      cityControl.reset();
      cityControl.disable(); // Deshabilitar hasta que se seleccione un departamento
    }

    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  private updateCities() {
    const cityControl = this.formGroupRef.get('city');
    if (cityControl) {
      if (!this.selectedDepartment()) {
        cityControl.disable(); // Deshabilitar si no hay departamento seleccionado
        console.log(
          'Ciudad deshabilitada porque no hay departamento seleccionado.'
        );
      } else {
        cityControl.reset();
        cityControl.enable(); // Habilitar el control si se seleccionó un departamento
        console.log('Ciudades actualizadas:', [...this.cityOptions()]);
      }
    }

    this.cdr.detectChanges(); // Forzar detección de cambios
  }
}
