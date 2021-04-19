import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() update: EventEmitter<{ update: string }> = new EventEmitter<{ update: string }>();
  

  constructor() { }

  ngOnInit(): void {
    this.openTable();
  }

  openSearch() {
    this.update.emit({ update: "search" })
  }

  openTable() {
    this.update.emit({ update: "table" })
  }
}
