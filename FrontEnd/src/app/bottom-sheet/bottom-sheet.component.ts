import { Component, Inject, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoGAPI } from '../shared/models/videoGAPI.interface';
import { VideoService } from '../shared/services/video.service';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';



@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {

  @Input() videos: VideoGAPI[];
  @ViewChild('input') inputElement: ElementRef;
  selectedCategorie: string;
  categories: any = [];

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public video: VideoGAPI,
    private _snackBar: MatSnackBar,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private videoService: VideoService) { }

    ngOnInit(): void {      
      this.videoService.findAll(event).subscribe(array => {
        this.categories = new Set(array.map(item => item.categorie));
      })
    }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  addVideo(data) {
    console.log(data);
    data.categorie = this.inputElement.nativeElement.value;
    this.videoService.createVideo(data).subscribe(item => {
      this._snackBar.open(data.title + " id:" + item, "Ajouté", { duration: 5000, });
    })
  }

}
