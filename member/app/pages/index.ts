import {IndexComponent} from './index/index.component';
import {TestComponent} from './test/test.component';
import {SignInComponent} from './auth/sign-in/sign-in.component';

// usher
import {UsherIdentityComponent} from './usher/identity/identity.component';
import {UsherEmployerComponent} from './usher/employer/employer.component';
import {UsherEmployeeComponent} from './usher/employee/employee.component';

// pay
import {PayPreviewComponent} from './pay/preview/preview.component';

// uploader
import {UploaderAvatarComponent} from './uploader/avatar/avatar.component';
import {UploaderGalleryComponent} from './uploader/gallery/gallery.component';

// employee
import {EMPLOYEE_PAGES_DECLARATIONS} from './employee';

// employer
import {EMPLOYER_PAGES_DECLARATIONS} from './employer';

export const PAGES_DECLARATIONS = [
  IndexComponent,
  TestComponent,
  SignInComponent,
  UsherIdentityComponent,
  UsherEmployerComponent,
  UsherEmployeeComponent,
  PayPreviewComponent,
  UploaderAvatarComponent,
  UploaderGalleryComponent,
  ...EMPLOYEE_PAGES_DECLARATIONS,
  ...EMPLOYER_PAGES_DECLARATIONS
];
