import { AfterViewInit, Component, Input } from '@angular/core';
import { Subject, interval, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';

interface OscParam {
  frequency: number,
  detune: number,
  typeSelected: OscillatorType,
  types: OscillatorType[]
}

@Component({
  selector: 'app-node-oscillator',
  templateUrl: './node-oscillator.component.html',
  styleUrls: ['./node-oscillator.component.scss']
})
export class NodeOscillatorComponent implements AfterViewInit, AudioNodeElement {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gainNode: GainNode;
  oscillator: OscillatorNode;
  envNode: GainNode;

  bpm: number = 128;
  duration: number;
  private duration$ = new Subject<number>();

  oscParam: OscParam  = {
    frequency: 0,
    detune: 0,
    typeSelected: 'sine',
    types: ['sine', 'square', 'sawtooth', 'triangle']
  }

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
      this.envParam.attackTime = xAttack / PAD_MAX;
      this.envParam.releaseTime = xRelease / PAD_MAX;
      this.envNode.gain.value = Math.ceil(((PAD_MAX - y) / PAD_MAX) * 100) / 100;
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
    this.oscillator = new OscillatorNode(this.audioCtx, this.oscParam);
  }

  onBpmChange(): void {
    this.setInterval$(this.bpm);
  }

  setInterval$(bpm: number): void {
    this.duration = Math.trunc(60000 / bpm);
    this.duration$.next(this.duration);
  }

  connectNode() {
    this.oscillator.connect(this.envNode).connect(this.gainNode);
    this.oscillator.start();
    this.duration$.pipe(
      switchMap(duration => interval(duration)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.oscillator.type = this.oscParam.typeSelected;
      this.oscillator.frequency.value = this.oscParam.frequency;
      this.oscillator.detune.value = this.oscParam.detune;
      const time = this.audioCtx.currentTime;
      this.envNode.gain.cancelScheduledValues(time);
      this.envNode.gain.setValueAtTime(0, time);
      this.envNode.gain.linearRampToValueAtTime(this.envNode.gain.value, time + this.envParam.attackTime);
      this.envNode.gain.linearRampToValueAtTime(0, time + (this.duration / 1000) - this.envParam.releaseTime);
    });
  }

  disconnectNode(): void {
  }

  resetParam(): void {
  }

  onTypeChange(typeSelected: OscillatorType): void {
    this.oscParam.typeSelected = typeSelected;
  }

}