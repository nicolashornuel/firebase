import { AfterViewInit, Component, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { ControlObservable, PAD_MAX, PadControlable, PadEvent } from '../../interfaces/padControlCanvas.interface';
import { MainGainService } from '../../services/mainGain.service';

@Component({
  selector: 'app-node-reverb',
  templateUrl: './node-reverb.component.html',
  styleUrls: ['./node-reverb.component.scss']
})
export class NodeReverbComponent implements AfterViewInit, AudioNodeElement, PadControlable {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gainNode: GainNode;
  isPersist = false;
  controlObservable: ControlObservable = {
    supplier$: this.gainService.getMainGainValue$,
    consumer: ({ x }, value: number) => ({ x, y: PAD_MAX - (Math.floor(value * 10) / 10) * PAD_MAX  })
  };

  private convolver: ConvolverNode;
  private gainConvolver: GainNode;
  private gainValue: number;
  private isStarting = false;

  constructor(private gainService: MainGainService) { }

  ngAfterViewInit(): void {
    this.initNode();
  }

  initNode(): void {
    this.convolver = this.audioCtx.createConvolver();
    this.gainConvolver = this.audioCtx.createGain();
    this.convolver.buffer = this.getBufferFromCtx();
    this.convolver.normalize = true;
  }

  connectNode(): void {
    this.gainNode.connect(this.convolver);
    this.convolver.connect(this.gainConvolver);
    this.gainConvolver.connect(this.audioCtx.destination);
  }

  disconnectNode(): void {
    this.convolver.disconnect(0);
    this.gainConvolver.disconnect(0);
    this.resetParam();
  }

  resetParam(): void {
    if (this.gainValue && this.isStarting) {
      this.gainConvolver.gain.value = 0;
      this.gainNode.gain.value = this.gainValue;
      this.isStarting = false;
    }
  }

  onEventChange(event: PadEvent): void {
    switch (event.type) {
      case 'start':
        this.isStarting = true;
        this.gainValue = this.gainNode.gain.value;
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
      this.disconnectNode();
    } else {
      this.connectNode();
    }
  }

  updateFromPosition(x: number, y: number): void {
    this.gainConvolver.gain.value = x / 20;
    this.gainNode.gain.value = Math.ceil(((PAD_MAX - y) / PAD_MAX) * 10) / 10;
  }

  getBufferFromCtx(): AudioBuffer {
    // Create an empty three-second stereo buffer at the sample rate of the AudioContext
    const myArrayBuffer = this.audioCtx.createBuffer(2, this.audioCtx.sampleRate * 2, this.audioCtx.sampleRate);
    // Fill the buffer with white noise;
    // just random values between -1.0 and 1.0
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
      // This gives us the actual array that contains the data
      const nowBuffering = myArrayBuffer.getChannelData(channel);
      for (let i = 0; i < myArrayBuffer.length; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        nowBuffering[i] = Math.random() * 2 - 1;
      }
    }
    return myArrayBuffer;
  }
}
