import { ElementRef } from "@angular/core";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { Observable } from "rxjs";

export interface PadControlable {
  onEventChange(event: PadEvent): void;
  updateFromPosition(x: number, y: number): void;
  isPersistChange(event: MatSlideToggleChange): void
}

export interface PadEvent {
  type: 'end' | 'start' | 'move';
  x?: number;
  y?: number;
  canvas?: ElementRef<HTMLCanvasElement>
}

export interface Position {
  x: number;
  y: number;
}

export interface ControlObservable {
  supplier$: Observable<number>,
  consumer(position: Position, value: number): Position
}

export const PAD_MAX = 250;
