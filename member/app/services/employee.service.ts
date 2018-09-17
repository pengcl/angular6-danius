import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CONFIG} from '../../../config/app.config';
import {formData} from '../../../commons/js/utils';

import {AuthService} from './auth.service';

@Injectable()
export class EmployeeService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  findEmployees(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=getCandidateList', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getEmployees(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=getCandidateList', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getEmployee(key, id): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=findUserDetail&key=' + key + '&userid=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getInterviews(key, state): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=userInterviewEvaluateList&key=' + key + '&interviewState=' + state)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getInterview(key, id): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getInterviewEvaluateInfo&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getDelivered(key) { // userResumeList
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=userResumeList&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  follow(key, id, postid): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=addFollow&key=' + key + '&datatype=2' + '&userid=' + id + '&postid=' + postid)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getFollows(key): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getFollowList&key=' + key + '&datatype=2')
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
