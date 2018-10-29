import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './_guards/auth';
import {IndexComponent} from './pages/index/index.component';
import {appFrontRoutes} from './pages/front/front-routing.module';
import {FrontComponent} from './pages/front/front.component';
import {appAdminRoutes} from './pages/admin/admin-routing.module';
import {AdminComponent} from './pages/admin/admin.component';
/*import {ArticleBananaComponent} from './pages/article/banana/banana.component';*/
import {SuccessComponent} from './pages/success/success.component';

import {SignInComponent} from './pages/auth/sign-in/sign-in.component';

export const routes: Routes = [
  {path: 'index', component: IndexComponent},
  {
    path: 'front',
    component: FrontComponent,
    children: appFrontRoutes
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: appAdminRoutes
  },
  {path: 'success', component: SuccessComponent},
  {path: 'auth/signIn', component: SignInComponent},
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
