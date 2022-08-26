import {Component, OnInit, AfterViewInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Params} from '@angular/router';
// COMPONENT
import {WatchComponent} from '../watch/watch.component';
// SERVICE
import {DiscogsService} from 'src/app/services/discogs.service';
import {SearchService} from 'src/app/services/search.service';
import {WikipediaService} from 'src/app/services/wikipedia.service';
import {PreferenceService} from 'src/app/services/preference.service';
//INTERFACE
import {Preference} from 'src/app/models/preference.interface';
import {QueryGAPI} from '../../models/queryGAPI.interface';
import {VideoGAPI} from '../../models/videoGAPI.interface';
import {QueryDiscogs} from 'src/app/models/queryDiscogs.interface';
import {take, takeUntil} from 'rxjs/operators';
import {DestroyService} from 'src/app/services/destroy.service';
import {combineLatest, forkJoin} from 'rxjs';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit, AfterViewInit {
  loading: boolean = true;
  keyword: string;
  preference: Preference;
  queryDiscogs: QueryDiscogs = {
    q: null,
    per_page: null,
    token: null,
    artist: null
  };
  discogs: any[] = [];
  extractWiki: string = '';
  queryGAPI: QueryGAPI = {
    q: null,
    maxResults: null,
    order: null,
    key: null,
    part: null,
    type: null
  };
  videos: VideoGAPI[] = [];

  constructor(
    public dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private discogsService: DiscogsService,
    private searchService: SearchService,
    private wikipediaService: WikipediaService,
    private preferenceService: PreferenceService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.checkParam();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  checkParam() {
    combineLatest([this.route.params, this.preferenceService.getPreference$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, preference]) => {
        this.keyword = params.q;
        this.preference = preference;
        this.factory();
      });
  }

  factory() {
    if (this.preference.switchDiscogs) {
      this.searchDiscogs();
    }
    if (this.preference.switchWikipedia) {
      this.searchWikipedia();
    }
    if (this.preference.switchYoutube) {
      this.searchYoutube();
    }
  }

  searchDiscogs() {
    this.queryDiscogs.q = this.keyword;
    this.queryDiscogs.per_page = this.preference.maxResultsDiscogs;
    this.discogsService.getByArtistName(this.queryDiscogs).subscribe(result => {
      this.discogs = result.results.map(elt => {
        return {
          title: elt.title,
          thumb: elt.thumb,
          year: elt.year,
          style: elt.style.join(', '),
          label: [...new Set(elt.label)].slice(0, 6).join(', '),
          format: [...new Set(elt.format)].join(', ')
        };
      });
    });
  }

  searchWikipedia() {
    this.wikipediaService.getWiki(this.keyword, 'fr').subscribe(result => {
      for (var i in result.query.pages) {
        this.extractWiki = result.query.pages[i].extract;
      }
      if (this.extractWiki == '') {
        this.wikipediaService.getWiki(this.keyword, 'en').subscribe(result => {
          for (var i in result.query.pages) {
            this.extractWiki = result.query.pages[i].extract;
          }
        });
      }
    });
  }

  searchYoutube() {
    this.queryGAPI.q = this.keyword;
    this.queryGAPI.maxResults = this.preference.maxResultsYoutube;
    this.queryGAPI.order = this.preference.orderYoutube;
    this.searchService.getVideos(this.queryGAPI).subscribe((items: any) => {
      this.videos = items.map(item => {
        return {
          videoId: item.id.videoId,
          publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
          title: this.decodeHTMLEntities(item.snippet.title),
          description: this.decodeHTMLEntities(item.snippet.description),
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          src: `https://www.youtube.com/embed/${item.id.videoId}`,
          discogs: this.discogs
        };
      });
    });
  }

  openDialog(index: number) {
    this.dialog.open(WatchComponent, {
      width: '432px',
      data: {
        video: {
          videoId: this.videos[index].videoId,
          publishedAt: this.videos[index].publishedAt,
          title: this.videos[index].title,
          description: this.videos[index].description,
          thumbnail: this.videos[index].thumbnail,
          channelTitle: this.videos[index].channelTitle,
          src: this.videos[index].src,
          sanitized: this._sanitizer.bypassSecurityTrustResourceUrl(this.videos[index].src),
          extractWiki: this.extractWiki
        }
      }
    });
  }

  private decodeHTMLEntities(text: string) {
    var entities = [
      ['amp', '&'],
      ['apos', "'"],
      ['#x27', "'"],
      ['#x2F', '/'],
      ['#39', "'"],
      ['#47', '/'],
      ['lt', '<'],
      ['gt', '>'],
      ['nbsp', ' '],
      ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i)
      text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

    return text;
  }
}
