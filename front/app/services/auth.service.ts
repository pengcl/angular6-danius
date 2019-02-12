import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {Observable, Subject} from 'rxjs/index';

import {formData} from '../../../commons/js/utils';

import {StorageService} from '../../../service/storage.service';
import {UaService} from '../../../service/ua.service';

@Injectable()
export class AuthService {

  public loginRedirectUrl: string;
  private loginStatus = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private uaSvc: UaService) {
  }

  requestAuth() {
    if (this.router.url.indexOf('signIn') !== -1) {
      return false;
    }
    if (this.loginRedirectUrl) {
      return false;
    }

    this.loginRedirectUrl = this.router.url;
    this.router.navigate(['/auth/signIn']);
  }

  getKey() {
    // this.redirectUrl = this.router.url;
    let openid, user;

    // 判断accessToken是否在存并是否过期
    if (this.storageSvc.get('user')) {
      user = JSON.parse(this.storageSvc.get('user'));
      return user;
    } else {// accessToken不存在或已过期
      if (this.uaSvc.isWx()) {// 微信环境
        if (this.route.snapshot.queryParams['phoneNumber']) {
          user = this.route.snapshot.queryParams['phoneNumber'];
          openid = this.route.snapshot.queryParams['openid'];
          this.storageSvc.set('user', user);
          this.storageSvc.set('openid', openid);
          this.router.navigate([this.location.path().split('?')[0]]);
        } else if (this.route.snapshot.queryParams['openid']) {// url中存在openId;
          openid = this.route.snapshot.queryParams['openid'];
          this.storageSvc.set('openid', openid);
          return this.router.navigate(['/auth/signIn'], {queryParams: {openid: openid}});
        } else {// url中不存在openId;
          window.location.href = 'http://pay.yfq.cn/member/auth.ht?callBackUrl=' + encodeURI(window.location.href);
        }
      } else {// 非微信环境
        this.router.navigate(['/auth/signIn'], {queryParams: {callbackUrl: this.router.url}});
      }
    }
  }

  signIn(body): Promise<any> {
    if (this.isLogged) {
      this.logout();
    }

    const params = {
      phoneNumber: body.mobile,
      code: body.code
    };

    return this.http.post('/api/member/login.ht', formData(params))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getCode(mobile): Promise<any> {
    return this.http.get('/api/productinf/sendValidCode.ht?recieverMobile=' + mobile)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  logout(): void {
    this.storageSvc.remove('user');
    this.loginStatus.next(this.isLogged);
    this.router.navigate(['/auth/signIn']);
  }

  get currentUser() {
    const user = this.storageSvc.get('user');
    return JSON.parse(user);
  }

  get isLogged(): boolean {
    this.loginStatus.next(!!this.currentUser);
    return !!this.currentUser;
  }

  getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }

  updateLoginStatus(user) {
    this.storageSvc.set('user', JSON.stringify(user));
    this.loginStatus.next(this.isLogged);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
