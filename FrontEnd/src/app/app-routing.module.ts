import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchListComponent } from './components/search-list/search-list.component';
import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  { path: 'table/:categorie', component: TableComponent },
  { path: 'list/:q', component: SearchListComponent },
  { path: 'equalizer', loadChildren: () => import('./module-audio-control/audio-control.module').then(m => m.AudioControlModule) },
  { path: '', redirectTo: 'table/all', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
