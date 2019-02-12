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
    tabSvc.set({show: true}, 2);
  }

  ngOnInit() {
    this.authSvc.logout();

    this.loginForm = new FormGroup({
      mobile: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      code: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)])
    });
  }

  getCode(mobile) {
    if (!this.activeClass) {
      return false;
    }
    this.authSvc.getCode(mobile).then(res => {
      if (res.code === '200') {
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
      if (res.code !== '200') {
        return false;
      }
      this.authSvc.updateLoginStatus({
        key: this.loginForm.get('mobile').value,
      });
      const callbackUrl = this.authSvc.loginRedirectUrl;

      if (callbackUrl) {
        this.router.navigate([callbackUrl]);
        return false;
      }

      this.router.navigate(['/admin/order/list']);
    });
  }

  ngOnDestroy() {
    if (this.timePromise) {
      this.timePromise.unsubscribe();
    }
  }
}
