import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryGAPI } from '../../models/queryGAPI.interface';
import { Preference } from '../../models/preference.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() search: EventEmitter<{ query: QueryGAPI, preference: Preference }> = new EventEmitter<{ query: QueryGAPI, preference: Preference }>();
  @ViewChild('myForm') ngForm: NgForm;
  query: QueryGAPI = {
    q: null,
    maxResults: 12,
    order: "RELEVANCE",
    key: null,
    part: null,
    type: null,
  }
  preference: Preference = {
    matSliderValue: 4,
    switchBackEnd: "FIREBASE",
    switchDataBase: "FIRESTORE",
  }

  constructor() { }

  ngOnInit(): void {
  }

  sendToSearch() {
    this.query.q = this.ngForm.form.value.q;
    this.query.maxResults = this.ngForm.form.value.maxResults;
    this.query.order = this.ngForm.form.value.order;
    this.search.emit({ query: this.query, preference: this.preference });
  }

}
