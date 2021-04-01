import { Component, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VideoGAPI } from '../shared/models/videoGAPI.interface';
import { VideoService } from '../shared/services/video.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent {

  @Input() videos: VideoGAPI[];
  @ViewChild('input') inputElement: ElementRef;

  panelOpenState = false;
  selectedValue: string;
  selectedCategorie: string;
  categories: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public video: VideoGAPI,
    private videoService: VideoService,
    private _snackBar: MatSnackBar) {

    this.videoService.findAll().subscribe(array => {
      this.categories = new Set(array.map(item => item.categorie));
    })

  }

  addVideo(data: VideoGAPI) {
    data.categorie = this.inputElement.nativeElement.value;
    this.videoService.createVideo(data).subscribe(item => {
      this._snackBar.open(data.title + " id:" + item, "Ajouté", { duration: 5000, });
    })
  }
}
