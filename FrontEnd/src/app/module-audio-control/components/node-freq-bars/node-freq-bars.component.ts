import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-node-freq-bars',
  templateUrl: './node-freq-bars.component.html',
  styleUrls: ['./node-freq-bars.component.scss']
})
export class NodeFreqBarsComponent implements AfterViewInit {

  @Input('context') audioCtx: AudioContext;
  @Input('source') gain: GainNode;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;
  private analyser: AnalyserNode;

  ngAfterViewInit(): void {
    this.initNode();
    this.initCanvas();
  }

  private initNode(): void {
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.minDecibels = -90;            // [-100db-0db]
    this.analyser.maxDecibels = -10;            // [-100db-0db]
    this.analyser.smoothingTimeConstant = 0.85; // [0-1]
    this.analyser.fftSize = 128;                // [32-32768]
    this.gain.connect(this.analyser);
  }

  private initCanvas(): void {
    this.canvas.nativeElement.width = 200;
    this.canvas.nativeElement.height = 200;
    this.canvasCtx = this.canvas.nativeElement.getContext('2d');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.draw(bufferLength, dataArray);
  }

  private draw(bufferLength: number, dataArray: Uint8Array) {
    requestAnimationFrame(() => this.draw(bufferLength, dataArray));
    const { width, height } = this.canvas.nativeElement;
    this.analyser.getByteFrequencyData(dataArray);
    this.canvasCtx.fillStyle = "rgb(0, 0, 0)";
    this.canvasCtx.fillRect(0, 0, width, height);
    const barWidth = (width/ bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i];
      this.canvasCtx.fillStyle = "rgb(200,200,200)";
      this.canvasCtx.fillRect(
        x,
        height - barHeight / 2,
        barWidth,
        barHeight / 2
      );
      x += barWidth + 1;
    }
  };

}


