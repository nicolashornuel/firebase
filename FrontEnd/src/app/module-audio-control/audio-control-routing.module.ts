import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAudioControlComponent } from './page/page-audio-control.component';

const routes: Routes = [{ path: '', component: PageAudioControlComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AudioControlRoutingModule { }
