import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {interval as observableInterval} from 'rxjs';
import {DialogService} from 'ngx-weui';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;

  activeText = '获取验证码';
  activeClass = true;
  second = 59;
  timePromise;

  isKeyboardShow = false;

  loading = false;

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService) {
    navSvc.set({show: false, title: '登陆'});
    tabSvc.set({show: false});
  }

  ngOnInit() {

    this.authSvc.logout();

    this.loginForm = new FormGroup({
      mobile: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      type: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      unionid: new FormControl('', [])
    });

    this.loginForm.get('type').setValue(0);
  }

  getCode(mobile) {
    if (!this.activeClass) {
      return false;
    }
    this.authSvc.getCode(mobile).then(res => {
      if (res.code === '0000') {
        this.activeClass = false;
        this.timePromise = observableInterval(1000).subscribe(() => {
          if (this.second <= 0) {
            this.timePromise.unsubscribe();

            this.second = 59;
            this.activeText = '重发验证码';
            this.activeClass = true;
          } else {
            this.activeText = '' + this.second + 's';
            this.activeClass = false;
            this.second = this.second - 1;
          }
        });
      } else {
        this.dialogSvc.show({
          content: res.msg,
          cancel: '',
          confirm: '我知道了'
        }).subscribe();
      }
    });
  }

  // 18620803688
  onSubmit() {
    if (this.loading || this.loginForm.invalid) {
      return false;
    }
    this.loading = true;

    this.authSvc.signIn(this.loginForm.value).then(res => {
      this.loading = false;
      if (res.code !== '0000') {
        return false;
      }
      console.log(res);
      this.authSvc.updateLoginStatus({
        key: res.result.key,
        expires_time: Date.parse(String(new Date())) + 144000000
      });
      let callbackUrl = this.authSvc.loginRedirectUrl || '/index';
      if (!res.result.user.usertype) {
        callbackUrl = '/usher/identity';
      }
      this.router.navigate([callbackUrl]);
    });
  }

  ngOnDestroy() {
    if (this.timePromise) {
      this.timePromise.unsubscribe();
    }
  }
}
