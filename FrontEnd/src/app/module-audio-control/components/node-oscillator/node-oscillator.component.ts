import { AfterViewInit, Component, Input } from '@angular/core';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { BehaviorSubject, Subject, interval, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { PAD_MAX, PadParam, Position } from '../../interfaces/padControlCanvas.interface';

@Component({
  selector: 'app-node-oscillator',
  templateUrl: './node-oscillator.component.html',
  styleUrls: ['./node-oscillator.component.scss']
})
export class NodeOscillatorComponent implements AfterViewInit, AudioNodeElement {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gainNode: GainNode;
  frequency: number = 0;
  detune: number = 0;
  attackTime: number = 0.1;
  releaseTime: number = 0.1;
  bpm: number = 128;
  typeSelected: OscillatorType = 'sine';
  types: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
  oscillator: OscillatorNode;
  duration: number;
  envNode: GainNode;

  private duration$ = new Subject<number>();

  envParam = {
    libelleX: "time",
    libelleY: "gain",
    attackTime: 0.1,
    releaseTime: 0.3,
    duration: 0.5,
    gainMax: 1,
    gainMin: 0,
    subValue$: of({ attackTime: 0.1, releaseTime: 0.3, gainMax: 0.9 }),
    updatePosition: ({ attackTime, releaseTime, gainMax }, PAD_MAX: number) => {
      const y = PAD_MAX - (Math.floor(gainMax * 100) / 100) * PAD_MAX;
      const xAttack = (Math.floor(attackTime * 100) / 100) * PAD_MAX;
      const xRelease = PAD_MAX - (Math.floor(releaseTime * 100) / 100) * PAD_MAX;
      return {
        attackPosition: { x: xAttack, y },
        releasePosition: { x: xRelease, y }
      }
    },
    onEventMove: (xAttack: number, xRelease: number, y: number, PAD_MAX: number) => {
      this.attackTime = xAttack / PAD_MAX;
      this.releaseTime = xRelease / PAD_MAX;
      this.envNode.gain.value = y;
      //this.envNode.gain.value = Math.ceil(((PAD_MAX - attackPosition.y) / PAD_MAX) * 100) / 100;
      //Math.ceil(((PAD_MAX - position.y) / PAD_MAX) * 100) / 100;
    }
  }

  constructor(private destroy$: DestroyService) { }

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
    this.setInterval$(this.bpm);
  }

  initNode(): void {
    this.envNode = new GainNode(this.audioCtx);
    this.oscillator = new OscillatorNode(this.audioCtx, {
      detune: this.detune,
      frequency: this.frequency,
      type: this.typeSelected,
    });
  }

  onBpmChange(): void {
    this.setInterval$(this.bpm);
  }

  setInterval$(bpm: number): void {
    this.duration = Math.trunc(60000 / bpm);
    this.duration$.next(this.duration);
  }

  connectNode() {
    this.oscillator.connect(this.envNode).connect(this.audioCtx.destination);
    this.oscillator.start();
    this.duration$.pipe(
      switchMap(duration => interval(duration)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.oscillator.type = this.typeSelected;
      this.oscillator.frequency.value = this.frequency;
      this.oscillator.detune.value = this.detune;
      const time = this.audioCtx.currentTime;
      this.envNode.gain.cancelScheduledValues(time);
      this.envNode.gain.setValueAtTime(0, time);
      this.envNode.gain.linearRampToValueAtTime(1, time + this.attackTime);
      this.envNode.gain.linearRampToValueAtTime(0, time + (this.duration / 1000) - this.releaseTime);
    });
  }

  disconnectNode(): void {
  }

  resetParam(): void {
  }

  onTypeChange(typeSelected: OscillatorType): void {
    this.typeSelected = typeSelected;
  }

}