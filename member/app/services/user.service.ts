import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData} from '../../../commons/js/utils';
import {CONFIG} from '../../../config/app.config';

import {AuthService} from './auth.service';

@Injectable()
export class UserService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  get(key): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getUserInfo&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  set(body): Promise<any> {

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=baseInfo', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getWorks(key): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getWorkExperience&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getWork(key, id): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=findWorkExperience&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  addWork(body): Promise<any> {

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editWorkExperience', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  editWork(body): Promise<any> {

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editWorkExperience', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getEducations(key): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getEduExperience&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getEducation(key, id): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=findEduExperience&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  addEducation(body): Promise<any> {

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editEduExperience', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  editEducation(body): Promise<any> {

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editEduExperience', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getIntents(key): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getIntent&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getIntent(key, id): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=findIntent&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  addIntent(body): Promise<any> {

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editIntent', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  editIntent(body): Promise<any> {

    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editIntent', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  delIntent(key, id): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=removeIntent&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getSkills(key): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getSkill&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getCount(key): Promise<any> {

    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getMainCountInfo&key=' + key)
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
