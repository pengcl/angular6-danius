import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './_guards/auth';
import {IndexComponent} from './pages/index/index.component';
import {SignInComponent} from './pages/auth/sign-in/sign-in.component';
import {PayPreviewComponent} from './pages/pay/preview/preview.component';

export const routes: Routes = [
  {path: 'index', component: IndexComponent, canActivate: [AuthGuard]},
  {path: 'auth/signIn', component: SignInComponent},
  {path: 'pay/preview/:id', component: PayPreviewComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ],
  declarations: []
})
export class AppRoutingModule {
}
