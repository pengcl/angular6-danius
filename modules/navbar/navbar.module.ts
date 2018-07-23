import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar.component';
import {NavbarService} from './navbar.service';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
  providers: [NavbarService],
  entryComponents: [NavbarComponent]
})
export class NavbarModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: NavbarModule, providers: []};
  }
}
