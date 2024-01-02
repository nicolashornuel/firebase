import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { BpmService } from '../services/bpm.service';

@Component({ template: '' })
export abstract class AbstractBpmComponent implements OnInit {

  protected beatDuration: number;
  protected current: number;
  
  constructor(protected destroy$: DestroyService, private bpmService: BpmService) { }

  ngOnInit(): void {
    this.subscribeBpm();
  }

  private subscribeBpm(): void {
    this.bpmService.getCurrent$.pipe(takeUntil(this.destroy$)).subscribe(current => this.current = current);
    this.bpmService.getBeatDuration$.pipe(takeUntil(this.destroy$)).subscribe(beatDuration => this.beatDuration = beatDuration / 1000);
  }

  protected get getInterval$(): Observable<number> {
    return this.bpmService.getInterval$.pipe(takeUntil(this.destroy$));
  }

}
