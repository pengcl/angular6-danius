import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';

import {WeUiModule} from 'ngx-weui';
import {WxModule} from '../../modules/wx';
import {MenuModule} from '../../modules/menu/menu.module';

import {SERVICES_DECLARATIONS} from './services';
import {BASE_SERVICES_DECLARATIONS} from '../../service';

import {AppComponent} from './app.component';
import {COMPONENTS_DECLARATIONS} from './components';
import {PAGES_DECLARATIONS} from './pages';

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
    WeUiModule.forRoot(),
    WxModule.forRoot(),
    MenuModule.forRoot()
  ],
  providers: [
    ...SERVICES_DECLARATIONS,
    ...BASE_SERVICES_DECLARATIONS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
