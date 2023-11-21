import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { CanvasService, Position } from '../../services/canvas.service';

@Component({
  selector: 'app-control-pad',
  templateUrl: './control-pad.component.html',
  styleUrls: ['./control-pad.component.scss']
})
export class ControlPadComponent implements OnInit {

  @Output() change = new EventEmitter<{ type: 'end' | 'start' | 'move', x?: number, y?: number }>();
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;
  isMoving = false;
  isPersist = false;
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
    if (!this.isPersist) {
      this.canvasService.clearCanvas(this.canvas);
      this.change.emit({ type: 'end' });
    }
  }

  constructor(private canvasService: CanvasService) { }

  ngOnInit(): void {
  }

  onEventStart(event: MouseEvent): void {
    if (!this.isPersist) this.change.emit({ type: 'start' });
    this.isMoving = true;
    this.onEventMove(event);
  }

  onEventMove(event: MouseEvent): void {
    if (this.isMoving) {
      const { x, y } = this.draw(event, this.canvas);
      this.change.emit({ type: 'move', x, y });
    }
  }
  draw(event: MouseEvent, canvas: ElementRef<HTMLCanvasElement>): Position {
    this.canvasService.clearCanvas(canvas);
    const { x, y } = this.canvasService.getPosition(event, canvas);
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
    let css: CSSStyleDeclaration = getComputedStyle(canvas.nativeElement);
    this.canvasCtx.fillStyle = css.getPropertyValue('color');
    this.canvasCtx.fill();
    this.canvasCtx.lineWidth = 5;
    this.canvasCtx.strokeStyle = '#5dbb033b';
    this.canvasCtx.stroke();
    return { x, y };
  }

}
