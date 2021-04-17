import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { VideoGAPI } from 'src/app/shared/models/videoGAPI.interface';
import { WatchComponent } from '../../../watch/watch.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Preference } from 'src/app/shared/models/preference.interface';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../../bottom-sheet/bottom-sheet.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { VideoService } from '../../../shared/services/video.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit {

  @Input() videos: VideoGAPI[];
  @Input() preference: Preference;
  @Input() ratingArr: number[] = [0, 1, 2, 3, 4];
  dataSource = null;
  columnsToDisplay = ['categorie', 'channelTitle', 'title', 'publishedAt', 'rating'];
  expandedElement: VideoGAPI | null;
  @Output() refresh: EventEmitter<{ preference: Preference }> = new EventEmitter<{ preference: Preference }>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  h1: string = null;

  constructor(public dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private _bottomSheet: MatBottomSheet,
    private videoService: VideoService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.videos);
    this.h1 = "Affichage des données " + this.preference.switchDataBase
    + " avec les functions " + this.preference.switchBackEnd;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  showIcon(element: VideoGAPI, index: number) {
    if (element.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  openDialog(element: VideoGAPI) {
    this.dialog.open(WatchComponent, {
      width: '432px',
      data: {
        video: {
          videoId: element.videoId,
          publishedAt: element.publishedAt,
          title: element.title,
          description: element.description,
          thumbnail: element.thumbnail,
          channelTitle: element.channelTitle,
          src: element.src,
          sanitized: this._sanitizer.bypassSecurityTrustResourceUrl(element.src),
          categorie: element.categorie,
          extractWiki: element.extractWiki,
          rating: element.rating
        },
        preference: {
          switchDataBase: this.preference.switchDataBase,
          switchBackEnd: this.preference.switchBackEnd
        }
      }
    });
  }
  
  openBottomSheetCate(element: VideoGAPI): void { 
    let data = {video:element, preference:this.preference, categorie:true};
    this._bottomSheet.open(BottomSheetComponent, {data: data});
  }

  openBottomSheetWiki(element: VideoGAPI): void { 
    let data = {video:element, preference:this.preference, wiki:true};
    this._bottomSheet.open(BottomSheetComponent, {data: data});
  }

  delete(element: VideoGAPI) {
    let data = {video:element, preference:this.preference};
    this.videoService.deleteVideo(data).subscribe(item => {
      this._snackBar.open(data.video.title + " id:" + item, "Modifié", { duration: 5000, });
      this.refresh.emit({ preference: this.preference });
    });
  }
}
