import {Component, ElementRef, HostBinding, OnInit, ViewChild} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';
import {Router} from '@angular/router';
import {interval} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {StationsEnum} from 'src/app/enums/radioFrance.enum';
import {Preference} from 'src/app/models/preference.interface';
import {Song} from 'src/app/models/radioFrance.interface';
import {DestroyService} from 'src/app/services/destroy.service';
import {PreferenceService} from 'src/app/services/preference.service';
import {RadioService} from 'src/app/services/radio.service';
import {BreakpointState, Breakpoints, BreakpointObserver} from '@angular/cdk/layout';

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

  @ViewChild('tooltip') tooltip: MatTooltip;
  @ViewChild('player') player: ElementRef;

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
  public performers: string;
  public title: string;
  public secondsLeft: number = 0;
  public minutesLeft: number = 0;
  private msPerSecond = 1000;
  private msPerMinute = 60 * 1000;
  private msPerHour = 60 * 60 * 1000;

  private widthOfPlayer: number = 155; // fenêtre d'affichage du titre en pixel 155
  public historyGrid: Song[];

  public isMobile: boolean;
  public playerIsOpen: boolean = false;


  constructor(
    private radio: RadioService,
    private router: Router,
    private preferenceService: PreferenceService,
    private destroy$: DestroyService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.initializeData();
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngAfterViewInit(): void {
    this.audio.nativeElement.volume = 0.1;
  }

  private initializeData(): void {
    this.preferenceService.getPreference$.pipe(takeUntil(this.destroy$)).subscribe((preference: Preference) => {
      let station: StationsEnum =
        preference !== null
          ? Object.values(StationsEnum)
              .filter(val => val === preference.stationRadioFrance)
              .reduce(res => StationsEnum[res[0]])
          : StationsEnum.FIP;
      this.getBrand(station);
      this.getCurrentTrack(station);
    });
  }

  private getBrand(station: StationsEnum): void {
    this.radio
      .subscribeBrand(station)
      .pipe(take(1))
      .subscribe((liveStream: string) => {
        this.streamSelected = liveStream;
      });
  }

  private getGrid(station: StationsEnum): void {
    this.radio
      .subscribeGrid(station)
      .pipe(take(1))
      .subscribe((songs: Song[]) => {
        this.historyGrid = songs;
      });
  }

  private async getCurrentTrack(station: StationsEnum): Promise<void> {
    let result = await this.radio.getLive(station).refetch();
    console.log(result.data);
    if (result.data.live.song) {
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
      console.log(`Prochaine requête dans ${pollInterval / 1000} secondes`);
      setTimeout(() => {
        this.getCurrentTrack(station);
      }, pollInterval);
    } else {
      console.log('Aucun résultat à la requête getLive, nouvelle tentative dans 2 secondes');
      setTimeout(() => {
        this.getCurrentTrack(station);
      }, 2000);
    }
  }

  /*   test(station, delay, interval) {
    timer(delay, interval).subscribe(() => {
      this.test(station, delay, interval);
    });
  } */

  private setTicker(end: number): void {
    interval(1000).subscribe(() => {
      const timeDifference = end - new Date().getTime();
      if (timeDifference > 0) {
        this.minutesLeft = Math.floor((timeDifference % this.msPerHour) / this.msPerMinute);
        this.secondsLeft = Math.floor((timeDifference % this.msPerMinute) / this.msPerSecond);
      }
    });
  }

  private setAnimation(): void {
    const performersWidth = this.mesureTxt(this.performers);
    const titleWidth = this.mesureTxt(this.title);
    this.trackElt.nativeElement.children[0].style.width = `${performersWidth}px`;
    this.trackElt.nativeElement.children[1].style.width = `${titleWidth}px`;
    if (performersWidth > this.widthOfPlayer) {
      this.trackElt.nativeElement.children[0].style.animation = `defilement-track ${this.performers.length / 2}s infinite linear`;
    } else {
      this.trackElt.nativeElement.children[0].style.animation = 'none';
    }
    if (titleWidth > this.widthOfPlayer) {
      this.trackElt.nativeElement.children[1].style.animation = `defilement-track ${this.title.length / 2}s infinite linear`;
    } else {
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
    this.isPlaying ? this.audio.nativeElement.pause() : this.audio.nativeElement.play();
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
    const q = song.track.performers.join(' & ');
    this.router.navigateByUrl(`list/${q}`);
  }

  public onVolumeUp() {
    const volume = this.audio.nativeElement.volume;
    if (volume <= 1 && volume >= 0) {
      this.audio.nativeElement.volume += 0.1;
    }
    this.showTooltip();
  }

  public onVolumeDown() {
    const volume = this.audio.nativeElement.volume;
    if (volume <= 1 && volume >= 0) {
      this.audio.nativeElement.volume -= 0.1;
    }
    this.showTooltip();
  }

  private showTooltip(): void {
    this.tooltip.show();
    setTimeout(() => this.tooltip.hide(), 1000);
  }

  public toggleWindowDesktop(): void {
    const widthOfWindow = this.player.nativeElement.style.width;
    this.player.nativeElement.style.width = widthOfWindow === '420px' ? '32px' : '420px';
  }

  public toggleWindowMobile(): void {
    this.playerIsOpen = !this.playerIsOpen;
  }
}
