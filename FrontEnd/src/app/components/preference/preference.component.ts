import { Component, Input, OnInit } from '@angular/core';
import { Preference } from '../../models/preference.interface';
import { PreferenceService } from 'src/app/services/preference.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit {

  preference: Preference = {
    matSliderValue: null,
    radioBackEnd: null,
    radioDataBase: null,
    switchDiscogs: null,
    maxResultsDiscogs: null,
    switchWikipedia: null,
    switchYoutube: null,
    maxResultsYoutube: null,
    orderYoutube: null
  }

  constructor(
    private preferenceService: PreferenceService,
    private _snackBar: MatSnackBar,
    private toolbar: ToolbarComponent) { }

  ngOnInit(): void {
    this.loadPref();
  }
  loadPref(){
    this.preferenceService.find().subscribe(res => {
      this.preference = res[0];
    });
  }
  savePref() {
    this.preferenceService.update(this.preference).subscribe(res => {
      this._snackBar.open("Préférence id: " + res, "Enregistré", { duration: 2000, });
      this.toolbar.drawer.close();
    });
  }
  
  switchDiscogs() {
    this.preference.switchDiscogs = !this.preference.switchDiscogs;
  }
  switchWikipedia() {
    this.preference.switchWikipedia = !this.preference.switchWikipedia;
  }
  switchYoutube() {
    this.preference.switchYoutube = !this.preference.switchYoutube;
  }


}
