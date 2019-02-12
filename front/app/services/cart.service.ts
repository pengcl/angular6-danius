import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '../../../service/storage.service';
import {formData} from '../../../commons/js/utils';

const generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 || 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r && 0x3 || 0x8)).toString(16);
  });
  return uuid.slice(8, 44);
};

@Injectable()
export class CartService {
  constructor(private http: HttpClient, private storageSvc: StorageService) {
  }

  getId() {
    const CART_SESSION_ID = (this.storageSvc.get('CART_SESSION_ID') ? this.storageSvc.get('CART_SESSION_ID') : generateUUID());
    console.log(CART_SESSION_ID);
    this.storageSvc.set('CART_SESSION_ID', CART_SESSION_ID);
    return CART_SESSION_ID;
  }


  get(mobile, sessionId): Promise<any> {
    return this.http.get('/api/productinf/getCartList.ht?phoneNumber=' + mobile + '&sessionId=' + sessionId)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  // http://192.168.1.193:8888/productinf/addCart.ht?productId=xx&quantity=xx&phoneNumber（或者未登录sessionId）=xx&specifications=规格xxx

  // productId,quantity,phoneNumber or sessionId,specifications
  add(body): Promise<any> {
    return this.http.post('/api/productinf/addCart.ht', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  // cartId,quantity
  updateCarts(body): Promise<any> {
    return this.http.post('/api/productinf/updateCart.ht', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  submit(body): Promise<any> {

    return this.http.post('/api/productinf/submitCartOrder.ht', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
