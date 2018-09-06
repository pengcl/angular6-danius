import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SwiperModule} from 'ngx-swiper-wrapper';
import {WeUiModule, PickerConfig} from 'ngx-weui';
import {WxModule} from '../../modules/wx';

import {BASE_SERVICES_DECLARATIONS} from '../../service';
import {SERVICES_DECLARATIONS} from './services';
import {PAGES_DECLARATIONS} from './pages';

import {AppComponent} from './app.component';

export function pickerConfig() {
  return Object.assign(new PickerConfig(), {cancel: '取消', confirm: '确认'});
}

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    WeUiModule.forRoot(),
    WxModule.forRoot()
  ],
  providers: [
    ...BASE_SERVICES_DECLARATIONS,
    ...SERVICES_DECLARATIONS,
    {provide: PickerConfig, useFactory: pickerConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
