import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { ControlObservable, PAD_MAX, PadEvent, Position } from '../../interfaces/padControlCanvas.interface';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-control-pad',
  templateUrl: './control-pad.component.html',
  styleUrls: ['./control-pad.component.scss']
})
export class ControlPadComponent implements AfterViewInit, OnChanges {

  @Output() change = new EventEmitter<PadEvent>();
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('scalling') scalling: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;
  isMoving = false;
  @Input('isPersist') isPersist;
  @Input('controlObservable') controlObservable: ControlObservable;
  
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
    if (!this.isPersist) {
      this.canvasService.clearCanvas(this.canvas);
      this.change.emit({ type: 'end' });
    }
  }
  
  private currentPosition: Position = { x: 0, y: PAD_MAX };

  constructor(private canvasService: CanvasService, private destroy$: DestroyService) { }

  ngAfterViewInit(): void {
    this.initCanvas();
    if (this.controlObservable) this.listen();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['isPersist'].currentValue && this.canvas) this.canvasService.clearCanvas(this.canvas);
  }

  private listen(): void {
    this.controlObservable.supplier$.pipe(takeUntil(this.destroy$)).subscribe((value: number) => {
      this.currentPosition = this.controlObservable.consumer(this.currentPosition, value);
      if (this.isPersist) this.draw(this.currentPosition);
    })
  }

  private initCanvas(): void {
    this.canvas.nativeElement.width = PAD_MAX;
    this.canvas.nativeElement.height = PAD_MAX;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d');
    let css: CSSStyleDeclaration = getComputedStyle(this.canvas.nativeElement);
    const colorCss = css.getPropertyValue('color');
    this.canvasCtx.fillStyle = colorCss;
    this.canvasCtx.strokeStyle = '#5dbb033b';
    this.initScalling(colorCss);
  }

  private initScalling(colorCss: string): void {
    this.scalling.nativeElement.width = PAD_MAX;
    this.scalling.nativeElement.height = PAD_MAX;
    const scallingCtx = this.scalling.nativeElement.getContext('2d');
    // axe vertical
    scallingCtx.beginPath();
    scallingCtx.strokeStyle = colorCss;
    scallingCtx.lineWidth = 1;
    for (let i = 0; i < PAD_MAX; i++) {
      if (i % 25 == 0) 
      scallingCtx.moveTo(PAD_MAX, i);
      else
      scallingCtx.lineTo(0, i);
    }
    scallingCtx.stroke();
    // axe horizontal
    scallingCtx.beginPath();
    scallingCtx.strokeStyle = colorCss;
    scallingCtx.lineWidth = 1;
    for (let i = 0; i < PAD_MAX; i++) {
      if (i % 25 == 0) 
      scallingCtx.moveTo(i, 0);
      else
      scallingCtx.lineTo(i, PAD_MAX);
    }
    scallingCtx.stroke();
  }

  onEventStart(event: MouseEvent): void {
    if (!this.isPersist) this.change.emit({ type: 'start', canvas: this.canvas });
    this.isMoving = true;
    this.onEventMove(event);
  }

  onEventMove(event: MouseEvent): void {
    if (this.isMoving) {
      this.currentPosition = this.canvasService.getPositionFromEvent(event, this.canvas);
      this.draw(this.currentPosition);
      this.change.emit({ type: 'move', x: this.currentPosition.x, y: this.currentPosition.y, canvas: this.canvas });
    }
  }

  draw({ x, y }: Position): void {
    this.canvasService.clearCanvas(this.canvas);
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(x, y, 10, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
  }

}
