import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { HttpClientModule } from '@angular/common/http';
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
import { APP_INITIALIZER } from '@angular/core';
import { PreferenceService } from './services/preference.service';
import { AudioElementComponent } from './components/audio-element/audio-element.component';
import { IframeTrackerDirective } from './directives/iframe-tracker.directive';
import { AudioControllerComponent } from './components/audio-controller/audio-controller.component';
import { EqualizerComponent } from './components/equalizer/equalizer.component';

export function initializeApp(pref: PreferenceService) {
  return (): Promise<any> => { 
    return pref.init();
  }
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
    RssFluxComponent,
    AudioElementComponent,
    IframeTrackerDirective,
    AudioControllerComponent,
    EqualizerComponent
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
      useFactory: initializeApp,
      deps: [PreferenceService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
