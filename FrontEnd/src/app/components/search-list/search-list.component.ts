import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { VideoGAPI } from '../../models/videoGAPI.interface';
import { MatDialog } from '@angular/material/dialog';
import { WatchComponent } from '../watch/watch.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Preference } from 'src/app/models/preference.interface';
import { QueryGAPI } from '../../models/queryGAPI.interface';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit {

  @Input() videos: VideoGAPI[] = [];
  @Input() gridColumns: number;
  @Input() extractWiki: string;
  @Input() preference: Preference;
  @Input() discogs: any[] = [];
  @Output() gridsizeChange = new EventEmitter();
  @Input() query: QueryGAPI;
  @ViewChild('myForm') ngForm: NgForm;
  @Output() search: EventEmitter<{ query: QueryGAPI, preference: Preference }> = new EventEmitter<{ query: QueryGAPI, preference: Preference }>();


  h1: string = null;


  constructor(public dialog: MatDialog, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    //this.h1 = `"${this.query.q}" : ${this.query.maxResults} vidéos Youtube trouvées (TRI PAR : ${this.query.order})`;
  }

  sendToSearch() {
    this.h1 = `"${this.query.q}" : ${this.query.maxResults} vidéos Youtube trouvées (TRI PAR : ${this.query.order})`;
    this.query.q = this.ngForm.form.value.q;
    this.query.maxResults = this.ngForm.form.value.maxResults;
    this.query.order = this.ngForm.form.value.order;
    this.search.emit({ query: this.query, preference: this.preference });
  }

  updateGrid($event) {
    this.preference.matSliderValue = $event.value;
    this.gridsizeChange.emit(this.preference.matSliderValue);
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