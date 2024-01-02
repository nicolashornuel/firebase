import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { BpmService } from '../../services/bpm.service';

@Component({
  selector: 'app-control-bpm',
  templateUrl: './control-bpm.component.html',
  styleUrls: ['./control-bpm.component.scss']
})
export class ControlBpmComponent implements OnInit {

  bpm: number;

  constructor(private bpmService: BpmService, private destroy$: DestroyService) { }

  ngOnInit(): void {
    this.bpmService.getBpmValue$.pipe(takeUntil(this.destroy$)).subscribe(bpm => this.bpm = bpm);
  }

  onBpmChange(): void {
    this.bpmService.setBpmValue$(this.bpm)
  }

}
