import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {WeUiModule} from 'ngx-weui';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WeUiModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
