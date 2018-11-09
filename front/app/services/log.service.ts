import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GhService} from '../../../modules/gh/gh';

@Injectable()
export class LogService {

  constructor(private http: HttpClient,
              private ghSvc: GhService) {
  }

  log(operation, productId?): Promise<any> {
    const gh = this.ghSvc.get();
    return this.http.jsonp('http://mk.danius.cn/record/writeRequestLog.html?loc=' + encodeURIComponent(window.location.href) +
      '&operation=cy_1_js_wap' + '_' + operation + '&gh=' + gh + '&productId=' + productId, 'callback')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
