import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AudioNodeElement } from 'src/app/interfaces/audio-node-element.interface';
import { CanvasPadXY } from 'src/app/interfaces/canvas-pad-xy.interface';
import { CanvasService } from 'src/app/module-audio-control/services/canvas.service';

@Component({
  selector: 'app-audio-filter',
  templateUrl: './audio-filter.component.html',
  styleUrls: ['./audio-filter.component.scss'],
})
export class AudioFilterComponent implements AfterViewInit, AudioNodeElement, CanvasPadXY {

  @Input('source') gainNode: GainNode;
  @Input('context') audioCtx: AudioContext;
  @ViewChild('canvasfilter') canvasfilter: ElementRef<HTMLCanvasElement>;
  isMoving = false;
  isPersist = false;
  private biquadFilter: BiquadFilterNode;
  private Q_MAX = 75; // private FLOAT32_MAX = 3.4028234663852886e+38;
  private Q_DEFAULT = 1;
  private FREQUENCY_MAX = 24000;
  private FREQUENCY_DEFAULT = 350;

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onClick(): void {
    this.isMoving = false;
    if (!this.isPersist) {
      this.canvasService.clearCanvas(this.canvasfilter);
      this.disconnectNode();
    }
  }

  constructor(private canvasService: CanvasService) { }

  ngAfterViewInit(): void {
    this.canvasfilter.nativeElement.width = 200;
    this.canvasfilter.nativeElement.height = 200;
    this.biquadFilter = this.audioCtx.createBiquadFilter();
  }

  isPersistChange(event: MatSlideToggleChange): void {
    if (!event.checked) {
      this.canvasService.clearCanvas(this.canvasfilter);
      this.disconnectNode();
    } else {
      this.connectNode();
    }
  }

  filterTypeChange(filterTypeSelected: 'allpass' | 'bandpass' | 'highpass' | 'lowpass'): void {
    this.biquadFilter.type = filterTypeSelected;
    if (filterTypeSelected == 'allpass') {
      this.disconnectNode();
      this.canvasService.clearCanvas(this.canvasfilter);
    } else {
      this.connectNode();
    }
  }

  connectNode() {
    this.gainNode.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode.context.destination);
  }

  disconnectNode(): void {
    this.biquadFilter.disconnect(0);
    this.resetParam();
  }

  resetParam(): void {
    this.biquadFilter.frequency.value = this.FREQUENCY_DEFAULT;
    this.biquadFilter.Q.value = this.Q_DEFAULT;
  }

  onEventStart(event: MouseEvent): void {
    if (!this.isPersist) this.connectNode();
    this.isMoving = true;
    this.onEventMove(event);
  }

  onEventMove(event: MouseEvent): void {
    if (this.isMoving) {
      /* const { x, y } = this.canvasService.drawFromEvent(event, this.canvasfilter);
      this.updateFromPosition(x, y); */
    }
  }

  updateFromPosition(x: number, y: number): void {
    const { width, height } = this.canvasfilter.nativeElement;
    const frequency = x / width * this.FREQUENCY_MAX;
    const q = this.Q_MAX * (height - (2 * y)) / height;;
    this.biquadFilter.frequency.value = frequency;
    this.biquadFilter.Q.value = q;
  }

}
