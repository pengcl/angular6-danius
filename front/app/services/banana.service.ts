import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData} from '../../../commons/js/utils';
import {CONFIG} from '../app.config';

@Injectable()
export class BananaService {

  constructor(private http: HttpClient) {
  }

  submit(body): Promise<any> {

    return this.http.post(CONFIG.prefix.api + '/order/submitIntentOrder.ht', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
