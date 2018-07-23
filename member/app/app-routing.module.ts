import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './_guards/auth';
import {IndexComponent} from './pages/index/index.component';
import {SignInComponent} from './pages/auth/sign-in/sign-in.component';

import {UsherIdentityComponent} from './pages/usher/identity/identity.component';
import {UsherEmployerComponent} from './pages/usher/employer/employer.component';
import {UsherEmployeeComponent} from './pages/usher/employee/employee.component';

import {ProfileComponent} from './pages/profile/profile.component';
import {ProfileProfileComponent} from './pages/profile/profile/profile.component';
import {ProfileIntentionComponent} from './pages/profile/intention/intention.component';
import {ProfileIntentionAddComponent} from './pages/profile/intention/add/add.component';
import {ProfileIntentionEditComponent} from './pages/profile/intention/edit/edit.component';
import {ProfileTroopsComponent} from './pages/profile/troops/troops.component';
import {ProfileWorksAddComponent} from './pages/profile/works/add/add.component';
import {ProfileWorksEditComponent} from './pages/profile/works/edit/edit.component';
import {ProfileEduAddComponent} from './pages/profile/edu/add/add.component';
import {ProfileEduEditComponent} from './pages/profile/edu/edit/edit.component';

import {PayPreviewComponent} from './pages/pay/preview/preview.component';

import {ResumeEditComponent} from './pages/resume/edit/edit.component';
import {ResumePreviewComponent} from './pages/resume/preview/preview.component';

import {UploaderAvatarComponent} from './pages/uploader/avatar/avatar.component';
import {UploaderGalleryComponent} from './pages/uploader/gallery/gallery.component';

export const routes: Routes = [
  {path: 'index', component: IndexComponent, canActivate: [AuthGuard]},
  {path: 'auth/signIn', component: SignInComponent},

  {path: 'usher/identity', component: UsherIdentityComponent, canActivate: [AuthGuard]},
  {path: 'usher/employer', component: UsherEmployerComponent, canActivate: [AuthGuard]},
  {path: 'usher/employee', component: UsherEmployeeComponent, canActivate: [AuthGuard]},

  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/profile', component: ProfileProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/intention', component: ProfileIntentionComponent, canActivate: [AuthGuard]},
  {path: 'profile/intention/add', component: ProfileIntentionAddComponent, canActivate: [AuthGuard]},
  {path: 'profile/intention/edit/:id', component: ProfileIntentionEditComponent, canActivate: [AuthGuard]},
  {path: 'profile/troops', component: ProfileTroopsComponent, canActivate: [AuthGuard]},
  {path: 'profile/works/add', component: ProfileWorksAddComponent, canActivate: [AuthGuard]},
  {path: 'profile/works/edit/:id', component: ProfileWorksEditComponent, canActivate: [AuthGuard]},
  {path: 'profile/edu/add', component: ProfileEduAddComponent, canActivate: [AuthGuard]},
  {path: 'profile/edu/edit/:id', component: ProfileEduEditComponent, canActivate: [AuthGuard]},

  {path: 'uploader/avatar', component: UploaderAvatarComponent, canActivate: [AuthGuard]},
  {path: 'uploader/gallery', component: UploaderGalleryComponent, canActivate: [AuthGuard]},

  {path: 'resume/edit', component: ResumeEditComponent, canActivate: [AuthGuard]},
  {path: 'resume/preview', component: ResumePreviewComponent, canActivate: [AuthGuard]},

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
