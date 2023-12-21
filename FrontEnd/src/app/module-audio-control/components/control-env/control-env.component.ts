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
  }

  private positions: { attack: Position, release: Position };
  private readonly PAD_MAX = 100;
  private readonly PAD_PADDING = 10;
  private readonly CONTENT = this.PAD_MAX - this.PAD_PADDING;
  private readonly GEOMETRY = {
    container: 100,
    content: 80,
    max: 90,
    min: 10,
    diameter: 3
  }

  constructor(private canvasService: CanvasService, private destroy$: DestroyService) { }

  ngAfterViewInit(): void {
    this.initCanvas();
    if (this.envParam.subValue$) this.listen();
  }

  private listen(): void {
    this.envParam.subValue$.pipe(takeUntil(this.destroy$)).subscribe((value: number) => {
      this.positions = this.envParam.updatePosition(value, this.GEOMETRY);
      this.draw(this.positions);
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
    this.isMoving = true;
    this.onEventMove(event);
  }

  onEventMove(event: MouseEvent): void {
    if (this.isMoving) {
      const { x, y } = this.canvasService.getPositionFromEvent(event, this.canvas);
      if (x <= this.GEOMETRY.max && x >= this.GEOMETRY.min && y <= this.GEOMETRY.max && y >= this.GEOMETRY.min) {
        if (y > this.positions.attack.y - this.GEOMETRY.diameter && y < this.positions.attack.y + this.GEOMETRY.diameter
          && x > this.positions.attack.x - this.GEOMETRY.diameter && x < this.positions.attack.x + this.GEOMETRY.diameter) {
          this.positions.attack = { x, y: this.GEOMETRY.min };
          this.draw({ attack: this.positions.attack, release: this.positions.release });
          this.envParam.onEventMove(this.positions.attack.x, this.positions.release.x, this.positions.release.y, this.GEOMETRY);
        } else if (y > this.positions.release.y - this.GEOMETRY.diameter && y < this.positions.release.y + this.GEOMETRY.diameter
          && x > this.positions.release.x - this.GEOMETRY.diameter && x < this.positions.release.x + this.GEOMETRY.diameter) {
          this.positions.release = { x, y };
          this.draw({ attack: this.positions.attack, release: this.positions.release });
         this.envParam.onEventMove(this.positions.attack.x, this.positions.release.x, this.positions.release.y, this.GEOMETRY);
        }
      }
    }
  }

  draw({ attack, release }: { attack: Position, release: Position }): void {
    this.canvasService.clearCanvas(this.canvas);
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(this.GEOMETRY.min, this.GEOMETRY.max);
    this.canvasCtx.lineTo(attack.x, attack.y);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
    // arc
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(attack.x, attack.y, this.GEOMETRY.diameter, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(attack.x, attack.y);
    this.canvasCtx.lineTo(release.x, release.y);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
    // arc
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(release.x, release.y, this.GEOMETRY.diameter, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(release.x, release.y);
    this.canvasCtx.lineTo(this.GEOMETRY.max, this.GEOMETRY.max);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
  }

}
