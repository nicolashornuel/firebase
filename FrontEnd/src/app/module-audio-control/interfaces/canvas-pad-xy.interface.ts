import { ElementRef } from "@angular/core";

export interface CanvasPadXY {
    canvasfilter: ElementRef<HTMLCanvasElement>;
    //ctx: CanvasRenderingContext2D;
    isMoving: boolean;
    isPersist: boolean;
    //clearCanvas(): void;
    //drawFromEvent(event: MouseEvent): void;
    onEventStart(event: MouseEvent): void;
    onEventMove(event: MouseEvent): void;
    //getPositionFromEvent(event: MouseEvent): Position;
    updateFromPosition(x: number, y: number): void;
}

export interface Position {
    x: number;
    y: number;
}
