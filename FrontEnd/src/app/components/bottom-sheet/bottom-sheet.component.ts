import { Component, Inject, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoGAPI } from '../../models/videoGAPI.interface';
import { VideoService } from '../../services/video.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
})
export class BottomSheetComponent implements OnInit {

  @Input() videos: VideoGAPI[];
  @Input() video: VideoGAPI;
  @ViewChild('input') inputElement: ElementRef;
  categories: any = [];
  rating: number;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private videoService: VideoService) { }


  ngOnInit(): void {
    this.rating = this.data.video.rating;
    this.videoService.findAll(this.data).subscribe(array => {
      this.categories = new Set(array.map(item => item.categorie));
    })
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  updateVideo($event) {
    this.data.video.rating = $event;
    this.videoService.updateVideo(this.data).subscribe(item => {
      this._snackBar.open(this.data.video.title + " id:" + item, "Modifié", { duration: 5000, });
    })
  }

  addVideo(data) {
    data.video.rating = 1;
    data.video.categorie = this.inputElement.nativeElement.value;
    this.videoService.createVideo(data).subscribe(item => {
      this._snackBar.open(data.video.title + " id:" + item, "Ajouté", { duration: 5000, });
    })
  }

}
