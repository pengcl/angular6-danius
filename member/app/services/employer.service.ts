import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CONFIG} from '../../../config/app.config';
import {formData} from '../../../commons/js/utils';

import {AuthService} from './auth.service';

@Injectable()
export class EmployerService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  getInterviews(key, state): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=companyInterviewEvaluateList&key=' + key + '&interviewState=' + state)
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
