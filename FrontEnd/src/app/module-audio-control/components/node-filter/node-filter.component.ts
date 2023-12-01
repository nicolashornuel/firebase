import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { PadEvent, PadControlable } from '../../interfaces/padControlCanvas.interface';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-node-filter',
  templateUrl: './node-filter.component.html',
  styleUrls: ['./node-filter.component.scss']
})
export class NodeFilterComponent implements AfterViewInit, AudioNodeElement, PadControlable {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gainNode: GainNode;
  canvas: ElementRef<HTMLCanvasElement>;
  isPersist = false;
  private filterNode: BiquadFilterNode;
  private readonly Q_MAX = 75; // FLOAT32_MAX = 3.4028234663852886e+38;
  private readonly Q_DEFAULT = 1;
  private readonly FREQUENCY_MAX = 24000;
  private readonly FREQUENCY_DEFAULT = 350;

  constructor(private canvasService: CanvasService) { }

  ngAfterViewInit(): void {
    this.initNode();
  }

  initNode(): void {
    this.filterNode = this.audioCtx.createBiquadFilter();
  }

  connectNode() {
    this.gainNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode.context.destination);
  }

  disconnectNode(): void {
    this.filterNode.disconnect(0);
    this.resetParam();
  }

  resetParam(): void {
    this.filterNode.frequency.value = this.FREQUENCY_DEFAULT;
    this.filterNode.Q.value = this.Q_DEFAULT;
  }

  onEventChange(event: PadEvent): void {
    switch (event.type) {
      case 'start':
        this.canvas = event.canvas;
        this.connectNode();
        break;
      case 'move':
        if (!this.isPersist) this.connectNode();
        this.updateFromPosition(event.x, event.y);
        break;
      case 'end':
        if (!this.isPersist) this.disconnectNode()
        break;
    }
  }
 
  isPersistChange(event: MatSlideToggleChange): void {
    if (!event.checked) {
      this.canvasService.clearCanvas(this.canvas);
      this.disconnectNode();
    } else {
      this.connectNode();
    }
  }

  updateFromPosition(x: number, y: number): void {
    const { width, height } = this.canvas.nativeElement;
    const frequency = x / width * this.FREQUENCY_MAX;
    const q = this.Q_MAX * (height - (2 * y)) / height;;
    this.filterNode.frequency.value = frequency;
    this.filterNode.Q.value = q;
  }
  
  filterTypeChange(filterTypeSelected: 'allpass' | 'bandpass' | 'highpass' | 'lowpass'): void {
    this.filterNode.type = filterTypeSelected;
    if (filterTypeSelected == 'allpass') {
      this.disconnectNode();
      this.canvasService.clearCanvas(this.canvas);
    } else {
      this.connectNode();
    }
  }
  
}