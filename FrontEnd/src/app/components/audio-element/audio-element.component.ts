import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AudioService } from 'src/app/services/audio.service';
import { DestroyService } from 'src/app/services/destroy.service';

@Component({
  selector: 'app-audio-element',
  templateUrl: './audio-element.component.html',
  styleUrls: ['./audio-element.component.scss']
})
export class AudioElementComponent implements AfterViewInit {
  @Input() src: String = 'https://icecast.radiofrance.fr/fip-midfi.mp3?id=radiofrance';
  public isPlaying = false;
  @ViewChild('audio') audio: ElementRef;
  @ViewChild('tooltip') tooltip: MatTooltip;

  constructor(private audioService: AudioService, private destroy$: DestroyService) {}

  /**
   * SET volume & initialize data
   *
   * @memberof AudioElementComponent
   */
  ngAfterViewInit(): void {
    timer(500).subscribe(() => (this.audio.nativeElement.volume = 0.1));
    this.audioService.getIsPlaying$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPlaying: boolean) => {
        this.isPlaying = isPlaying;
        if (this.isPlaying) this.audioService.setSource$(this.audio.nativeElement);
        this.isPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
      });
  }

  /**
   * onClick on icon PLAY/PAUSE player
   *
   * @memberof AudioElementComponent
   */
  public onTooglePlay(): void {
    this.isPlaying ? this.audioService.setIsPlaying(false) : this.audioService.setIsPlaying(true);
  }

  /**
   * onClick to change volume
   *
   * @param {string} direction
   * @memberof AudioElementComponent
   */
  public onVolume(direction: string): void {
    const volume = this.audio.nativeElement.volume;
    if (volume <= 1 && volume >= 0) {
      this.audio.nativeElement.volume += direction === 'up' ? 0.1 : -0.1;
    }
    this.tooltip.show();
    setTimeout(() => this.tooltip.hide(), 1000);
  }
}
