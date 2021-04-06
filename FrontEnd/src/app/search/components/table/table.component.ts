import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { VideoGAPI } from 'src/app/shared/models/videoGAPI.interface';
import { WatchComponent } from '../../../watch/watch.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit {

  @Input() videos: VideoGAPI[];
  @Input() ratingArr: number[] = [0,1,2,3,4];
  dataSource = null;
  columnsToDisplay = ['categorie', 'channelTitle', 'title', 'publishedAt', 'rating'];
  expandedElement: VideoGAPI | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.dataSource = this.videos;
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  showIcon(element: VideoGAPI, index:number) {
    if (element.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  openDialog(element: VideoGAPI) {
    this.dialog.open(WatchComponent, {
      data: {
        videoId: element.videoId,
        publishedAt: element.publishedAt,
        title: element.title,
        description: element.description,
        thumbnail: element.thumbnail,
        channelTitle: element.channelTitle,
        src: element.src,
        sanitized: this._sanitizer.bypassSecurityTrustResourceUrl(element.src),
        extractWiki: element.extractWiki,
      }
    });
  }

}
