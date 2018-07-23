import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData} from '../../../commons/js/utils';
import {CONFIG} from '../../../config/app.config';

@Injectable()
export class JobService {

  constructor(private http: HttpClient) {
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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
