import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CanvasService, Position } from '../../services/canvas.service';

@Component({
  selector: 'app-node-filter',
  templateUrl: './node-filter.component.html',
  styleUrls: ['./node-filter.component.scss']
})
export class NodeFilterComponent implements AfterViewInit {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gain: GainNode;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;
  private filter: BiquadFilterNode;

  isMoving = false;
  isPersist = false;
  private Q_MAX = 75; // FLOAT32_MAX = 3.4028234663852886e+38;
  private Q_DEFAULT = 1;
  private FREQUENCY_MAX = 24000;
  private FREQUENCY_DEFAULT = 350;

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
    if (!this.isPersist) {
      this.canvasService.clearCanvas(this.canvas);
      this.disconnectNode();
    }
  }

  constructor(private canvasService: CanvasService) { }

  ngAfterViewInit(): void {
    this.initNode();
    this.initCanvas();
  }

  private initNode(): void {
    this.filter = this.audioCtx.createBiquadFilter();
  }

  private initCanvas(): void {
    this.canvas.nativeElement.width = 200;
    this.canvas.nativeElement.height = 200;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d');
  }

  isPersistChange(event: MatSlideToggleChange): void {
    if (!event.checked) {
      this.canvasService.clearCanvas(this.canvas);
      this.disconnectNode();
    } else {
      this.connectNode();
    }
  }

  filterTypeChange(filterTypeSelected: 'allpass' | 'bandpass' | 'highpass' | 'lowpass'): void {
    this.filter.type = filterTypeSelected;
    if (filterTypeSelected == 'allpass') {
      this.disconnectNode();
      this.canvasService.clearCanvas(this.canvas);
    } else {
      this.connectNode();
    }
  }

  connectNode() {
    this.gain.connect(this.filter);
    this.filter.connect(this.gain.context.destination);
  }

  disconnectNode(): void {
    this.filter.disconnect(0);
    this.resetParam();
  }

  resetParam(): void {
    this.filter.frequency.value = this.FREQUENCY_DEFAULT;
    this.filter.Q.value = this.Q_DEFAULT;
  }

  onEventStart(event: MouseEvent): void {
    if (!this.isPersist) this.connectNode();
    this.isMoving = true;
    this.onEventMove(event);
  }

  onEventMove(event: MouseEvent): void {
    if (this.isMoving) {
      const { x, y } = this.draw(event, this.canvas);
      this.updateFromPosition(x, y);
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

  updateFromPosition(x: number, y: number): void {
    const { width, height } = this.canvas.nativeElement;
    const frequency = x / width * this.FREQUENCY_MAX;
    const q = this.Q_MAX * (height - (2 * y)) / height;;
    this.filter.frequency.value = frequency;
    this.filter.Q.value = q;
  }

}