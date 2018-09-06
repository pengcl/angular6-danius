import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CONFIG} from '../../../config/app.config';
import {formData} from '../../../commons/js/utils';

@Injectable()
export class ChatService {

  constructor(private http: HttpClient) {
  }

  open(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=openChat', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  get(key, id, page?): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getMessageList&key=' + key + '&immainid=' + id + '&page=' + (page ? page : 1))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getMessages(key): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getChatList&key=' + key)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getMessage(key, id): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getImmainById&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  send(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=sendMessage', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  sendResume(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=sendMessage', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
