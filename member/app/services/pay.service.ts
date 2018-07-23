import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CONFIG} from '../../../config/app.config';

@Injectable()
export class PayService {

  constructor(private http: HttpClient) {
  }

  pay(body): Promise<any> {
    return this.http.post(CONFIG.prefix.api + '/wx/pay/pay', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
