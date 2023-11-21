import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-control-sliding',
  templateUrl: './control-sliding.component.html',
  styleUrls: ['./control-sliding.component.scss']
})
export class ControlSlidingComponent implements OnInit, ControlValueAccessor {

  @Input('name') name: string;
  @Input('value') value: number;
  @Output() valueChange = new EventEmitter<number>();
  //@Output() valueChange = new EventEmitter<{name: string, value: number}>();

  constructor() { }
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  onChange():void {
    //this.change.emit({name: this.name, value: this.value})
  }

}
