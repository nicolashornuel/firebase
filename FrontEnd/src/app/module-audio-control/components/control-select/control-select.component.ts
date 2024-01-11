import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Selectable } from '../../models/input.interface';

@Component({
  selector: 'app-control-select',
  templateUrl: './control-select.component.html',
  styleUrls: ['./control-select.component.scss']
})
export class ControlSelectComponent {
  @Input() items: Selectable[];
  @Input() selected: Selectable;
  @Output() selectedChange = new EventEmitter<Selectable>();
}
