import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/services/destroy.service';
import { NodeSampleComponent } from '../components/node-sample/node-sample.component';
import { MainGainService } from '../services/mainGain.service';

@Component({
  selector: 'app-page-audio-control',
  templateUrl: './page-audio-control.component.html',
  styleUrls: ['./page-audio-control.component.scss']
})
export class PageAudioControlComponent implements OnInit, OnDestroy {
  public audioCtx: AudioContext;
  public gainNode: GainNode;
  @ViewChild('insertNodeSample', {read: ViewContainerRef}) target!: ViewContainerRef;
  public effectList: string[] = ['highpass', 'lowpass', 'Reverb', 'Delay'];
  public effectSelected: string = this.effectList[0];

  constructor(
    private gainService: MainGainService,
    private destroy$: DestroyService,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainService.getMainGainValue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(mainGainValue => (this.gainNode.gain.value = mainGainValue));
  }

  mainGainValueChange(value: number): void {
    this.gainService.setMainGainValue$(value);
  }

  addNodeSample(): void {
    const factory = this.resolver.resolveComponentFactory(NodeSampleComponent);
    const viewRef: ComponentRef<NodeSampleComponent> = this.target.createComponent<NodeSampleComponent>(factory);
    viewRef.instance.audioCtx = this.audioCtx;
    viewRef.instance.audioNode = this.gainNode;
  }

  ngOnDestroy(): void {
      this.target.remove();
  }

}
