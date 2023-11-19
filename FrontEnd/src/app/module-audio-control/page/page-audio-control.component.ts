import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-page-audio-control',
  templateUrl: './page-audio-control.component.html',
  styleUrls: ['./page-audio-control.component.scss']
})
export class PageAudioControlComponent implements OnInit, AfterViewInit  {

  @ViewChild('audio') audio: ElementRef;
  public audioCtx: AudioContext;
  private source: MediaElementAudioSourceNode;
  public gainNode: GainNode;

  constructor() { }
  
  ngOnInit(): void {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
  }
  
  ngAfterViewInit(): void {
    this.source = this.audioCtx.createMediaElementSource(this.audio.nativeElement);
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
  }

}
