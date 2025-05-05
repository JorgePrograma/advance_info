import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { ResponseModel } from "../../model/response.model";
import { EndPoints } from "../../../../shared/core/endpoints";

// Modelo para Ciudad
interface Ciudad {
  id: string;
  name: string;
}

// Modelo para Estado/Departamento
interface Estado {
  id: number;
  name: string;
  cities: Ciudad[];
}

// Modelo para País
interface Pais {
  name: string;
  states: Estado[];
}

// Modelo para la respuesta completa
interface DatosGeograficos {
  countries: Pais[];
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  // Señal privada para el estado interno
  private readonly _countriesSignal = signal<Pais[]>([]);

  // Señal pública de solo lectura
  public readonly datosGeograficosSignal = this._countriesSignal.asReadonly();

  constructor(private readonly http: HttpClient) { }

  getAllCountries(): Observable<Pais[]> {
    return this.http.get<ResponseModel<string>>(EndPoints.GET_ALL_LOCATIONS).pipe(
      map(response => {
        try {
          const parsedData = JSON.parse(response.data) as DatosGeograficos;
          this._countriesSignal.set(parsedData.countries);
          return parsedData.countries || [];
        } catch (error) {
          console.error('Error parseando JSON:', error);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }

  getStates(countryName: string): Estado[] {
    const datos = this._countriesSignal();
    if (!datos) return [];

    const country = datos.find(c => c.name === countryName);
    return country?.states || [];
  }

  getCities(countryName: string, stateName: string): Ciudad[] {
    const states = this.getStates(countryName);
    const state = states.find(s => s.name === stateName);
    return state?.cities || [];
  }
}
