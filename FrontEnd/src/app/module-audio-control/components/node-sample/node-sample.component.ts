import { AfterViewInit, Component, Input } from '@angular/core';
import { AbstractBpmComponent } from '../../abstracts/abstract-bpm.component';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-node-sample',
  templateUrl: './node-sample.component.html',
  styleUrls: ['./node-sample.component.scss']
})
export class NodeSampleComponent extends AbstractBpmComponent implements AfterViewInit, AudioNodeElement {
  @Input('context') audioCtx: AudioContext;
  @Input('source') audioNode: GainNode;

  public nameFile?: string;
  private bufferSource: AudioBufferSourceNode;
  private compressor: DynamicsCompressorNode;
  private enveloppe: GainNode;
  public sampleGain: GainNode;
  private backup: AudioBuffer;

  sampleParam = {
    file: "",
    opened: true,
    muted: false,
    gain: 1,
    sequence: [0, 4, 8, 12],
    eg: false,
    amp: 4,
    envParam: {
      attack: 0.1,
      release: 0.3,
      sustain: 0.9
    },
    compressor: -24,    // threshold: [0 -100] -24 par défaut
    playbackRate: 1,     // (pitch) [0 10]
    modulation: 100,
    filter: {
      frequency: 440, // 32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
      q: 1.4
    }
  };

  ngAfterViewInit(): void {
    this.initNode();
    this.loadSample('assets/sample/BL_Kick14.wav');
  }

  initNode(): void {
    this.sampleGain = new GainNode(this.audioCtx, { gain: this.sampleParam.gain });
    this.compressor = new DynamicsCompressorNode(this.audioCtx);
  }

  connectNode(): void {
    this.bufferSource = new AudioBufferSourceNode(this.audioCtx);
    this.enveloppe = new GainNode(this.audioCtx);
    this.bufferSource.connect(this.compressor).connect(this.enveloppe).connect(this.sampleGain).connect(this.audioNode);
  }

  async loadSample(url: string) {
    this.nameFile = url;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const sample = await this.audioCtx.decodeAudioData(buffer);
    return this.loop(sample);
  }

  public handleFileInput(event: any): void {
    if (event.target.value) {
       const file: File = event.target.files[0];
       this.nameFile = file.name;
       const reader = new FileReader();
       reader.onload = evt => this.bufferize(evt.target.result as ArrayBuffer);
       reader.readAsArrayBuffer(file);
    }
  }

  private bufferize(arrayBuffer: ArrayBuffer): void {
    this.audioCtx.decodeAudioData(arrayBuffer, (buffer: AudioBuffer) => this.loop(buffer));
  }

  private loop(buffer: AudioBuffer): void {
    this.backup = buffer;
    this.modulation();
    this.getCurrent$.subscribe(() => {
      const index = this.sampleParam.sequence.findIndex(number => number === this.current);
      if (index != -1 && !this.sampleParam.muted) this.playNote();
    });
  }

  private playNote(): void {
    this.connectNode();
    this.bufferSource.start();
    this.bufferSource.buffer = this.backup;
    const time = this.audioCtx.currentTime;
    this.bufferSource.playbackRate.value = this.sampleParam.playbackRate;
    this.compressor.threshold.value = this.sampleParam.compressor;
    
    if (this.sampleParam.eg) {
      this.enveloppe.gain.setValueAtTime(0, time);
      this.enveloppe.gain.linearRampToValueAtTime(1, time + this.sampleParam.envParam.attack);
      this.enveloppe.gain.linearRampToValueAtTime(
        this.sampleParam.envParam.sustain,
        time + this.duration - this.sampleParam.envParam.release
      );
      this.enveloppe.gain.linearRampToValueAtTime(0, time + this.duration);
      this.bufferSource.stop(time + this.duration);
    } else {
      //this.enveloppe.gain.linearRampToValueAtTime(1, time);
        //this.enveloppe.gain.linearRampToValueAtTime(0, time + this.sampleParam.amp * this.duration);
      this.bufferSource.stop(time + this.sampleParam.amp * this.duration);
    }
  }


  private modulation$: BehaviorSubject<number> = new BehaviorSubject<number>(100);

  private modulation(): void {
    const biquad = this.audioCtx.createBiquadFilter();
    this.sampleGain.connect(biquad);
    biquad.connect(this.audioNode);
    biquad.type = 'peaking';
    const time = this.audioCtx.currentTime;
    this.getModulation$.pipe(
      switchMap(modulation => interval(modulation))
    ).subscribe(counter => {
      biquad.frequency.value = this.sampleParam.filter.frequency;
      biquad.Q.value = this.sampleParam.filter.q;
      biquad.gain.linearRampToValueAtTime(counter % 2 === 0 ? 0 : 30, time);
    })
  }

  public setModulation$(): void {
    this.modulation$.next(this.sampleParam.modulation);
  }

  public get getModulation$(): Observable<number> {
    return this.modulation$.asObservable();
  }
  

}
