import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { interval, Observable, Subject, Subscription, timer } from 'rxjs';
import { startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { StationsEnum } from 'src/app/enums/radioFrance.enum';
import { Preference } from 'src/app/models/preference.interface';
import { Brand, BrandDTO, Grid, SongDTO } from 'src/app/models/radioFrance.interface';
import { DestroyService } from 'src/app/services/destroy.service';
import { PreferenceService } from 'src/app/services/preference.service';
import { RadioTransformService } from 'src/app/services/radio-transform.service';
import { RadioUtilService } from 'src/app/services/radio-util.service';
import { RadioService } from 'src/app/services/radio.service';
import { AudioElementComponent } from '../audio-element/audio-element.component';

@Component({
  selector: 'app-radio-player',
  templateUrl: './radio-player.component.html',
  styleUrls: ['./radio-player.component.scss']
})
export class RadioPlayerComponent implements OnInit, AfterViewInit {

  @ViewChild('track') trackElt: ElementRef<HTMLElement>;
  @ViewChild('player') player: ElementRef;
  @ViewChild('audioSource', {read: ViewContainerRef}) audioSource!: ViewContainerRef;
  public brandDTO: BrandDTO = {
    value: 'https://icecast.radiofrance.fr/fip-midfi.mp3?id=radiofrance', //"https://icecast.radiofrance.fr/fip-midfi.mp3?id=openapi
    viewValue: 'FIP'
  };
  private station: StationsEnum;
  public song: SongDTO;
  public grid: SongDTO[];
  public secondsLeft = 0;
  public minutesLeft = 0;
  private msPerSecond = 1000;
  private msPerMinute = 60 * 1000;
  private msPerHour = 60 * 60 * 1000;
  public isMobile: boolean;
  public playerIsOpen = false;

  private ticker$ = new Subscription;

  constructor(
    private radio: RadioService,
    private router: Router,
    private preferenceService: PreferenceService,
    private destroy$: DestroyService,
    private breakpointObserver: BreakpointObserver,
    private transform: RadioTransformService,
    private util: RadioUtilService,
    private titleService:Title,
    private resolver: ComponentFactoryResolver
  ) {}

  /**
   * SUBSCRIBE width of screen
   *
   * @memberof RadioPlayerComponent
   */
  ngOnInit(): void {
    this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => (this.isMobile = result.matches));
  }

  /**
   * Initialize data
   *
   * @memberof RadioPlayerComponent
   */
  ngAfterViewInit(): void {
    this.initializeData();
  }

  /**
   * SUBSCRIBE preference.station to initialize & update data
   *
   * @private
   * @memberof RadioPlayerComponent
   */
  private initializeData(): void {
    this.preferenceService.getPreference$.pipe(takeUntil(this.destroy$)).subscribe((preference: Preference) => {
      if (preference) {
        this.station = this.transform.checkPref(preference);
        this.getBrand();
        this.getLive(0);
      }
    });
  }

  /**
   * GET stream URL of station
   *
   * @private
   * @memberof RadioPlayerComponent
   */
  private getBrand(): void {
    this.radio
      .subscribeBrand(this.station)
      .pipe(take(1))
      .subscribe((brand: Brand) => {
        this.brandDTO = this.transform.brandMapper(brand);
        this.setAudio();
      });
  }

  /**
   * GET history of station
   *
   * @private
   * @memberof RadioPlayerComponent
   */
  private getGrid(): void {
    this.radio
      .subscribeGrid(this.station)
      .pipe(take(1))
      .subscribe((grid: Grid) => {
        (this.grid = this.transform.gridMapper(grid.grid))
      });
  }

  /**
   * GET current track of station
   *
   * @private
   * @param {number} delay
   * @memberof RadioPlayerComponent
   */
  private getLive(delay: number): void {
    timer(delay).subscribe(async () => {
      const result = await this.radio.getLive(this.station).refetch();
      this.song = result.data.live ? this.transform.factory(result.data) : null;
      if (this.song) {
        this.titleService.setTitle([this.song.artist, this.song.title].join(' '));
        this.setTicker(this.song);
        this.setAnimation(this.song);
        this.getGrid();
        this.getLive(this.util.delay(this.song.end) + 1000);
      } else {
        this.getLive(2000);
      }
    });
  }

  /**
   * SET ticker of current track
   *
   * @private
   * @memberof RadioPlayerComponent
   */
  private setTicker(song: SongDTO): void {
    this.ticker$.unsubscribe();
    this.ticker$ = interval(1000).subscribe(() => {
      const timeDifference = song.end * 1000 - new Date().getTime();
      if (timeDifference > 0) {
        this.minutesLeft = Math.floor((timeDifference % this.msPerHour) / this.msPerMinute);
        this.secondsLeft = Math.floor((timeDifference % this.msPerMinute) / this.msPerSecond);
      }
    });
  }

  /**
   * SET text animation 
   *
   * @private
   * @memberof RadioPlayerComponent
   */
  private setAnimation(song: SongDTO): void {
    timer(500).subscribe(() => {
      this.util.setAnimation(song.artist, this.trackElt.nativeElement.children[0]);
      this.util.setAnimation(song.title, this.trackElt.nativeElement.children[1]);
    });
  }

  /**
   * onClick icon SEARCH request
   *
   * @memberof RadioPlayerComponent
   */
  public onSearch(): void {
    if (this.song.artist) this.router.navigateByUrl(`list/${this.song.artist}`);
  }

  /**
   * onClick one item into popover history so launch search request
   *
   * @param {SongDTO} song
   * @memberof RadioPlayerComponent
   */
  public searchByHistory(song: SongDTO): void {
    this.router.navigateByUrl(`list/${song.artist}`);
  }

  /**
   * method shared with toolbar (when toggle input search, so player is hidden)
   *
   * @memberof RadioPlayerComponent
   */
  public toggleWindowDesktop(): void {
    if (!this.isMobile && this.song.title) {
      const widthOfWindow = this.player.nativeElement.style.width;
      this.player.nativeElement.style.width = widthOfWindow === '420px' ? '102px' : '420px';
    }
  }

  /**
   * createComponent audio HTMLElement to set src 
   *
   * @private
   * @memberof RadioPlayerComponent
   */
  private setAudio(): void {
    this.secondsLeft = 0;
    this.minutesLeft = 0;
    this.audioSource.clear();
    const factory = this.resolver.resolveComponentFactory(AudioElementComponent);
    const viewRef: ComponentRef<AudioElementComponent> = this.audioSource.createComponent<AudioElementComponent>(factory);
    viewRef.instance.src = this.brandDTO.value;
  }

}
