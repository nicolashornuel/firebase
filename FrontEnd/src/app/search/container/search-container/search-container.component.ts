import { Component } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { VideoGAPI } from 'src/app/shared/models/videoGAPI.interface';
import { VideoService } from 'src/app/shared/services/video.service';
import { WikipediaService } from 'src/app/shared/services/wikipedia.service';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent {

  inputTouched = false;
  loading = false;
  searching = false;
  h1 = null;
  videos: VideoGAPI[] = [];
  gridColumns: number = 3;
  extractWiki: string;

  constructor(
    private searchService: SearchService,
    private wikipediaService: WikipediaService,
    private videoService: VideoService) { }

  updateGridSize(count) {
    this.gridColumns = count;
  }

  ngOnInit() {
  }

  handleUpdate($event) {
    this.h1 = "Affichage des données " + $event.switchDataBase
    + " avec les functions " + $event.switchBackEnd
    + " ( mode " + $event.switchTableCard + " )";
    this.loading = true;
    this.searching = false;
    this.videoService.findAll($event)
      .subscribe((items: any) => {
        this.videos = items.map(item => {
          return {
            description: item.description,
            categorie: item.categorie,
            channelTitle: item.channelTitle,
            videoId: item.videoId,
            thumbnail: item.thumbnail,
            title: item.title,
            publishedAt: new Date(item.publishedAt).toLocaleDateString(),
            src: item.src,
          };
        });
        this.loading = false;

      });
  }

  handleSearch($event) {
    this.h1 = "Recherche Youtube : " + $event.query.q;
    this.loading = true;
    this.searching = true;
    this.wikipediaService.getWiki($event.query.q)
      .subscribe(result => {
        for (var i in result.query.pages) {
          this.extractWiki = result.query.pages[i].extract;
        }
      });
    this.searchService.getVideos($event)
      .subscribe((items: any) => {
        this.videos = items.map(item => {
          return {
            videoId: item.id.videoId,
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
            title: this.decodeHTMLEntities(item.snippet.title),
            description: this.decodeHTMLEntities(item.snippet.description),
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
            src: `https://www.youtube.com/embed/${item.id.videoId}`
          };
        });
        this.inputTouched = true;
        this.loading = false;
      });
  }

  decodeHTMLEntities(text: string) {
    var entities = [
      ['amp', '&'],
      ['apos', '\''],
      ['#x27', '\''],
      ['#x2F', '/'],
      ['#39', '\''],
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