import {Routes} from '@angular/router';
import {AdminIndexComponent} from './index/index.component';
import {AdminOrderListComponent} from './order/list/list.component';
import {AdminCartListComponent} from './cart/list/list.component';

export const appAdminRoutes: Routes = [
  {path: 'index', component: AdminIndexComponent},
  {path: 'order/list', component: AdminOrderListComponent},
  {path: 'cart/list', component: AdminCartListComponent},
  {
    path: '**', redirectTo: 'list'
  }
];
