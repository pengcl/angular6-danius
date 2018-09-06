import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData} from '../../../commons/js/utils';
import {CONFIG} from '../../../config/app.config';

import {AuthService} from './auth.service';

@Injectable()
export class FollowService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  follow(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=addFollow', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getFollows(key, dataType): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getFollowList&key=' + key + '&datatype=' + dataType)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  private handleExpire(response: any): Promise<any> {
    if (response.code === '1001') {
      this.authSvc.requestAuth();
      return Promise.resolve(response);
    } else {
      return Promise.resolve(response);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
