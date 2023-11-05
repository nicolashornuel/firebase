import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchListComponent } from './components/search-list/search-list.component';
import { TableComponent } from './components/table/table.component';
import { EqualizerComponent } from './components/equalizer/equalizer.component';

const routes: Routes = [
  { path: 'table/:categorie', component: TableComponent },
  { path: 'list/:q', component: SearchListComponent },
  { path: 'equalizer', component: EqualizerComponent },
  { path: '', redirectTo: 'table/all', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
