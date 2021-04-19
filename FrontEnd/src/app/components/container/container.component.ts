import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { VideoGAPI } from 'src/app/models/videoGAPI.interface';
import { VideoService } from 'src/app/services/video.service';
import { WikipediaService } from 'src/app/services/wikipedia.service';
import { Preference } from 'src/app/models/preference.interface';
import { QueryGAPI } from '../../models/queryGAPI.interface';
import { DiscogsService } from 'src/app/services/discogs.service';



@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  loading: boolean = false;
  searching: boolean = false;
  videos: VideoGAPI[];
  extractWiki: string;
  query: QueryGAPI;
  discogs: any[];

  preference: Preference = {
    matSliderValue: 4,
    switchBackEnd: "FIREBASE",
    switchDataBase: "FIRESTORE",
  }

  constructor(
    private discogsService: DiscogsService,
    private searchService: SearchService,
    private wikipediaService: WikipediaService,
    private videoService: VideoService) { }

  ngOnInit(): void {
  }


  handleUpdate($event) {
    if ($event.update == "search") {
      this.searching = true;
      this.videos = [];
      this.discogs = [];
    } else {
      this.handleTable();
    }
    
  }

  handleTable() {
    let data = {preference:null}
    data.preference = this.preference;
    this.loading = true;
    this.searching = false;
    this.videoService.findAll(data).subscribe((items: any) => {
      this.videos = items.map(item => {
        return {
          videoId: item.videoId,
          publishedAt: item.publishedAt,
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail,
          channelTitle: item.channelTitle,
          src: item.src,
          categorie: item.categorie,
          extractWiki: item.extractWiki,
          rating: item.rating
        };
      });
      this.loading = false;
    });
  }

  handleSearch($event) {
    this.loading = true;
    this.query = $event.query;
    this.preference = $event.preference;
    this.discogsService.getByArtistName($event.query.q).subscribe(result => {
      this.discogs = result.results.map(elt => {
        return { title: elt.title, thumb: elt.thumb, year: elt.year, style: elt.style.join(", "), label: elt.label.join(", "), format: elt.format.join(", ") }
      })
    }
    );
    this.wikipediaService.getWiki($event.query.q, "fr").subscribe(result => {
      for (var i in result.query.pages) {
        this.extractWiki = result.query.pages[i].extract;
      }
      if (this.extractWiki == "") {
        this.wikipediaService.getWiki($event.query.q, "en").subscribe(result => {
          for (var i in result.query.pages) {
            this.extractWiki = result.query.pages[i].extract;
          }
        });
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
              src: `https://www.youtube.com/embed/${item.id.videoId}`,
              discogs: this.discogs
            };
          });
          this.searching = true;
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