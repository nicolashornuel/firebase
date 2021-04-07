import { Component, Input} from '@angular/core';
import { VideoGAPI } from '../../../shared/models/videoGAPI.interface';
import { MatDialog } from '@angular/material/dialog';
import { WatchComponent } from '../../../watch/watch.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Preference } from 'src/app/shared/models/preference.interface';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent {

  @Input() videos: VideoGAPI[];
  @Input() gridColumns: number;
  @Input() extractWiki: string;
  @Input() preference: Preference;

  constructor(public dialog: MatDialog, private _sanitizer: DomSanitizer) { }

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
          extractWiki: this.extractWiki,
        },
        preference: {
          switchDataBase: this.preference.switchDataBase,
          switchBackEnd: this.preference.switchBackEnd,
        }
      }
    });
  }

}