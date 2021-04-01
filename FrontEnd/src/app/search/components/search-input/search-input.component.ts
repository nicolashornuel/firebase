
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QueryGAPI } from '../../../shared/models/queryGAPI.interface';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {

  @Output() search: EventEmitter<QueryGAPI> = new EventEmitter<QueryGAPI>();
  @Output() gridsizeChange = new EventEmitter();
  @ViewChild('myForm') ngForm: NgForm;
  gridsize: number = 0;
  panelOpenState = true;
  matSelectValue: any;
  query: QueryGAPI = {
    q: null,
    maxResults: null,
    order: null,
  };

  constructor() { }

  updateGrid(event) {
    this.gridsize = event.value;
    this.gridsizeChange.emit(this.gridsize);
  }

  sendToSearch() {
    this.query.q = this.ngForm.form.value.q;
    this.query.maxResults = this.ngForm.form.value.maxResults;
    this.query.order = this.ngForm.form.value.order;
    console.log(this.query);
    this.search.emit(this.query);
    
  }


}
