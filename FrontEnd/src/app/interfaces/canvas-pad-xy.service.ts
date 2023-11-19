import { ElementRef, Injectable } from '@angular/core';
import { Position } from './canvas-pad-xy.interface';

@Injectable({
  providedIn: 'root'
})
export class CanvasPadXYService {

  constructor() { }

  clearCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
    const { width, height } = canvas.nativeElement;
    const ctx: CanvasRenderingContext2D = canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, width, height);
  }

  getPositionFromEvent(event: MouseEvent, canvas: ElementRef<HTMLCanvasElement>): Position {
    const { x, y } = canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.x - x,
      y: event.y - y
    };
  }

  drawFromEvent(event: MouseEvent, canvas: ElementRef<HTMLCanvasElement>): Position {
    this.clearCanvas(canvas);
    const { x, y } = this.getPositionFromEvent(event, canvas);
    const ctx: CanvasRenderingContext2D = canvas.nativeElement.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#5dbb03';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#5dbb033b';
    ctx.stroke();
    return { x, y };
  }
  
}
