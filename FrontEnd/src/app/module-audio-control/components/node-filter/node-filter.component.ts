import { AfterViewInit, Component, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { PAD_MAX, PadControlable, PadParam, Position } from '../../interfaces/padControlCanvas.interface';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-node-filter',
  templateUrl: './node-filter.component.html',
  styleUrls: ['./node-filter.component.scss']
})
export class NodeFilterComponent implements AfterViewInit, AudioNodeElement, PadControlable {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gainNode: GainNode;

  isPersist = false;
  padParam: PadParam = {
    libelleX: "frequency",
    libelleY: "Q factor",
    currentPosition: { x: 0, y: PAD_MAX },
    onEventStart: () => this.connectNode(),
    onEventMove: (position: Position) => {
      if (!this.isPersist) this.connectNode();
      const frequency = position.x / PAD_MAX * this.FREQUENCY_MAX;
      const q = this.Q_MAX * (PAD_MAX - (2 * position.y)) / PAD_MAX;;
      this.filterNode.frequency.value = frequency;
      this.filterNode.Q.value = q;
    },
    onEventEnd: () => {if (!this.isPersist) this.disconnectNode()}
  }
  
  private filterNode: BiquadFilterNode;
  private readonly Q_MAX = 80; // FLOAT32_MAX = 3.4028234663852886e+38;
  private readonly Q_DEFAULT = 1;
  private readonly FREQUENCY_MAX = 8000; // 24000
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
    this.canvasService.clearCanvas(this.padParam.canvas);
    this.filterNode.disconnect(0);
    this.resetParam();
  }

  resetParam(): void {
    this.filterNode.frequency.value = this.FREQUENCY_DEFAULT;
    this.filterNode.Q.value = this.Q_DEFAULT;
  }
 
  onPersistChange(event: MatSlideToggleChange): void {
    if (!event.checked) {
      this.disconnectNode();
    } else {
      this.connectNode();
    }
  }
  
  filterTypeChange(filterTypeSelected: 'allpass' | 'bandpass' | 'highpass' | 'lowpass'): void {
    this.filterNode.type = filterTypeSelected;
    if (filterTypeSelected == 'allpass') {
      this.disconnectNode();
    } else {
      this.connectNode();
    }
  }
  
}