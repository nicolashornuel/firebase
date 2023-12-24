import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BpmService {

  private bpmValue$: BehaviorSubject<number> = new BehaviorSubject<number>(128);

  constructor() { }

  public get getBpmValue$(): Observable<number> {
    return this.bpmValue$.asObservable();
  }

  public setBpmValue$(value: number): void {
    this.bpmValue$.next(value);
  }

  public get getBeatDuration$(): Observable<number> {
    return this.getBpmValue$.pipe(map(bpm => Math.trunc(60000 / bpm)));
  }
}
