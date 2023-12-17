import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainGainService {

  private mainGainValue$: BehaviorSubject<number> = new BehaviorSubject<number>(0.03);
  private bpmValue$: BehaviorSubject<number> = new BehaviorSubject<number>(128);

  constructor() { }

  public get getMainGainValue$(): Observable<number> {
    return this.mainGainValue$.asObservable();
  }

  public setMainGainValue$(value: number): void {
    this.mainGainValue$.next(value);
  }

  public get getBpmValue$(): Observable<number> {
    return this.bpmValue$.asObservable();
  }

  public setBpmValue$(value: number): void {
    this.bpmValue$.next(value);
  }

}
