import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchListComponent } from './components/search-list/search-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WatchComponent } from './components/watch/watch.component';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import { TableComponent } from './components/table/table.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PreferenceComponent } from './components/preference/preference.component';
import { RadioPlayerComponent } from './components/radio-player/radio-player.component';
import { RssFluxComponent } from './components/rss-flux/rss-flux.component';
import { GraphQLModule } from './graphql.module';
import { Observable } from 'rxjs';
import { Preference } from './models/preference.interface';
import { map, tap } from 'rxjs/operators';
import { PreferenceService } from './services/preference.service';
import { environment } from 'src/environments/environment.prod';



function initializeAppFactory(httpClient: HttpClient, preferenceService: PreferenceService): () => Observable<Preference> {
  const URL_BACKEND: string = environment.urlBack;
  return () => httpClient.get<Preference[]>(`${URL_BACKEND}pref`).pipe(
    map((preferences: Preference[]) => {
      return preferences[0];
    }),
    tap((preference: Preference) => {
      preferenceService.setPreference(preference);
    })
  );
 }
 
@NgModule({
  declarations: [
    AppComponent,
    SearchListComponent,
    WatchComponent,
    BottomSheetComponent,
    TableComponent,
    StarRatingComponent,
    ToolbarComponent,
    PreferenceComponent,
    RadioPlayerComponent,
    RssFluxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeAppFactory,
    deps: [HttpClient],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
