import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AuthService} from './auth.service';

import {CONFIG} from '../../../config/app.config';

@Injectable()
export class OrderService {
  private products: any;

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  getOrders(): Promise<any> {
    return this.http.get(CONFIG.prefix.api + '/orders/find')
      .toPromise()
      .then(response => this.products = response)
      .catch(this.handleError);
  }

  getOrdersByOwner(uid): Promise<any> {
    return this.http.get(CONFIG.prefix.api + '/orders/find?uid=' + uid)
      .toPromise()
      .then(response => this.products = response)
      .catch(this.handleError);
  }

  getOrdersByReferee(referee): Promise<any> {
    return this.http.get(CONFIG.prefix.api + '/orders/find?referee=' + referee)
      .toPromise()
      .then(response => this.products = response)
      .catch(this.handleError);
  }

  getOrder(id): Promise<any> {
    return this.http.get(CONFIG.prefix.api + '/orders/find?id=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  submitOrder(body): Promise<any> {
    return this.http.post(CONFIG.prefix.api + '/orders/submit', body, {})
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
