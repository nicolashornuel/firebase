import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BpmService {
  private bpmValue$: BehaviorSubject<number> = new BehaviorSubject<number>(128);

  constructor() {}

  public setBpmValue$(value: number): void {
    this.bpmValue$.next(value);
  }

  public get getBpmValue$(): Observable<number> {
    return this.bpmValue$.asObservable();
  }

  public get getBeatDuration$(): Observable<number> {
    return this.getBpmValue$.pipe(map(bpm => Math.trunc(15000 / bpm)));
  }

  public get getInterval$(): Observable<number> {
    return this.getBeatDuration$.pipe(switchMap((beatDuration: number) => interval(beatDuration)));
  }

  public get getCurrent$(): Observable<number> {
    return this.getInterval$.pipe(map((counter: number) => counter % 16));
  }
}
