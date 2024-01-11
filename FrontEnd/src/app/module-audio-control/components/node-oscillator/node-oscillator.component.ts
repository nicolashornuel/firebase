import { AfterViewInit, Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AbstractBpmComponent } from '../../abstracts/abstract-bpm.component';
import { AudioNodeElement } from '../../interfaces/audioNodeElement.interface';
import { gamme } from '../../models/gamme.constant';
import { OscParam } from '../../models/oscillator.interface';

@Component({
  selector: 'app-node-oscillator',
  templateUrl: './node-oscillator.component.html',
  styleUrls: ['./node-oscillator.component.scss']
})
export class NodeOscillatorComponent extends AbstractBpmComponent implements AfterViewInit, AudioNodeElement {
  @Input('context') audioCtx: AudioContext;
  @Input('source') audioNode: GainNode;
  oscillatorGain: GainNode;
  oscillatorTypes: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
  octaves: number[] = [...Array(9).keys()];

  oscParam: OscParam = {
    opened: true,
    muted: true,
    gain: 0.1,
    detune: 0,
    type: 'sine',
    octave: 1,
    sequence: {
      0: ['do'],
      4: ['do'],
      8: ['do'],
      12: ['re']
    },
    eg: false,
    amp: 4,
    envParam: {
      attack: 0.1,
      release: 0.3,
      sustain: 0.9
    },
    modulation: 100,
    filter: {
      frequency: 440, // 32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
      q: 1.4
    }
  };

  ngAfterViewInit(): void {
    this.initNode();
    this.connectNode();
  }

  initNode(): void {
    this.oscillatorGain = new GainNode(this.audioCtx, { gain: this.oscParam.gain });
  }

  connectNode() {
    this.modulation();
    this.getCurrent$.subscribe(() => {
      if (this.oscParam.sequence[this.current] != undefined && !this.oscParam.muted)
        this.oscParam.sequence[this.current].forEach((note: string) => this.playNote(note));
    });
  }

  private playNote(note: string): void {
    const time = this.audioCtx.currentTime;
    const oscillator = new OscillatorNode(this.audioCtx);
    const enveloppe = new GainNode(this.audioCtx);
    oscillator.start();
    oscillator.type = this.oscParam.type;
    oscillator.frequency.value = gamme[note].frequencies[this.oscParam.octave];
    oscillator.detune.value = this.oscParam.detune;
    // AMP EG - ENVELOPPE
    oscillator.connect(enveloppe).connect(this.oscillatorGain);
    if (this.oscParam.eg) {
      enveloppe.gain.setValueAtTime(0, time);
      enveloppe.gain.linearRampToValueAtTime(1, time + this.oscParam.envParam.attack);
      enveloppe.gain.linearRampToValueAtTime(
        this.oscParam.envParam.sustain,
        time + this.duration - this.oscParam.envParam.release
      );
      enveloppe.gain.linearRampToValueAtTime(0, time + this.duration);
      oscillator.stop(time + this.duration);
    } else {
      //enveloppe.gain.linearRampToValueAtTime(1, time);
      oscillator.stop(time + this.oscParam.amp * this.duration);
    }
  }

  private modulation$: BehaviorSubject<number> = new BehaviorSubject<number>(100);

  private modulation(): void {
    const biquad = this.audioCtx.createBiquadFilter();
    this.oscillatorGain.connect(biquad);
    biquad.connect(this.audioNode);
    biquad.type = 'peaking';
    const time = this.audioCtx.currentTime;
    this.getModulation$.pipe(
      switchMap(modulation => interval(modulation))
    ).subscribe(counter => {
      biquad.frequency.value = this.oscParam.filter.frequency;
      biquad.Q.value = this.oscParam.filter.q;
      biquad.gain.linearRampToValueAtTime(counter % 2 === 0 ? 0 : 30, time);
    })
  }

  public setModulation$(): void {
    this.modulation$.next(this.oscParam.modulation);
  }

  public get getModulation$(): Observable<number> {
    return this.modulation$.asObservable();
  }

}
