import {IndexComponent} from './index/index.component';
import {SignInComponent} from './auth/sign-in/sign-in.component';
import {SuccessComponent} from './success/success.component';
import {FRONT_PAGES_DECLARATIONS} from './front';
import {ADMIN_PAGES_DECLARATIONS} from './admin';
import {BananaIndexComponent} from './banana/index/index.component';
import {BananaIndexTComponent} from './banana/indexT/index.component';

export const PAGES_DECLARATIONS = [
  IndexComponent,
  SignInComponent,
  SuccessComponent,
  ...FRONT_PAGES_DECLARATIONS,
  ...ADMIN_PAGES_DECLARATIONS,
  BananaIndexComponent,
  BananaIndexTComponent
];
