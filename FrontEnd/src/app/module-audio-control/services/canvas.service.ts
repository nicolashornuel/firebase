import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Position } from '../interfaces/padControlCanvas.interface';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

/*   private position$: BehaviorSubject<Position> = new BehaviorSubject<Position>({ x: 0, y: 0 });
 */
  constructor() { }
/* 
  public get getPosition$(): Observable<Position> {
    return this.position$.asObservable();
  }

  public setPosition$(position: Position): void {
    this.position$.next(position);
  } */

  public clearCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
    const { width, height } = canvas.nativeElement;
    const ctx: CanvasRenderingContext2D = canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, width, height);
  }

  public getPositionFromEvent(event: MouseEvent, canvas: ElementRef<HTMLCanvasElement>): Position {
    const { x, y } = canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.x - x,
      y: event.y - y
    };
  }

}
