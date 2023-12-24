import { AfterViewInit, Component, Input } from '@angular/core';
import { Observable, Subject, interval, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { BpmService } from '../../services/bpm.service';

interface OscParam {
  frequency: number,
  detune: number,
  typeSelected: OscillatorType,
  types: OscillatorType[],
  ampSelected: number,
  amps: { label: string, value: number }[]
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

  private beatDuration: number;
  private interval$ = new Subject<number>();
  private envParam$ = new Subject<any>();

  public get getEnvParam$(): Observable<any> {
    return this.envParam$.asObservable();
  }

  public setEnvParam$(value: any): void {
    this.envParam$.next(value);
  }

  oscParam: OscParam = {
    frequency: 0,
    detune: 0,
    typeSelected: 'sine',
    types: ['sine', 'square', 'sawtooth', 'triangle'],
    ampSelected: 2,
    amps: [{ label: '1/4', value: 0.25 }, { label: '1/2', value: 0.5 }, { label: 'x1', value: 1 }, { label: 'x2', value: 2 }, { label: 'x4', value: 4 }, { label: 'x8', value: 8 }]
  }

  envParam = {
    libelleX: "time",
    libelleY: "gain",
    attack: 0.1,
    release: 0.3,
    sustain: 0.9,
    subValue$: this.getEnvParam$,
    updatePosition: (envParam: any, GEO: any) => {
      const y = GEO.vh - (Math.floor(envParam.sustain * 100) / 100) * GEO.vh;
      const xAttack = (Math.floor(envParam.attack * 100) / 100) * GEO.vw;
      const xRelease = GEO.vw - (Math.floor(envParam.release * 100) / 100) * GEO.vw;
      return {
        attack: { x: xAttack + GEO.min, y: GEO.min },
        release: { x: xRelease + GEO.min, y: y + GEO.min }
      }
    },
    onEventMove: (attack: number, release: number, sustain: number, GEO: any) => {
      this.envParam.attack = (attack - GEO.min) / GEO.vw;
      this.envParam.release = (1 - (release - GEO.min) / GEO.vw);
      this.envParam.sustain = (1 - (sustain - GEO.min) / GEO.vh);
    }
  }

  constructor(private destroy$: DestroyService, private bpmService: BpmService) { }

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
    this.subBpm();
    this.setEnvParam$(this.envParam);
  }

  initNode(): void {
    this.envNode = new GainNode(this.audioCtx);
    this.oscillator = new OscillatorNode(this.audioCtx, this.oscParam);
  }

  connectNode() {
    this.oscillator.connect(this.envNode).connect(this.gainNode);
    this.oscillator.start();
    this.interval$.pipe(
      switchMap(duration => interval(duration)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.oscillator.type = this.oscParam.typeSelected;
      this.oscillator.frequency.value = this.oscParam.frequency;
      this.oscillator.detune.value = this.oscParam.detune;
      const time = this.audioCtx.currentTime;
      this.envNode.gain.cancelScheduledValues(time);
      this.envNode.gain.setValueAtTime(0, time);
      this.envNode.gain.linearRampToValueAtTime(1, time + this.envParam.attack);
      this.envNode.gain.linearRampToValueAtTime(this.envParam.sustain, time + (this.beatDuration / 1000) - this.envParam.release);
      this.envNode.gain.linearRampToValueAtTime(0, time + (this.beatDuration / 1000));
    });
  }

  onTypeChange(typeSelected: OscillatorType): void {
    this.oscParam.typeSelected = typeSelected;
  }

  onAmpChange(amp: number): void {
    this.oscParam.ampSelected = amp;
    this.setInterval$();
  }

  subBpm(): void {
    this.bpmService.getBeatDuration$.pipe(takeUntil(this.destroy$)).subscribe(beatDuration => {
      this.beatDuration = beatDuration;
      this.setInterval$();
    })
  }

  setInterval$(): void {
    const interval = this.oscParam.ampSelected * this.beatDuration;
    this.interval$.next(interval);
  }

}