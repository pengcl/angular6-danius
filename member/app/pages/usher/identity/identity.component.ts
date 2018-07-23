import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ToastService} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-usher-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class UsherIdentityComponent implements OnInit {

  user;
  userForm: FormGroup;

  constructor(private router: Router,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private toastSvc: ToastService,
              private authSvc: AuthService,
              private userSvc: UserService) {
    navSvc.set({title: '登记基本信息'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.userForm = new FormGroup({

      // 基本资料
      key: new FormControl('', [Validators.required]),
      usertype: new FormControl('', [Validators.required]),
    });
    this.userForm.get('key').setValue(this.user.key);

    /*this.userSvc.get(this.user.key).then(res => {
      console.log(res);
    });*/
  }

  setIdentity(type) {
    this.userForm.get('usertype').setValue(type);
    this.userSvc.set(this.userForm.value).then(res => {
      if (res.code === '0000') {
        if (res.result.user.usertype === 1) {
          this.router.navigate(['/usher/employee']);
        } else {
          this.router.navigate(['/usher/employer']);
        }
      }
    });
  }

}
