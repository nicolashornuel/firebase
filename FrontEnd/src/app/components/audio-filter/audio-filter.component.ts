import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

export interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'app-audio-filter',
  templateUrl: './audio-filter.component.html',
  styleUrls: ['./audio-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AudioFilterComponent implements AfterViewInit {

  @Input('source') gainNode: GainNode | undefined;
  @Input('context') audioCtx: AudioContext | undefined;
  private biquadFilter: BiquadFilterNode;
  isMoving: boolean = false;
  @ViewChild('canvasfilter') canvasfilter: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null;
  private FLOAT32_MAX = 3.4028234663852886e+38;
  private MAX = 75;
  public isPersist = false;
  private isConnected = false;

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
    if (!this.isPersist) {
      this.clear();
      this.deconnect();
    }
  }

  ngAfterViewInit(): void {
    this.canvasfilter.nativeElement.width = 200;
    this.canvasfilter.nativeElement.height = 200;
    this.ctx = this.canvasfilter.nativeElement.getContext('2d');
    this.biquadFilter = this.audioCtx.createBiquadFilter();
  }

  onChangeType(filterTypeSelected: 'allpass' | 'bandpass' | 'highpass' | 'lowpass'): void {
    this.biquadFilter.type = filterTypeSelected;
    if (filterTypeSelected == 'allpass') {
      this.deconnect();
      this.clear();
    } else {
      this.connect();
    }
  }

  onXYPad(event: MouseEvent, eventType: 'start' | 'move'): void {
    switch (eventType) {
      case 'start':
        this.isMoving = true;
        this.draw(event);
        if (!this.isPersist) {
          this.connect()
        }
        break;
      case 'move':
        this.draw(event);
        break;
      default:
        break;
    }
  }

  private connect() {
    this.gainNode.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode.context.destination);
    this.isConnected = true;
  }

  private deconnect() {
    this.biquadFilter.disconnect(0);
    this.isConnected = false;
    this.reset();
  }

  private reset() {
    this.biquadFilter.frequency.value = 350;
    this.biquadFilter.Q.value = 1;
  }

  private clear() {
    const { width, height } = this.canvasfilter.nativeElement;
    this.ctx.clearRect(0, 0, width, height);
  }

  private getCursorPosition(event: MouseEvent): Position {
    const rect = this.canvasfilter.nativeElement.getBoundingClientRect();
    return {
      x: event.x - rect.x,
      y: event.y - rect.y
    };
  }

  private draw(event: MouseEvent): void {
    if (this.isMoving) {
      this.clear();
      this.ctx.strokeStyle = 'green';
      const { x, y } = this.getCursorPosition(event);
      //https://jsfiddle.net/razh/sA6Wc/  => dégradé
      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
      this.ctx.fillStyle = '#5dbb03';
      this.ctx.fill();
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = '#5dbb033b';
      this.ctx.stroke();
      this.updateFilterFromPad(x, y);
    }
  }

  private updateFilterFromPad(x: number, y: number): void {
    const { width, height } = this.canvasfilter.nativeElement;
    const frequency = x / width * 24000;
    const q = this.MAX * (height - (2 * y)) / height;;
    this.biquadFilter.frequency.value = frequency;
    this.biquadFilter.Q.value = q;
  }


}
