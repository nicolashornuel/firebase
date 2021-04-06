
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryGAPI } from '../../../shared/models/queryGAPI.interface';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {

  @Output() search: EventEmitter<{query: QueryGAPI, switchBackEnd: string}> = new EventEmitter<{query: QueryGAPI, switchBackEnd: string}>();
  @Output() update: EventEmitter<{switchTableCard: string, switchBackEnd: string, switchDataBase: string}> = new EventEmitter<{switchTableCard: string, switchBackEnd: string, switchDataBase: string}>();
  @Output() gridsizeChange = new EventEmitter();
  @ViewChild('myForm') ngForm: NgForm;
  panelOpenState = true;

  maxResults:number = 12;
  order: string = "DATE";
  query: QueryGAPI = {
    q: null,
    maxResults: null,
    order: null,
  };
  
  matSliderValue: number = 3;
  switchTableCard:string = "CARD";
  switchBackEnd:string = "FIREBASE"
  switchDataBase: string = "FIRESTORE";

  constructor() { }

  ngOnInit() {
    this.updatePref();
  }

  updateGrid($event) {
    this.matSliderValue = $event.value;
    this.gridsizeChange.emit(this.matSliderValue);
  }

  sendToSearch() {
    this.query.q = this.ngForm.form.value.q;
    this.query.maxResults = this.ngForm.form.value.maxResults;
    this.query.order = this.ngForm.form.value.order;
    this.search.emit({
      query: this.query,
      switchBackEnd: this.switchBackEnd,
      });  
  }

  updatePref() {
    this.update.emit({switchTableCard: this.switchTableCard, switchBackEnd: this.switchBackEnd, switchDataBase: this.switchDataBase})
  }

}
