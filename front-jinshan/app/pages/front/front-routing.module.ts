import {Routes} from '@angular/router';
import {FrontTypesComponent} from './types/types.component';
import {FrontListComponent} from './list/list.component';
import {FrontItemComponent} from './item/item.component';
import {FrontCheckoutComponent} from './checkout/checkout.component';

export const appFrontRoutes: Routes = [
  {path: 'types', component: FrontTypesComponent},
  {path: 'list/:id', component: FrontListComponent},
  {path: 'item/:id', component: FrontItemComponent},
  {path: 'checkout', component: FrontCheckoutComponent},
  {
    path: '**', redirectTo: 'list'
  }
];
