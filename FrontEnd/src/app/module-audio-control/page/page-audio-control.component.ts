import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { MainGainService } from '../services/mainGain.service';

@Component({
  selector: 'app-page-audio-control',
  templateUrl: './page-audio-control.component.html',
  styleUrls: ['./page-audio-control.component.scss']
})
export class PageAudioControlComponent implements OnInit, AfterViewInit {

  @ViewChild('audio') audio: ElementRef;
  public audioCtx: AudioContext;
  public source: MediaElementAudioSourceNode;
  public gainNode: GainNode;
  public isPlaying = false;

  constructor(private gainService: MainGainService, private destroy$: DestroyService) { }

  ngOnInit(): void {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainService.getMainGainValue$.pipe(takeUntil(this.destroy$)).subscribe(mainGainValue => this.gainNode.gain.value = mainGainValue);
  }

  ngAfterViewInit(): void {
    this.source = this.audioCtx.createMediaElementSource(this.audio.nativeElement);
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
/*     this.audioService.getIsPlaying$.pipe(
      mergeMap(isPlaying => 
        iif(() => isPlaying, this.audioService.getSource$, of(this.audio.nativeElement))),
      takeUntil(this.destroy$)
      )
    .subscribe(source => {
      if (this.source) this.source.disconnect();
      this.source = this.audioCtx.createMediaElementSource(source);
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
    }); */
  }

  onTooglePlay(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
  }

  mainGainValueChange(value: number): void {
    this.gainService.setMainGainValue$(value);
  }

}
