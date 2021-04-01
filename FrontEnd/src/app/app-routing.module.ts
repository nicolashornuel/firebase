import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VideoService } from './shared/services/video.service';

const routes: Routes = [
  { path: 'video', component: VideoService },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
