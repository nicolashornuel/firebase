import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface Control {
  [key: string]: any,
  value: any,
  apply: (value: any) => void
}
@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss']
})
export class EqualizerComponent implements OnInit, AfterViewInit {

  @ViewChild('audio') audio: ElementRef;
  @ViewChild('sineWave') sineWave!: ElementRef<HTMLCanvasElement>;
  @ViewChild('freqBars') frequencyBars!: ElementRef<HTMLCanvasElement>;
  private sineWaveCtx!: CanvasRenderingContext2D | null;
  private frequencyBarsCtx!: CanvasRenderingContext2D | null;

  public audioCtx: AudioContext;
  private analyser: AnalyserNode;
  private distortion: WaveShaperNode; //curve OverSampleType = "2x" | "4x" | "none";
  private biquadFilter: BiquadFilterNode;
  private convolver: ConvolverNode;
  public gainNode: GainNode;

  public controls: Control[] = [
    {
      name: 'biquadFilterType',
      type: 'select',
      options: ['allpass', 'bandpass', 'highpass', 'highshelf', 'lowpass', 'lowshelf', 'notch', 'peaking'],
      value: 'allpass',
      apply: (value: BiquadFilterType) => this.biquadFilter.type = value
    },
    {
      name: 'biquadFilterFrequency',
      type: 'number',
      min: 0,
      max: 24000,
      step: 10,
      value: 0,
      apply: (value: number) => this.biquadFilter.frequency.setValueAtTime(value, this.audioCtx.currentTime)
    },
    {
      name: 'WaveShaperOverSampleType',
      type: 'select',
      options: ['2x', '4x', 'none'],
      value: 'none',
      apply: (value: OverSampleType) => this.distortion.oversample = value
    },
    {
      name: 'WaveShaperCurve',
      type: 'number',
      min: 0,
      max: 100,
      step: 1,
      value: 0,
      apply: (value: number) => this.distortion.curve = this.makeDistortionCurve(value)
    },
    {
      name: 'Reverb',
      type: 'number',
      min: 0,
      max: 2.0,
      step: 0.1,
      value: 0,
      apply: (value: number) => {
        // Create an empty three-second stereo buffer at the sample rate of the AudioContext
        const myArrayBuffer = this.audioCtx.createBuffer(2, this.audioCtx.sampleRate * 2, this.audioCtx.sampleRate);
        // Fill the buffer with white noise;
        // just random values between -1.0 and 1.0
        for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
          // This gives us the actual array that contains the data
          const nowBuffering = myArrayBuffer.getChannelData(channel);
          for (let i = 0; i < myArrayBuffer.length; i++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            //nowBuffering[i] = Math.random() * 2 - 1;
            nowBuffering[i] = Math.random() * value - 1;
            //console.log(nowBuffering[i]);
            
          }
        }
        if (value != 0) {
          this.convolver.buffer = myArrayBuffer;
          this.convolver.normalize = true;
          this.biquadFilter.disconnect(0);
          this.gainNode.gain.value = 5;
          this.biquadFilter.connect(this.convolver);
        } else {
          this.biquadFilter.disconnect(0);
          this.gainNode.gain.value = 0.5;
          this.biquadFilter.connect(this.gainNode);
        }
        
      }
    }
  ];

  //https://ng-web-apis.github.io/
  //https://music.arts.uci.edu/dobrian/webaudio/tutorials/WebAudioAPI/frequencymodulation.html
  //https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
  //https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBiquadFilter#examples
  constructor() { }

  ngOnInit(): void {
    this.audioCtx = new AudioContext();
  }

  ngAfterViewInit(): void {
    this.createNode();
    this.connectNode();
    this.visualize();
  }

  private createNode(): void {
    this.analyser = this.audioCtx.createAnalyser();
    this.distortion = this.audioCtx.createWaveShaper();
    this.biquadFilter = this.audioCtx.createBiquadFilter();
    this.convolver = this.audioCtx.createConvolver();
    this.gainNode = this.audioCtx.createGain();
    this.controls.forEach(control => control.apply(control.value))
  }

  private connectNode(): void {
    const source = this.audioCtx.createMediaElementSource(this.audio.nativeElement);
    source.connect(this.distortion);
    this.distortion.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode);
    this.convolver.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }

  private visualize(): void {
    this.analyser.minDecibels = -90; //[-100db-0db]
    this.analyser.maxDecibels = -10; //[-100db-0db]
    this.analyser.smoothingTimeConstant = 0.85; // [0-1]
    this.analyser.fftSize = 512; //2048
    const bufferLength = this.analyser.fftSize;
    // We can use Float32Array instead of Uint8Array if we want higher precision
    const dataArray = new Uint8Array(bufferLength);
    const bufferLengthAlt = this.analyser.frequencyBinCount;
    const dataArrayAlt = new Uint8Array(bufferLengthAlt);
    this.clearCanvas([this.sineWave, this.frequencyBars])
    this.sineWaveCtx = this.sineWave.nativeElement.getContext('2d');
    this.frequencyBarsCtx = this.frequencyBars.nativeElement.getContext('2d');
    this.draw(bufferLength, dataArray);
    this.drawAlt(bufferLengthAlt, dataArrayAlt);
  }

  private clearCanvas(elements: ElementRef<HTMLCanvasElement>[]): void {
    elements.forEach((element: ElementRef<HTMLCanvasElement>) => {
      const canvas: HTMLCanvasElement = element.nativeElement;
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  draw(bufferLength: any, dataArray: any) {
    requestAnimationFrame(() => this.draw(bufferLength, dataArray));
    const WIDTH = this.sineWave.nativeElement.width;
    const HEIGHT = this.sineWave.nativeElement.height;
    this.analyser.getByteTimeDomainData(dataArray);
    this.sineWaveCtx.fillStyle = "rgb(200, 200, 200)";
    this.sineWaveCtx.fillRect(0, 0, WIDTH, HEIGHT);
    this.sineWaveCtx.lineWidth = 2;
    this.sineWaveCtx.strokeStyle = "rgb(0, 0, 0)";
    this.sineWaveCtx.beginPath();
    const sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;
      if (i === 0) {
        this.sineWaveCtx.moveTo(x, y);
      } else {
        this.sineWaveCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.sineWaveCtx.lineTo(WIDTH, HEIGHT / 2);
    this.sineWaveCtx.stroke();
  };

  drawAlt(bufferLength: any, dataArray: any) {
    requestAnimationFrame(() => this.drawAlt(bufferLength, dataArray));
    const WIDTH = this.sineWave.nativeElement.width;
    const HEIGHT = this.sineWave.nativeElement.height;
    this.analyser.getByteFrequencyData(dataArray);
    this.frequencyBarsCtx.fillStyle = "rgb(0, 0, 0)";
    this.frequencyBarsCtx.fillRect(0, 0, WIDTH, HEIGHT);
    const barWidth = (WIDTH / bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i];
      this.frequencyBarsCtx.fillStyle = "rgb(200,200,200)";
      this.frequencyBarsCtx.fillRect(
        x,
        HEIGHT - barHeight / 2,
        barWidth,
        barHeight / 2
      );
      x += barWidth + 1;
    }
  };

  makeDistortionCurve(amount) {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; i++) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }

    return curve;
  }

}

