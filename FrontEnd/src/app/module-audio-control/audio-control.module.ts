import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageAudioControlComponent } from './page/page-audio-control.component';
import { NodeFilterComponent } from './components/node-filter/node-filter.component';
import { NodeEqComponent } from './components/node-eq/node-eq.component';
import { ControlPadComponent } from './components/control-pad/control-pad.component';

import { AudioControlRoutingModule } from './audio-control-routing.module';
import { MaterialModule } from '../modules/material.module';
import { NodeSineWaveComponent } from './components/node-sine-wave/node-sine-wave.component';
import { NodeFreqBarsComponent } from './components/node-freq-bars/node-freq-bars.component';
import { FormsModule } from '@angular/forms';
import { TruncateFreqPipe } from './pipes/truncate-freq.pipe';
import { ControlSlidingComponent } from './components/control-sliding/control-sliding.component';
import { NodeReverbComponent } from './components/node-reverb/node-reverb.component';

@NgModule({
  declarations: [PageAudioControlComponent, NodeFilterComponent, NodeEqComponent, ControlPadComponent, NodeSineWaveComponent, NodeFreqBarsComponent, TruncateFreqPipe, ControlSlidingComponent, NodeReverbComponent],
  imports: [
    CommonModule,
    AudioControlRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class AudioControlModule { }
