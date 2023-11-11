import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-audio-filter',
  templateUrl: './audio-filter.component.html',
  styleUrls: ['./audio-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AudioFilterComponent implements OnInit {

  @Input('source') audioCtx: AudioContext | undefined;
  private biquadFilter: BiquadFilterNode;
  private control = {
    type: {
      name: 'biquadFilterType',
      type: 'select',
      options: ['allpass', 'bandpass', 'highpass', 'lowpass'],
      value: 'allpass',
      apply: (value: BiquadFilterType) => this.biquadFilter.type = value
    },
    frequency: {
      name: 'biquadFilterFrequency',
      type: 'number',
      min: 0,
      max: 24000,
      step: 10,
      value: 0,
      apply: (value: number) => this.biquadFilter.frequency.setValueAtTime(value, this.audioCtx.currentTime)
    },
  }

  constructor() { }

  ngOnInit(): void {
  }

  change(value: any): void {
    console.log(value);
    
  }

}
