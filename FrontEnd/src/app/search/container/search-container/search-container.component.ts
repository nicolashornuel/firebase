import { Component } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { VideoGAPI } from 'src/app/shared/models/videoGAPI.interface';
import { VideoService } from 'src/app/shared/services/video.service';


@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent {

  inputTouched = false;
  loading = false;
  videos: VideoGAPI[] = [];
  gridColumns = 1;

  constructor(private searchService: SearchService, private videoService: VideoService) { }

  updatGridSize(count) {
    this.gridColumns = count;
  }

  ngOnInit() {
    this.loading = true;
    this.videoService.findAll()
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

  handleSearch(inputValue: string) {
    this.loading = true;
    this.searchService.getVideos(inputValue)
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