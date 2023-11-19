import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-node-eq',
  templateUrl: './node-eq.component.html',
  styleUrls: ['./node-eq.component.scss']
})
export class NodeEqComponent implements AfterViewInit {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gain: GainNode;
  public eqs: BiquadFilterNode[] = [];
  private freqs = [32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  ngAfterViewInit(): void {
    this.initNode();
  }

  private initNode(): void {
    this.freqs.forEach( freq => {
      const biquad = this.audioCtx.createBiquadFilter();
      biquad.type = 'peaking';
      biquad.frequency.value = freq;
      biquad.Q.value = 1.4;
      biquad.gain.value = 0;
      this.eqs.push(biquad);
    });
    this.gain.connect(this.eqs[0]);

    for (let i = 1; i < this.eqs.length; i++) {
      this.eqs[i-1].connect(this.eqs[i]);
    }
    this.eqs[this.eqs.length - 1].connect(this.audioCtx.destination);
  }

}
