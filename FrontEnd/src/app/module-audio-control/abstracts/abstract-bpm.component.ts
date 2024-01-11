import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { BpmService } from '../services/bpm.service';

@Component({ template: '' })
export abstract class AbstractBpmComponent implements OnInit {
  protected duration: number;
  protected current: number;

  constructor(protected destroy$: DestroyService, private bpmService: BpmService) {}

  ngOnInit(): void {
    this.subscribeBpm();
  }

  private subscribeBpm(): void {
    this.bpmService.getCurrent$.pipe(takeUntil(this.destroy$)).subscribe(current => (this.current = current));
    this.bpmService.getDuration$.pipe(takeUntil(this.destroy$)).subscribe(duration => (this.duration = duration));
  }

  protected get getCurrent$(): Observable<number> {
    return this.bpmService.getCurrent$.pipe(takeUntil(this.destroy$));
  }
}
