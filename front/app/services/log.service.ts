import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData} from '../../../commons/js/utils';
import {CONFIG} from '../../../config/app.config';

@Injectable()
export class LogService {

  constructor(private http: HttpClient) {
  }

  log(operation, page, gh): Promise<any> {

    return this.http.jsonp('http://mk.danius.cn/record/writeRequestLog.html?loc=' + encodeURIComponent(window.location.href) +
      '&operation=cy_1_' + (page ? page : '') + '_' + operation + '&gh=' + gh, 'callback')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
