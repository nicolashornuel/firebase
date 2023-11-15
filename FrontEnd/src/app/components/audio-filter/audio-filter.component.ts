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
  private ctxCanvas: CanvasRenderingContext2D | null;
  private FLOAT32_MAX = 3.4028234663852886e+38;
  private MAX = 50;

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
  }

  ngAfterViewInit(): void {
    this.canvasfilter.nativeElement.width = 100;
    this.canvasfilter.nativeElement.height = 100;
    this.biquadFilter = this.audioCtx.createBiquadFilter();
  }

  onChangeType(filterTypeSelected: 'allpass' | 'bandpass' | 'highpass' | 'lowpass'): void {
    if (filterTypeSelected == 'allpass') {
      this.biquadFilter.disconnect(0);
    }
    this.biquadFilter.type = filterTypeSelected;
    this.gainNode.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode.context.destination)
  }

  onXYPad(event: MouseEvent, eventType: 'start' | 'move'): void {
    switch (eventType) {
      case 'start':
        this.isMoving = true;
        this.draw(event);
        break;
      case 'move':
        this.draw(event);
        break;
      default:
        break;
    }
  }

  private getCursorPosition(event: MouseEvent, canvas: ElementRef<HTMLCanvasElement>): Position {
    const rect = canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.x - rect.x,
      y: event.y - rect.y
    };
  }

  private draw(event: MouseEvent): void {
    if (this.isMoving) {
      const canvas: HTMLCanvasElement = this.canvasfilter.nativeElement;
      const ctx: CanvasRenderingContext2D = this.canvasfilter.nativeElement.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'green';
      const { x, y } = this.getCursorPosition(event, this.canvasfilter);

            //https://jsfiddle.net/razh/sA6Wc/  => dégradé
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#399447';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#3994473b';
      ctx.stroke();


      this.updateFilterFromPad(x, y);
    }
  }

  private updateFilterFromPad(x: number, y: number): void {
    const canvas: HTMLCanvasElement = this.canvasfilter.nativeElement;
    const frequency = x / canvas.width * 24000;
    const qValue = (canvas.height / 2) - y;
    //const qValue2 = 2 * qValue / canvas.height;    
    //const qValue2 = 2 * ((canvas.height / 2) - y) / canvas.height;    
    const qValue2 = (canvas.height - ( 2 * y)) / canvas.height;    
    const q = this.MAX * (canvas.height - ( 2 * y)) / canvas.height;;
    console.log(q);
    
    this.biquadFilter.frequency.value = frequency;
    //this.biquadFilter.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    this.biquadFilter.Q.value = q;
  }


}
