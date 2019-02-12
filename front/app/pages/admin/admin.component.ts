import {Component, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {StorageService} from '../../../../service/storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdminComponent {

  constructor(private authSvc: AuthService,
              private storageSvc: StorageService,
              private router: Router) {
    if (typeof authSvc.currentUser !== 'string') {
      router.navigate(['/auth/signIn']);
    }
  }
}
