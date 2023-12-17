import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { PadParam, PAD_MAX, Position } from '../../interfaces/padControlCanvas.interface';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-control-env',
  templateUrl: './control-env.component.html',
  styleUrls: ['./control-env.component.scss']
})
export class ControlEnvComponent implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('scalling') scalling: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;
  isMoving = false;
  @Input('envParam') envParam;

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
    //this.envParam.onEventEnd();
  }

  private currentPositions: { attackPosition: Position, releasePosition: Position };
  private readonly PAD_MAX = 100;

  constructor(private canvasService: CanvasService, private destroy$: DestroyService) { }

  ngAfterViewInit(): void {
    this.initCanvas();
    if (this.envParam.subValue$) this.listen();
  }

  private listen(): void {
    this.envParam.subValue$.pipe(takeUntil(this.destroy$)).subscribe((value: number) => {
      this.currentPositions = this.envParam.updatePosition(value, this.PAD_MAX);
      this.draw(this.currentPositions);
    });
  }

  private initCanvas(): void {
    this.envParam.canvas = this.canvas
    this.canvas.nativeElement.width = this.PAD_MAX;
    this.canvas.nativeElement.height = this.PAD_MAX;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d');
    let css: CSSStyleDeclaration = getComputedStyle(this.canvas.nativeElement);
    const colorCss = css.getPropertyValue('color');
    this.canvasCtx.fillStyle = colorCss;
    this.canvasCtx.strokeStyle = colorCss;
    this.initScalling(colorCss);
  }

  private initScalling(colorCss: string): void {
    this.scalling.nativeElement.width = this.PAD_MAX;
    this.scalling.nativeElement.height = this.PAD_MAX;
    const scallingCtx = this.scalling.nativeElement.getContext('2d');
    // axe vertical
    scallingCtx.beginPath();
    scallingCtx.strokeStyle = colorCss;
    scallingCtx.lineWidth = 1;
    for (let i = 0; i < this.PAD_MAX; i++) {
      if (i % 10 == 0)
        scallingCtx.moveTo(this.PAD_MAX, i);
      else
        scallingCtx.lineTo(0, i);
    }
    scallingCtx.stroke();
    // axe horizontal
    scallingCtx.beginPath();
    scallingCtx.strokeStyle = colorCss;
    scallingCtx.lineWidth = 1;
    for (let i = 0; i < this.PAD_MAX; i++) {
      if (i % 10 == 0)
        scallingCtx.moveTo(i, 0);
      else
        scallingCtx.lineTo(i, this.PAD_MAX);
    }
    scallingCtx.stroke();
  }

  onEventStart(event: MouseEvent): void {
    //this.envParam.onEventStart();
    this.isMoving = true;
    this.onEventMove(event);
  }

  onEventMove(event: MouseEvent): void {
    if (this.isMoving) {
      const { x, y } = this.canvasService.getPositionFromEvent(event, this.canvas);
      if (y > this.currentPositions.attackPosition.y - 5 && y < this.currentPositions.attackPosition.y + 5
        && x > this.currentPositions.attackPosition.x - 5 && x < this.currentPositions.attackPosition.x + 5) {
        this.currentPositions.attackPosition = { x, y };
        this.currentPositions.releasePosition.y = y;
        this.draw({ attackPosition: this.currentPositions.attackPosition, releasePosition: this.currentPositions.releasePosition });
      } else if (y > this.currentPositions.releasePosition.y - 5 && y < this.currentPositions.releasePosition.y + 5
        && x > this.currentPositions.releasePosition.x - 5 && x < this.currentPositions.releasePosition.x + 5) {
        this.currentPositions.attackPosition.y = y;
        this.currentPositions.releasePosition = { x, y };
        this.draw({ attackPosition: this.currentPositions.attackPosition, releasePosition: this.currentPositions.releasePosition });
      }
      this.envParam.onEventMove(this.currentPositions.attackPosition.x, this.currentPositions.releasePosition.x, y, this.PAD_MAX);
    }
  }

  draw({ attackPosition, releasePosition }: { attackPosition: Position, releasePosition: Position }): void {
    this.canvasService.clearCanvas(this.canvas);
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(0, this.PAD_MAX);
    this.canvasCtx.lineTo(attackPosition.x, attackPosition.y);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
    // arc
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(attackPosition.x, attackPosition.y, 5, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(attackPosition.x, attackPosition.y);
    this.canvasCtx.lineTo(releasePosition.x, releasePosition.y);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
    // arc
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(releasePosition.x, releasePosition.y, 5, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(releasePosition.x, releasePosition.y);
    this.canvasCtx.lineTo(this.PAD_MAX, this.PAD_MAX);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
  }

}
