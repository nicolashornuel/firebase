import { ElementRef, Injectable } from '@angular/core';

export interface Position {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor() { }

  clearCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
    const { width, height } = canvas.nativeElement;
    const ctx: CanvasRenderingContext2D = canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, width, height);
  }

  getPosition(event: MouseEvent, canvas: ElementRef<HTMLCanvasElement>): Position {
    const { x, y } = canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.x - x,
      y: event.y - y
    };
  }

}
