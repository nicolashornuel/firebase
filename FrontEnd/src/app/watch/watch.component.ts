import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent {

  selectedCategorie: string;
  categories: any = [];
  panelOpenState = false;
  selectedValue: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _bottomSheet: MatBottomSheet) { }

  openBottomSheet(data: any): void {    
    this._bottomSheet.open(BottomSheetComponent, {data: data});
  }



}
