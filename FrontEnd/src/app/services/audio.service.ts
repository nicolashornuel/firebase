import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  public get getIsPlaying$(): Observable<boolean> {
    return this.isPlaying$.asObservable();
  }

  public setIsPlaying(isPlaying: boolean): void {
    this.isPlaying$.next(isPlaying);
  }

}
