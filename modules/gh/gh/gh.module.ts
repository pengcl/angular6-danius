import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {GhService} from './gh.service';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [],
  exports: [],
  providers: [GhService],
  entryComponents: []
})
export class GhModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: GhModule, providers: []};
  }
}
