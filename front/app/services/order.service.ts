import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData} from '../../../commons/js/utils';
import {CONFIG} from '../app.config';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient) {
  }

  getOrders(mobile, orderStatus?): Promise<any> {
    return this.http.get('/api/order/getActivityOrder.ht?recieverMobile=' + mobile + '&orderStatus=' + (orderStatus ? orderStatus : ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getOrder(no): Promise<any> {
    return this.http.get('/api/order/getSalesOrderDetail.ht?orderNo=' + no)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  orderOpt(no, type): Promise<any> {
    return this.http.get('/api/order/orderOperation.ht?orderNo=' + no + '&action=' + type)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
