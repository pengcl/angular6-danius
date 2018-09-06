import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IndexComponent} from './pages/index/index.component';
import {BananaIndexComponent} from './pages/banana/index/index.component';
import {BananaIndexTComponent} from './pages/banana/indexT/index.component';
import {SuccessComponent} from './pages/success/success.component';

export const routes: Routes = [
  {path: 'index', component: IndexComponent},
  {path: 'banana/index', component: BananaIndexComponent},
  {path: 'banana/indexT', component: BananaIndexTComponent},
  {path: 'success', component: SuccessComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  providers: [],
  declarations: []
})
export class AppRoutingModule {
}
