import { AfterViewInit, Component, Input } from '@angular/core';
import { Observable, Subject, interval, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';

interface OscParam {
  frequency: number,
  detune: number,
  typeSelected: OscillatorType,
  types: OscillatorType[],
/*   attack: number,
  release: number,
  time: number,
  sustain: number */
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
  private envParam$ = new Subject<any>();

  public get getEnvParam$(): Observable<any> {
    return this.envParam$.asObservable();
  }

  public setEnvParam$(value: any): void {
    this.envParam$.next(value);
  }

  oscParam: OscParam  = {
    frequency: 0,
    detune: 0,
    typeSelected: 'sine',
    types: ['sine', 'square', 'sawtooth', 'triangle']
  }

  envParam = {
    libelleX: "time",
    libelleY: "gain",
    attack: 0.1,
    release: 0.3,
    time: 0.5,
    sustain: 0.9,
    subValue$: this.getEnvParam$,
    updatePosition: (envParam: any, PAD_MAX: number) => {
      const y = PAD_MAX - (Math.floor(envParam.sustain * 100) / 100) * PAD_MAX;
      const xAttack = (Math.floor(envParam.attack * 100) / 100) * PAD_MAX;
      const xRelease = PAD_MAX - (Math.floor(envParam.release * 100) / 100) * PAD_MAX;
      return {
        attackPosition: { x: xAttack, y: 0 },
        releasePosition: { x: xRelease, y }
      }
    },
    onEventMove: (xAttack: number, xRelease: number, y: number, PAD_MAX: number) => {
      this.envParam.attack = xAttack / PAD_MAX;
      this.envParam.release = (1 - xRelease / PAD_MAX);
      this.envParam.sustain = Math.ceil(((PAD_MAX - y) / PAD_MAX) * 100) / 100;
    }
  }

  constructor(private destroy$: DestroyService) { }

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
    this.setInterval$(this.bpm);
    this.setEnvParam$(this.envParam);
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
      this.envNode.gain.linearRampToValueAtTime(this.envParam.sustain, time + this.envParam.attack);
      this.envNode.gain.linearRampToValueAtTime(0, time + (this.duration / 1000) - this.envParam.release);
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