import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { Subject, interval } from 'rxjs';
import { BpmService } from '../../services/bpm.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';

@Component({
  selector: 'app-node-sample',
  templateUrl: './node-sample.component.html',
  styleUrls: ['./node-sample.component.scss']
})
export class NodeSampleComponent implements AfterViewInit, AudioNodeElement {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gainNode: GainNode;
  public delay: number = 0.1;
  public playbackRate: number = 1;
  private templateFile?: File;
  private bufferSource: AudioBufferSourceNode;
  private compressor: DynamicsCompressorNode;
  private delayNode: DelayNode;
  private envNode: GainNode;
  private beatDuration: number;
  private interval: number;
  private interval$ = new Subject<number>();
  private backup: AudioBuffer;

  compParam = {
    threshold: -20,
    knee: 30,
    ratio: 5,
    attack: .05,
    release: .25
  }

  ampParam = {
    ampSelected: 2,
    amps: [{ label: '1/4', value: 0.25 }, { label: '1/2', value: 0.5 }, { label: 'x1', value: 1 }, { label: 'x2', value: 2 }, { label: 'x4', value: 4 }, { label: 'x8', value: 8 }]
  }

  constructor(private destroy$: DestroyService, private bpmService: BpmService) { }

  ngAfterViewInit(): void {
    this.subBpm();
  }

  initNode(): void {
    this.bufferSource = this.audioCtx.createBufferSource();
    this.compressor = this.audioCtx.createDynamicsCompressor();
    this.envNode = new GainNode(this.audioCtx);
    this.delayNode = this.audioCtx.createDelay();
  }

  connectNode(): void {
    this.bufferSource.connect(this.compressor).connect(this.delayNode).connect(this.envNode).connect(this.gainNode);
  }
  
  public onAmpChange(amp: number): void {
    this.ampParam.ampSelected = amp;
    this.setInterval$();
  }

  public handleFileInput(event: any): void {
    if (event.target.value) this.templateFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => this.bufferize(evt.target.result as ArrayBuffer);
    reader.readAsArrayBuffer(this.templateFile);
  }

  private subBpm(): void {
    this.bpmService.getBeatDuration$.pipe(takeUntil(this.destroy$)).subscribe(beatDuration => {
      this.beatDuration = beatDuration;
      this.interval$.next();
    })
  }

  private setInterval$(): void {
    this.interval = this.ampParam.ampSelected * this.beatDuration;
    this.interval$.next();
  }

  private bufferize(arrayBuffer: ArrayBuffer): void {
    this.audioCtx.decodeAudioData(arrayBuffer, (buffer: AudioBuffer) => this.loop(buffer));
  }


  private loop(buffer: AudioBuffer): void {
    this.backup = buffer;
    this.interval$.pipe(
      switchMap(() => interval(this.interval)),
      takeUntil(this.destroy$)
    ).subscribe(() => this.makeAmp(this.backup));
    this.setInterval$();
  }

  private makeAmp(buffer: AudioBuffer): void {
    this.initNode();
    this.connectNode();
    this.bufferSource.start();
    this.bufferSource.buffer = buffer;
    const time = this.audioCtx.currentTime;
    this.delayNode.delayTime.value = this.delay;
    this.bufferSource.playbackRate.value = this.playbackRate;
    this.compressor.threshold.setValueAtTime(this.compParam.threshold, time);
    this.compressor.knee.setValueAtTime(this.compParam.knee, time);
    this.compressor.ratio.setValueAtTime(this.compParam.ratio, time);
    this.compressor.attack.setValueAtTime(this.compParam.attack, time);
    this.compressor.release.setValueAtTime(this.compParam.release, time);
    this.envNode.gain.cancelScheduledValues(time);
    this.envNode.gain.setValueAtTime(0, time);
    this.envNode.gain.linearRampToValueAtTime(1, time);
    this.envNode.gain.linearRampToValueAtTime(0, time + (this.interval / 1000));
  }


}
