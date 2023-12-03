import { ElementRef } from "@angular/core";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { Observable } from "rxjs";

export interface PadControlable {
  isPersist: boolean;
  padParam: PadParam;
  onPersistChange(event: MatSlideToggleChange): void
}

export interface Position {
  x: number;
  y: number;
}

export const PAD_MAX = 250;

export interface PadParam {
  canvas?: ElementRef<HTMLCanvasElement>;
  libelleX: string;
  libelleY: string;
  subValue$?: Observable<number>;
  currentPosition?: Position;
  updatePosition?(position: Position, value: number): Position;
  onEventStart?(): void;
  onEventMove?(position: Position): void;
  onEventEnd?(): void
}
