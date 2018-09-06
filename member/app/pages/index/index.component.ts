import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-index',
  template: '',
})
export class IndexComponent implements OnInit {
  user;

  constructor(private router: Router,
              private location: LocationStrategy,
              private authSvc: AuthService,
              private userSvc: UserService) {
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    if (this.user.key) {
      this.userSvc.get(this.user.key).then(res => {
        this.authSvc.updateLoginStatus({
          key: this.user.key,
          type: res.result.user.usertype || 0,
          expires_time: Date.parse(String(new Date())) + 144000000
        });
        let callbackUrl = this.authSvc.loginRedirectUrl;
        if (!res.result.user.usertype) {
          callbackUrl = '/usher/identity';
          return false;
        }

        if (callbackUrl) {
          this.router.navigate([callbackUrl]);
          return false;
        }

        if (res.result.user.usertype === 1) {
          this.router.navigate(['/employee/home'], {replaceUrl: true});
        } else {
          this.router.navigate(['/employer/home']);
        }
      });
    } else {
      this.router.navigate(['/auth/signIn']);
    }
  }
}
