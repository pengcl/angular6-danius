import {Routes} from '@angular/router';
import {EmployeeHomeComponent} from './home/home.component';
import {EmployeeProfileComponent} from './profile/profile.component';

// find
import {EmployeeFindJobListComponent} from './find/job/list/list.component';
import {EmployeeFindJobItemComponent} from './find/job/item/item.component';
import {EmployeeFindCompanyListComponent} from './find/company/list/list.component';
import {EmployeeFindCompanyItemComponent} from './find/company/item/item.component';

// edu
import {EmployeeEduAddComponent} from './edu/add/add.component';
import {EmployeeEduEditComponent} from './edu/edit/edit.component';

// intention
import {EmployeeIntentionListComponent} from './intention/list/list.component';
import {EmployeeIntentionAddComponent} from './intention/add/add.component';
import {EmployeeIntentionEditComponent} from './intention/edit/edit.component';

// troops
import {EmployeeTroopsComponent} from './troops/troops.component';

// resume
import {EmployeeResumeEditComponent} from './resume/edit/edit.component';
import {EmployeeResumePreviewComponent} from './resume/preview/preview.component';

// works
import {EmployeeWorksAddComponent} from './works/add/add.component';
import {EmployeeWorksEditComponent} from './works/edit/edit.component';

// seeker
import {EmployeeSeekerWantedComponent} from './seeker/wanted/wanted.component';
import {EmployeeSeekerInvitedComponent} from './seeker/invited/invited.component';
import {EmployeeSeekerDeliveredComponent} from './seeker/delivered/delivered.component';
import {EmployeeSeekerInterviewedComponent} from './seeker/interviewed/interviewed.component';
import {EmployeeSeekerEvaluateComponent} from './seeker/evaluate/evaluate.component';

// message
import {EmployeeMessageListComponent} from '../employee/message/list/list.component';
import {EmployeeMessageItemComponent} from '../employee/message/item/item.component';

// follow
import {EmployeeFollowCompaniesComponent} from './follow/companies/companies.component';
import {EmployeeFollowJobsComponent} from './follow/jobs/jobs.component';

export const employeeRoutes: Routes = [
  {path: 'home', component: EmployeeHomeComponent},
  {path: 'profile', component: EmployeeProfileComponent},

  {path: 'find/job/list', component: EmployeeFindJobListComponent},
  {path: 'find/job/item/:id', component: EmployeeFindJobItemComponent},
  {path: 'find/company/list', component: EmployeeFindCompanyListComponent},
  {path: 'find/company/item/:id', component: EmployeeFindCompanyItemComponent},

  {path: 'edu/add', component: EmployeeEduAddComponent},
  {path: 'edu/edit/:id', component: EmployeeEduEditComponent},

  {path: 'intention/list', component: EmployeeIntentionListComponent},
  {path: 'intention/add', component: EmployeeIntentionAddComponent},
  {path: 'intention/edit/:id', component: EmployeeIntentionEditComponent},

  {path: 'troops', component: EmployeeTroopsComponent},

  {path: 'resume/edit', component: EmployeeResumeEditComponent},
  {path: 'resume/preview', component: EmployeeResumePreviewComponent},

  {path: 'works/add', component: EmployeeWorksAddComponent},
  {path: 'works/edit/:id', component: EmployeeWorksEditComponent},

  {path: 'seeker/wanted', component: EmployeeSeekerWantedComponent},
  {path: 'seeker/invited', component: EmployeeSeekerInvitedComponent},
  {path: 'seeker/delivered', component: EmployeeSeekerDeliveredComponent},
  {path: 'seeker/interviewed', component: EmployeeSeekerInterviewedComponent},
  {path: 'seeker/evaluate/:id', component: EmployeeSeekerEvaluateComponent},

  {path: 'message/list', component: EmployeeMessageListComponent},
  {path: 'message/item/:id', component: EmployeeMessageItemComponent},

  {path: 'follow/companies', component: EmployeeFollowCompaniesComponent},
  {path: 'follow/jobs', component: EmployeeFollowJobsComponent},
  {
    path: '**', redirectTo: 'mouse'
  }
];
