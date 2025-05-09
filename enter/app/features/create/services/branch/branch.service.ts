import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { BranchModel } from "../../model/branch.model";
import { ResponseModel } from "../../model/response.model";
import { EndPoints } from "../../../../shared/core/endpoints";

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  // Señal privada para el estado interno
  private readonly _branches = signal<BranchModel[]>([]);

  // Señal pública de solo lectura
  public readonly branchSignal = this._branches.asReadonly();

  constructor(private readonly http: HttpClient) { }

  getAllBranches(): Observable<BranchModel[]> {
    return this.http.get<ResponseModel<string>>(EndPoints.GET_ALL_BRANCHES).pipe(
      map(response => {
        try {
          const parsedData = JSON.parse(response.data) as { branches: BranchModel[] };
          return parsedData.branches || [];
        } catch (error) {
          return [];
        }
      }),
      tap(branches => {
        this._branches.set(branches);
      }),
      catchError(error => {
        return of([]);
      })
    );
  }
}
