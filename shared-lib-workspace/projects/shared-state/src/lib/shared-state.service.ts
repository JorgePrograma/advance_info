import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  private readonly stateSource = new BehaviorSubject<string[]>([]);

  state$ = this.stateSource.asObservable();

  update(states: string[]): void {
    this.stateSource.next(states);
  }
}
