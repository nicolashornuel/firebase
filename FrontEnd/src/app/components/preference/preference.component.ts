import {Component, OnInit} from '@angular/core';
import {Preference} from '../../models/preference.interface';
import {PreferenceService} from 'src/app/services/preference.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ToolbarComponent} from '../toolbar/toolbar.component';
import {StationsEnum} from 'src/app/enums/radioFrance.enum';
import {concatMap, switchMap, take, takeUntil} from 'rxjs/operators';
import {EMPTY} from 'rxjs';
import {DestroyService} from 'src/app/services/destroy.service';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit {
  public stations: string[] = Object.values(StationsEnum);
  public stationsk: string[] = Object.keys(StationsEnum);
  public preference: Preference;

  constructor(
    private preferenceService: PreferenceService,
    private _snackBar: MatSnackBar,
    private toolbar: ToolbarComponent,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.loadPref();
  }

  loadPref() {
    this.preferenceService.getPreference$.pipe(takeUntil(this.destroy$))
      .subscribe((preference: Preference) => this.preference = preference);
  }

  savePref() {
    this.preferenceService
      .update(this.preference)
      .pipe(take(1))
      .subscribe(res => {
        this._snackBar.open('Préférence id: ' + res, 'Enregistré', {duration: 2000});
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
