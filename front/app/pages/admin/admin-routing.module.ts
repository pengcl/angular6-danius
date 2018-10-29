import {Routes} from '@angular/router';
import {AdminOrderListComponent} from './order/list/list.component';

export const appAdminRoutes: Routes = [
  {path: 'order/list', component: AdminOrderListComponent},
  {
    path: '**', redirectTo: 'list'
  }
];
