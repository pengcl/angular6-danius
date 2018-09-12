import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './_guards/auth';
import {IndexComponent} from './pages/index/index.component';
import {TestComponent} from './pages/test/test.component';
import {SignInComponent} from './pages/auth/sign-in/sign-in.component';

import {EmployeeComponent} from './pages/employee/employee.component';
import {employeeRoutes} from './pages/employee/employee-routing.module';

import {EmployerComponent} from './pages/employer/employer.component';
import {employerRoutes} from './pages/employer/employer-routing.module';

import {UsherIdentityComponent} from './pages/usher/identity/identity.component';
import {UsherEmployerComponent} from './pages/usher/employer/employer.component';
import {UsherEmployeeComponent} from './pages/usher/employee/employee.component';

import {PayPreviewComponent} from './pages/pay/preview/preview.component';

export const routes: Routes = [
  {path: 'index', component: IndexComponent, canActivate: [AuthGuard]},
  {path: 'test', component: TestComponent},
  {path: 'auth/signIn', component: SignInComponent},
  {path: 'usher/identity', component: UsherIdentityComponent, canActivate: [AuthGuard]},
  {path: 'usher/employer', component: UsherEmployerComponent, canActivate: [AuthGuard]},
  {path: 'usher/employee', component: UsherEmployeeComponent, canActivate: [AuthGuard]},

  {
    path: 'employee',
    component: EmployeeComponent,
    children: employeeRoutes,
    canActivate: [AuthGuard]
  },

  {
    path: 'employer',
    component: EmployerComponent,
    children: employerRoutes,
    canActivate: [AuthGuard]
  },

  {path: 'pay/preview/:id', component: PayPreviewComponent, canActivate: [AuthGuard]},
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
