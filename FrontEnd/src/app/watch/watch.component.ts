import { Component, Inject, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoGAPI } from '../shared/models/videoGAPI.interface';
import { VideoService } from '../shared/services/video.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';


@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent {

  @Input() videos: VideoGAPI[];
  selectedCategorie: string;
  categories: any = [];
  
  panelOpenState = false;
  selectedValue: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public video: VideoGAPI,
    private videoService: VideoService,
    private _bottomSheet: MatBottomSheet) { }



  openBottomSheet(video: VideoGAPI): void {
    this._bottomSheet.open(BottomSheetComponent, {data: video});
    console.log(video);
  }



}
