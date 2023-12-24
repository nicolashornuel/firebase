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
  @ViewChild('container') container: ElementRef<HTMLElement>;
  private canvasCtx: CanvasRenderingContext2D;
  isMoving = false;
  @Input('envParam') envParam;

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
  }

  private positions: { attack: Position, release: Position };
  public readonly GEO = {
    w: 200,
    h: 100,
    vw: 180,
    vh: 80,
    mw: 190,
    mh: 90,
    min: 10,
    dia: 5
  }

  constructor(private canvasService: CanvasService, private destroy$: DestroyService) { }

  ngAfterViewInit(): void {
    this.initCanvas();
    if (this.envParam.subValue$) this.listen();
  }

  private listen(): void {
    this.envParam.subValue$.pipe(takeUntil(this.destroy$)).subscribe((value: number) => {
      this.positions = this.envParam.updatePosition(value, this.GEO);
      this.draw(this.positions);
    });
  }

  private initCanvas(): void {
    this.envParam.canvas = this.canvas
    this.canvas.nativeElement.width = this.GEO.w;
    this.canvas.nativeElement.height = this.GEO.h;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d');
    let css: CSSStyleDeclaration = getComputedStyle(this.canvas.nativeElement);
    const colorCss = css.getPropertyValue('color');
    this.canvasCtx.fillStyle = colorCss;
    this.canvasCtx.strokeStyle = colorCss;
    this.initScalling(colorCss);
  }

  private initScalling(colorCss: string): void {
    this.scalling.nativeElement.width = this.GEO.w;
    this.scalling.nativeElement.height = this.GEO.h;
    const scallingCtx = this.scalling.nativeElement.getContext('2d');
    // axe vertical
    scallingCtx.beginPath();
    scallingCtx.strokeStyle = colorCss;
    scallingCtx.lineWidth = 1;
    for (let i = 0; i < this.GEO.h; i++) {
      if (i % 10 == 0)
        scallingCtx.moveTo(this.GEO.w, i);
      else
        scallingCtx.lineTo(0, i);
    }
    scallingCtx.stroke();
    // axe horizontal
    scallingCtx.beginPath();
    scallingCtx.strokeStyle = colorCss;
    scallingCtx.lineWidth = 1;
    for (let i = 0; i < this.GEO.w; i++) {
      if (i % 10 == 0)
        scallingCtx.moveTo(i, 0);
      else
        scallingCtx.lineTo(i, this.GEO.h);
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
      if (y > this.positions.attack.y - this.GEO.dia && y < this.positions.attack.y + this.GEO.dia
        && x > this.positions.attack.x - this.GEO.dia && x < this.positions.attack.x + this.GEO.dia) {
        this.positions.attack.x = x;
        this.normalizeMove({ x, y });
      } else if (y > this.positions.release.y - this.GEO.dia && y < this.positions.release.y + this.GEO.dia
        && x > this.positions.release.x - this.GEO.dia && x < this.positions.release.x + this.GEO.dia) {
        this.positions.release = { x, y };
        this.normalizeMove({ x, y });
      }
    }
  }

  normalizeMove({ x, y }: Position): void {
    if (x <= this.GEO.mw && x >= this.GEO.min && y <= this.GEO.mh && y >= this.GEO.min) {
      this.draw({ attack: this.positions.attack, release: this.positions.release });
      this.envParam.onEventMove(this.positions.attack.x, this.positions.release.x, this.positions.release.y, this.GEO);
    }
  }

  draw({ attack, release }: { attack: Position, release: Position }): void {
    this.canvasService.clearCanvas(this.canvas);
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(this.GEO.min, this.GEO.mh);
    this.canvasCtx.lineTo(attack.x, this.GEO.min);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
    // arc
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(attack.x, this.GEO.min, 3, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(attack.x, this.GEO.min);
    this.canvasCtx.lineTo(release.x, release.y);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
    // arc
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(release.x, release.y, 3, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();
    // line
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.moveTo(release.x, release.y);
    this.canvasCtx.lineTo(this.GEO.mw, this.GEO.mh);
    this.canvasCtx.stroke();
    this.canvasCtx.stroke();
  }

}
