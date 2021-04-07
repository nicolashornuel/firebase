
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryGAPI } from '../../../shared/models/queryGAPI.interface';
import { Preference } from '../../../shared/models/preference.interface';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {

  @Output() search: EventEmitter<{ query: QueryGAPI, preference: Preference }> = new EventEmitter<{ query: QueryGAPI, preference: Preference }>();
  @Output() update: EventEmitter<{ preference: Preference }> = new EventEmitter<{ preference: Preference }>();
  @Output() gridsizeChange = new EventEmitter();
  @ViewChild('myForm') ngForm: NgForm;
  panelOpenState = true;
  

  query: QueryGAPI = {
    q: null,
    maxResults: 12,
    order: "DATE",
  }

  preference: Preference = {
    matSliderValue: 3,
    switchTableCard: "TABLE",
    switchBackEnd: "FIREBASE",
    switchDataBase: "FIRESTORE",
  }

  constructor() { }

  ngOnInit() {
    this.updatePref();
  }

  updateGrid($event) {
    this.preference.matSliderValue = $event.value;
    this.gridsizeChange.emit(this.preference.matSliderValue);
  }

  sendToSearch() {
    this.query.q = this.ngForm.form.value.q;
    this.query.maxResults = this.ngForm.form.value.maxResults;
    this.query.order = this.ngForm.form.value.order;
    this.search.emit({ query: this.query, preference: this.preference });
  }

  updatePref() {
    this.update.emit({ preference: this.preference })
  }

}
