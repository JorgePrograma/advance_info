import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { ApiResponse } from '../../../../shared/interfaces/api-response';
import { Contact } from '../../../../shared/interfaces/contact.model';
import { Employee } from '../../../../shared/interfaces/employee.model';
import { Person } from '../../../../shared/interfaces/person.model';
import { UserModel } from '../../../../shared/interfaces/user.model';
import { EmployeeInfoModel } from '../../../create/model/employee-info.model';
import {
  combineUserData,
  fetchApiData,
  getById,
  putApiData,
} from '../../core/utils/api.utils';
import { CombinedUserInfo } from '../../interfaces/combine-user-info';
import { EndPoints } from '../../../../shared/core/endpoints';

@Injectable({ providedIn: 'root' })
export class UserServiceList {
  private readonly http = inject(HttpClient);

  // State signals
  readonly isLoading = signal(false);
  readonly error = signal<any>(null);

  // Data signals
  private readonly users = signal<UserModel[]>([]);
  private readonly persons = signal<Person[]>([]);
  private readonly employees = signal<Employee[]>([]);
  private readonly contacts = signal<Contact[]>([]);
  private readonly defaultPageSize = 1000;
  readonly combinedUsers = signal<CombinedUserInfo[]>([]);

  constructor() {
    this.loadAllData();
    effect(() => {
      const combinedData = this.combineData();
      this.combinedUsers.set(combinedData);
    });
  }

  combineData(): CombinedUserInfo[] {
    // Crear mapas para acceso rápido por ID
    const personsMap = new Map<string, Person>(
      this.persons().map((p) => [p.id, p])
    );

    const contactsMap = new Map<string, Contact>(
      this.contacts().map((c) => [c.idPerson, c])
    );

    // Combinar la información de usuarios, empleados, personas y contactos
    return this.users().map((user: UserModel) => {
      // Buscar el empleado correspondiente al usuario
      const employee = this.employees().find((e) => e.idUser === user.id) || null;

      // Buscar la persona y el contacto asociados al empleado (si existe)
      const person = employee ? personsMap.get(employee.idPerson) || null : null;
      const contact = employee ? contactsMap.get(employee.idPerson) || null : null;

      // Armar el objeto combinado
      return {
        user: {
          id: user.id,
          idUserIDCS: user.idUserIDCS,
          avatarPath: user.avatarPath || 'none',
          userName: user.userName,
          creationDate: user.creationDate,
          state: user.state || 'inactive',
          roles: user.roles || [],
        },
        employee: employee
          ? {
              id: employee.id,
              idPerson: employee.idPerson,
              bussinesEmail: employee.bussinesEmail,
              bussinesPhone: employee.bussinesPhone,
            }
          : null,
        person: person
          ? {
              id: person.id,
              documentNumber: person.documentNumber || '',
              documentType: person.documentType || '',
              middleName: person.middleName || '',
              secondLastName: person.secondLastName || '',
              firstName: person.firstName || '',
              lastName: person.lastName || '',
            }
          : null,
        contact: contact
          ? {
              id: contact.id,
              address: contact.address || '',
              idPerson: contact.idPerson,
              email: contact.email || '',
              phone: contact.phone || '', // Corregido aquí
            }
          : null,
      } as CombinedUserInfo;
    });
  }


  loadAllData() {
    this.isLoading.set(true);
    forkJoin([
      fetchApiData<UserModel>(
        EndPoints.USERS,
        { pageNumber: 1, pageSize: this.defaultPageSize },
        this.http
      ),
      fetchApiData<Person>(
        EndPoints.PERSONS,
        { pageNumber: 1, pageSize: this.defaultPageSize },
        this.http
      ),
      fetchApiData<Employee>(
        EndPoints.EMPLOYEES,
        { pageNumber: 1, pageSize: this.defaultPageSize },
        this.http
      ),
      fetchApiData<Contact>(
        EndPoints.CONTACTS,
        { pageNumber: 1, pageSize: this.defaultPageSize },
        this.http,
        false
      ),
    ]).subscribe(([usersRes, personsRes, employeesRes, contactsRes]) => {
      this.users.set(usersRes.data.items);
      this.persons.set(personsRes.data.items);
      this.employees.set(employeesRes.data.items);
      this.contacts.set(contactsRes.data.items);
      this.isLoading.set(false);
    });
  }

  getUserById(id: string): Observable<CombinedUserInfo | null> {
    // Helper para construir parámetros de búsqueda
    const params = (paramName: string) => ({ [paramName]: id });
    // Helper para extraer el primer item de la respuesta
    const handleResponse = <T>(res: ApiResponse<T>) => res.data?.items?.[0] || null;

    // 1. Buscar el empleado (necesitamos idPerson para buscar user, contact)
    const employee$ = fetchApiData<EmployeeInfoModel>(
      EndPoints.EMPLOYEES,
      params('idUser'),
      this.http
    ).pipe(
      map(handleResponse),
      tap(emp => console.log('[User Service] Employee Data:', emp)),
      catchError(() => of(null))
    );

    // 2. Buscar el usuario, la persona y el contacto, usando el idPerson obtenido del empleado
    return employee$.pipe(
      switchMap(employee => {
        if (!employee || !employee.idPerson) {
          console.warn('[User Service] No se encontró empleado o idPerson');
          return of(null);
        }

        const idPerson = employee.idPerson;

        // Llamadas paralelas para user, person y contact
        return forkJoin({
          user: fetchApiData<UserModel>(
            EndPoints.USERS,
            { id },
            this.http
          ).pipe(
            map(handleResponse),
            tap(userData => console.log('[User Service] User Data:', userData)),
            catchError(() => of(null))
          ),
          person: fetchApiData<Person>(
            EndPoints.PERSONS,
            { id: idPerson },
            this.http
          ).pipe(
            map(handleResponse),
            tap(personData => console.log('[User Service] Person Data:', personData)),
            catchError(() => of(null))
          ),
          contact: fetchApiData<Contact>(
            EndPoints.CONTACTS,
            { idPerson },
            this.http,
            false
          ).pipe(
            map(res => res.data?.items?.[0] || null),
            tap(contactData => console.log('[User Service] Contact Data:', contactData)),
            catchError(() => of(null))
          ),
          employee: of(employee) // Ya lo tenemos
        }).pipe(
          map(({ user, person, employee, contact }) => {
            if (!user || !person || !employee || !contact) {
              console.warn('[User Service] Missing data in one or more endpoints');
              return null;
            }
            const combined = combineUserData(person, employee, user, contact);
            console.log('[User Service] Usuario combinado:', combined);
            return combined;
          }),
          catchError(error => {
            console.error('[User Service] Error in forkJoin:', error);
            return of(null);
          })
        );
      })
    );
  }


  updateAccountInfo(
    user: UserModel,
    idUser: string
  ): Observable<ApiResponse<string>> {
    console.log("actualizando usuario", user)
    console.log("id usuario  es ", idUser)
    console.log("api para actualizar es", EndPoints.UPDATE_USERS)
    return putApiData<string>(
      EndPoints.UPDATE_USERS,
      { ...user, idUser },
      this.http
    );
  }
}
