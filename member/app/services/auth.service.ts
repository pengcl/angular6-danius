import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs/index';
import {CONFIG} from '../../../config/app.config';

import {formData} from '../../../commons/js/utils';

import {StorageService} from '../../../service/storage.service';

@Injectable()
export class AuthService {

  public loginRedirectUrl: string;
  private loginStatus = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router,
              private storageSvc: StorageService) {
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

  signIn(body): Promise<any> {
    if (this.isLogged) {
      this.logout();
    }

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=login', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  signUp(body): Promise<any> {
    if (this.isLogged) {
      this.logout();
    }

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=login', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getCode(mobile): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=sendValidCode&mobile=' + mobile)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  logout(): void {
    this.storageSvc.clear();
    this.loginStatus.next(this.isLogged);
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
