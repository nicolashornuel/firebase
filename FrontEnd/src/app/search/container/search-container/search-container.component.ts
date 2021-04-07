import { Component } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { VideoGAPI } from 'src/app/shared/models/videoGAPI.interface';
import { VideoService } from 'src/app/shared/services/video.service';
import { WikipediaService } from 'src/app/shared/services/wikipedia.service';
import { Preference } from 'src/app/shared/models/preference.interface';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent {

  loading = false;
  searching = false;
  h1 = null;
  videos: VideoGAPI[] = [];
  extractWiki: string;
  preference: Preference = {
    matSliderValue: 3,
    switchTableCard: null,
    switchBackEnd: null,
    switchDataBase: null,
  }

  constructor(
    private searchService: SearchService,
    private wikipediaService: WikipediaService,
    private videoService: VideoService) { }

  updateGridSize(count) {
    this.preference.matSliderValue = count;
  }

  handleUpdate($event) {
    this.loading = true;
    this.searching = false;
    this.videoService.findAll($event).subscribe((items: any) => {
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
      this.h1 = "Affichage des données " + $event.preference.switchDataBase
      + " avec les functions " + $event.preference.switchBackEnd;
      this.loading = false;
    });
  }

  handleSearch($event) {
    this.loading = true;
    this.searching = true;
    this.preference.switchBackEnd = $event.preference.switchBackEnd;
    this.preference.switchDataBase = $event.preference.switchDataBase;
    this.wikipediaService.getWiki($event.query.q).subscribe(result => {
      for (var i in result.query.pages) {
        this.extractWiki = result.query.pages[i].extract;
      }
    });
    this.searchService.getVideos($event).subscribe((items: any) => {
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
      this.h1 = "Recherche Youtube : " + $event.query.q + " trié par " + $event.query.order;
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