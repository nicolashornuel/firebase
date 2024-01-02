import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { MainGainService } from '../services/mainGain.service';

@Component({
  selector: 'app-page-audio-control',
  templateUrl: './page-audio-control.component.html',
  styleUrls: ['./page-audio-control.component.scss']
})
export class PageAudioControlComponent implements OnInit {

  public audioCtx: AudioContext;
  public gainNode: GainNode;

  constructor(private gainService: MainGainService, private destroy$: DestroyService) { }

  ngOnInit(): void {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainService.getMainGainValue$.pipe(takeUntil(this.destroy$)).subscribe(mainGainValue => this.gainNode.gain.value = mainGainValue);
  }

  mainGainValueChange(value: number): void {
    this.gainService.setMainGainValue$(value);
  }

}
