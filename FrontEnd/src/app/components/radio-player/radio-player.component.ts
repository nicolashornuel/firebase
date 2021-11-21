import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild
} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {interval} from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import {StationsEnum} from 'src/app/enums/radioFrance.enum';
import { Preference } from 'src/app/models/preference.interface';
import {Grid, Live, Song} from 'src/app/models/radioFrance.interface';
import { PreferenceService } from 'src/app/services/preference.service';
import {RadioService} from 'src/app/services/radio.service';

export interface Canal {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-radio-player',
  templateUrl: './radio-player.component.html',
  styleUrls: ['./radio-player.component.scss']
})
export class RadioPlayerComponent implements OnInit {
  // Permet Play/Pause par clic sur le bouton personnalisé
  @ViewChild('audio') audio: ElementRef;

  // Permet de gérer le défilement du titre audio par style CSS
  @ViewChild('track') trackElt: ElementRef;

  // Permet de gérer le défilement du titre audio par style CSS
  @HostBinding('style.--target-performers') private targetPerformers: string;
  @HostBinding('style.--target-title') private targetTitle: string;

  public radioStream: Canal[] = [
    {
      value: 'https://chi.bassdrive.co:443/;stream/1',
      viewValue: 'Bassdrive'
    },
    {
      value: 'https://icecast.radiofrance.fr/fip-midfi.mp3?id=radiofrance',
      viewValue: 'FIP'
    }
  ];
  public streamSelected: string = this.radioStream[1].value;
  public isPlaying: boolean = true;
  public live: Live;
  public performers: string;
  public title: string;
  public secondsLeft: number = 0;
  public minutesLeft: number = 0;
  private msPerSecond = 1000;
  private msPerMinute = 60 * 1000;
  private msPerHour = 60 * 60 * 1000;

  private widthOfPlayer: number = 200; // fenêtre d'affichage du titre courant en pixel
  public historyGrid: Song[];

  constructor(private radio: RadioService, private router: Router, private preferenceService: PreferenceService) {}

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    //this.isLoading = true;
    this.preferenceService.find().subscribe( async (preference: Preference) => {
      const station: StationsEnum[] = Object.values(StationsEnum).filter(
        val => val === preference.stationRadioFrance
      );
      this.getBrand(station[0]);
      this.getGrid(station[0]);
      this.getCurrentTrack(station[0]);

    })
    //this.isLoading = false;
  }

  private async getBrand(station: StationsEnum): Promise<void> {
     let result = await this.radio.getBrand(station).refetch();
     //this.streamSelected = result.data.brand.liveStream
     console.log(this.streamSelected)
  }

  private async getGrid(station: StationsEnum): Promise<void> {
    let result = await this.radio.getGrid(station).refetch();
    this.historyGrid = result.data.grid.slice().reverse();
  }

  private async getCurrentTrack(station: StationsEnum): Promise<void> {
    let result = await this.radio.getLive(station).refetch();
    if (result.data.live.song) {
      this.live = result.data;
      this.title = result.data.live.song.track.title;
      this.performers = result.data.live.song.track.performers.join(' & ');
      let end: number = result.data.live.song.end * 1000;
      let now: number = Math.floor(new Date().getTime());
      let pollInterval = end - now + 1000;
      this.setTicker(end);
      setTimeout(() => {
        this.setAnimation();
      }, 50);
      this.getGrid(station);
      setTimeout(() => {
        this.getCurrentTrack(station);
      }, pollInterval);
    } else {
      setTimeout(() => {
        this.getCurrentTrack(station);
      }, 2000);
    }
  }

  private setTicker(end: number): void {
    interval(1000).subscribe(() => {
      const timeDifference = end - new Date().getTime();
      if (timeDifference > 0) {
        this.minutesLeft = Math.floor(
          (timeDifference % this.msPerHour) / this.msPerMinute
        );
        this.secondsLeft = Math.floor(
          (timeDifference % this.msPerMinute) / this.msPerSecond
        );
      }
    });
  }

  private setAnimation(): void {
    const performersWidth = this.mesureTxt(this.performers);
    const titleWidth = this.mesureTxt(this.title);
    if (performersWidth > this.widthOfPlayer) {
      this.targetPerformers = `-${performersWidth - this.widthOfPlayer}px`;
      this.trackElt.nativeElement.children[0].style.width = `${performersWidth}px`;
      this.trackElt.nativeElement.children[0].style.animation = `defilement-performers ${this.performers.length}s infinite linear`;
    } else {
      this.trackElt.nativeElement.children[0].style.width = `${performersWidth}px`;
      this.trackElt.nativeElement.children[0].style.animation = 'none';
    }
    if (titleWidth > this.widthOfPlayer) {
      this.targetTitle = `-${titleWidth - this.widthOfPlayer}px`;
      this.trackElt.nativeElement.children[1].style.width = `${titleWidth}px`;
      this.trackElt.nativeElement.children[1].style.animation = `defilement-title ${this.title.length}s infinite linear`;
    } else {
      this.trackElt.nativeElement.children[1].style.width = `${performersWidth}px`;
      this.trackElt.nativeElement.children[1].style.animation = 'none';
    }
  }

  /**
   * allow calculate lenght into pixel of string
   *
   * @private
   * @param {string} str
   * @return {*}  {number}
   * @memberof RadioPlayerComponent
   */
  private mesureTxt(str: string): number {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = "16px 'Helvetica Neue'";
    return ctx.measureText(str).width;
  }

  /**
   * onClick on icon PLAY/PAUSE player
   *
   * @memberof RadioPlayerComponent
   */
  public onTooglePlay() {
    this.isPlaying
      ? this.audio.nativeElement.pause()
      : this.audio.nativeElement.play();
    this.isPlaying = !this.isPlaying;
  }

  /**
   * onClick icon SEARCH request
   *
   * @memberof RadioPlayerComponent
   */
  public onSearch() {
      this.router.navigateByUrl(`list/${this.performers}`);
  }

  /**
   * onClick one item into popover history so launch search request
   *
   * @param {Song} song
   * @memberof RadioPlayerComponent
   */
  public searchByHistory(song: Song) {
    const q = song.track.performers.join(' & ')
    this.router.navigateByUrl(`list/${q}`);
  }
}
