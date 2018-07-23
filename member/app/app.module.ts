import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {WeUiModule, PickerConfig} from 'ngx-weui';
import {WxModule} from '../../modules/wx';
import {MenuModule} from '../../modules/menu/menu.module';
import {NavbarModule} from '../../modules/navbar';
import {TabbarModule} from '../../modules/tabbar';
import {OverlayModule} from '../../modules/overlay';

import {SERVICES_DECLARATIONS} from './services';
import {BASE_SERVICES_DECLARATIONS} from '../../service';

import {AppComponent} from './app.component';
import {COMPONENTS_DECLARATIONS} from './components';
import {PAGES_DECLARATIONS} from './pages';

export function pickerConfig() {
  return Object.assign(new PickerConfig(), {cancel: '取消', confirm: '确认'});
}

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS_DECLARATIONS,
    ...PAGES_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    WeUiModule.forRoot(),
    WxModule.forRoot(),
    NavbarModule.forRoot(),
    TabbarModule.forRoot(),
    MenuModule.forRoot(),
    OverlayModule.forRoot()
  ],
  providers: [
    ...SERVICES_DECLARATIONS,
    ...BASE_SERVICES_DECLARATIONS,
    {provide: PickerConfig, useFactory: pickerConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
