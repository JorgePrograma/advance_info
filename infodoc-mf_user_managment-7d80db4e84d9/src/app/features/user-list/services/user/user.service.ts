import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
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
  private readonly defaultPageSize = 100;
  readonly combinedUsers = signal<CombinedUserInfo[]>([]);

  constructor() {
    this.loadAllData();
    effect(() => {
      const combinedData = this.combineData();
      console.log('lista de ', combinedData);
      this.combinedUsers.set(combinedData);
    });
  }

  combineData() {
    const personsMap = new Map<string, Person>(
      this.persons().map((p) => [p.id, p])
    );

    const contactsMap = new Map<string, Contact>(
      this.contacts().map((c) => [c.idPerson, c])
    );

    return this.users().map((user: UserModel) => {
      const employee =
        this.employees().find((e) => e.idUser === user.id) || null;
      const person = employee ? personsMap.get(employee.idPerson) : null;
      const contact = employee ? contactsMap.get(employee.idPerson) : null;

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
              phone: contact.address || '',
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
    const params = (paramName: string) => ({ [paramName]: id });
    const handleResponse = <T>(res: ApiResponse<T>) =>
      res.data?.items?.[0] || null;

    return forkJoin({
      user: fetchApiData<UserModel>(
        EndPoints.USERS,
        params('idPerson'),
        this.http
      ).pipe(
        map(handleResponse),
        tap((userData) => console.log('[User Service] User Data:', userData)),
        catchError((error) => {
          return of(null);
        })
      ),

      person: fetchApiData<Person>(
        EndPoints.PERSONS,
        params('id'),
        this.http
      ).pipe(
        map(handleResponse),
        tap((personData) =>
          console.log('[User Service] Person Data:', personData)
        ),
        catchError((error) => {
          return of(null);
        })
      ),

      employee: fetchApiData<EmployeeInfoModel>(
        EndPoints.EMPLOYEES,
        params('idPerson'),
        this.http
      ).pipe(
        map(handleResponse),
        tap((employeeData) =>
          console.log('[User Service] Employee Data:', employeeData)
        ),
        catchError((error) => {
          return of(null);
        })
      ),

      contact: fetchApiData<Contact>(
        EndPoints.CONTACTS,
        params('idPerson'),
        this.http,
        false
      ).pipe(
        map((res) => res.data?.items?.[0] || null), // Manejo especial para useApiResponse=false
        tap((contactData) =>
          console.log('[User Service] Contact Data:', contactData)
        ),
        catchError((error) => {
          return of(null);
        })
      ),
    }).pipe(
      tap((rawData) =>
        console.log('[User Service] Raw Combined Data:', rawData)
      ),
      map(({ person, employee, user, contact }) => {
        if (!person || !employee || !user || !contact) {
          console.warn('[User Service] Missing data in one or more endpoints');
          return null;
        }

        const combined = combineUserData(person, employee, user, contact);
        console.log('[User Service] usauario creada:', combined);
        return combined;
      }),
      catchError((error) => {
        console.error('[User Service] Error in forkJoin:', error);
        return of(null);
      })
    );
  }

  updateAccountInfo(
    user: UserModel,
    idUser: string
  ): Observable<ApiResponse<string>> {
    return putApiData<string>(
      EndPoints.UPDATE_CONTACT,
      { ...user, idUser },
      this.http
    );
  }
}
