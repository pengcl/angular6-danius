import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData, formDataToUrl} from '../../../commons/js/utils';
import {CONFIG} from '../../../config/app.config';

import {AuthService} from './auth.service';

@Injectable()
export class JobService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  getPositions(): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getPositionList')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getIndustry(): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getTradeList')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  findJobs(body): Promise<any> {
    console.log(CONFIG.prefix.wApi + '/interface/call.ht?action=findJob' + formDataToUrl(body));
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=findJob', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getJobs(): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getTradeList')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getPosts(key): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=findPostList&key=' + key)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getJob(key, id): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=jobDetail&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  post(body): Promise<any> {

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editPost', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  follow(key, id): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=addFollow&key=' + key + '&datatype=1' + '&positionid=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getFollows(key): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getFollowList&key=' + key + '&datatype=1')
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
