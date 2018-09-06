import {Routes} from '@angular/router';

import {EmployerHomeComponent} from './home/home.component';
import {EmployerMapComponent} from './map/map.component';
import {EmployerQualifyComponent} from './qualify/qualify.component';
import {EmployerProfileComponent} from './profile/profile.component';

// job
import {EmployerJobListComponent} from './job/list/list.component';
import {EmployerJobItemComponent} from './job/item/item.component';
import {EmployerJobAddComponent} from './job/add/add.component';
import {EmployerJobEditComponent} from './job/edit/edit.component';

// address
import {EmployerAddressAddComponent} from './address/add/add.component';
import {EmployerAddressEditComponent} from './address/edit/edit.component';

// company
import {EmployerCompanyIndexComponent} from './company/index/index.component';
import {EmployerCompanyBaseComponent} from './company/base/base.component';
import {EmployerCompanyAlbumsComponent} from './company/albums/albums.component';
import {EmployerCompanyStaffListComponent} from './company/staff/list/list.component';
import {EmployerCompanyStaffAddComponent} from './company/staff/add/add.component';
import {EmployerCompanyStaffEditComponent} from './company/staff/edit/edit.component';
import {EmployerCompanyProductListComponent} from './company/product/list/list.component';
import {EmployerCompanyProductAddComponent} from './company/product/add/add.component';
import {EmployerCompanyProductEditComponent} from './company/product/edit/edit.component';

// seeker
import {EmployerSeekerWantedComponent} from './seeker/wanted/wanted.component';
import {EmployerSeekerInvitedComponent} from './seeker/invited/invited.component';
import {EmployerSeekerInterviewedComponent} from './seeker/interviewed/interviewed.component';
import {EmployerSeekerEvaluateComponent} from './seeker/evaluate/evaluate.component';

// messages
import {EmployerMessageListComponent} from './message/list/list.component';
import {EmployerMessageItemComponent} from './message/item/item.component';

// find
import {EmployerFindListComponent} from './find/list/list.component';
import {EmployerFindItemComponent} from './find/item/item.component';

export const employerRoutes: Routes = [
  {path: 'home', component: EmployerHomeComponent},
  {path: 'qualify', component: EmployerQualifyComponent},
  {path: 'profile', component: EmployerProfileComponent},
  {path: 'map', component: EmployerMapComponent},

  {path: 'job/list', component: EmployerJobListComponent},
  {path: 'job/item/:id', component: EmployerJobItemComponent},
  {path: 'job/add', component: EmployerJobAddComponent},
  {path: 'job/edit/:id', component: EmployerJobEditComponent},

  {path: 'address/add', component: EmployerAddressAddComponent},
  {path: 'address/edit/:id', component: EmployerAddressEditComponent},

  {path: 'company/index', component: EmployerCompanyIndexComponent},
  {path: 'company/base', component: EmployerCompanyBaseComponent},
  {path: 'company/albums', component: EmployerCompanyAlbumsComponent},
  {path: 'company/staff/list', component: EmployerCompanyStaffListComponent},
  {path: 'company/staff/add', component: EmployerCompanyStaffAddComponent},
  {path: 'company/staff/edit/:id', component: EmployerCompanyStaffEditComponent},
  {path: 'company/product/list', component: EmployerCompanyProductListComponent},
  {path: 'company/product/add', component: EmployerCompanyProductAddComponent},
  {path: 'company/product/edit/:id', component: EmployerCompanyProductEditComponent},

  {path: 'seeker/wanted', component: EmployerSeekerWantedComponent},
  {path: 'seeker/invited', component: EmployerSeekerInvitedComponent},
  {path: 'seeker/interviewed', component: EmployerSeekerInterviewedComponent},
  {path: 'seeker/evaluate/:id', component: EmployerSeekerEvaluateComponent},

  {path: 'message/list', component: EmployerMessageListComponent},
  {path: 'message/item/:id', component: EmployerMessageItemComponent},

  {path: 'find/list', component: EmployerFindListComponent},
  {path: 'find/item/:id', component: EmployerFindItemComponent},
  {
    path: '**', redirectTo: 'home'
  }
];
