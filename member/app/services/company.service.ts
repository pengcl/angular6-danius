import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData} from '../../../commons/js/utils';
import {CONFIG} from '../../../config/app.config';

import {AuthService} from './auth.service';

@Injectable()
export class CompanyService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  getStrengths(id?): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getExcellence&id=' + (id ? id : ''))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  /*getStrengths(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=findJob', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }*/

  getStaffs(key): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getManagers&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getStaff(key, id): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=findManagers&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  addStaff(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editManagers', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getProducts(key): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getProduct&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getProduct(key, id): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=findProduct&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  addProduct(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=editProduct', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  findCompanies(body): Promise<any> {
    return this.http.post(CONFIG.prefix.wApi + '/interface/call.ht?action=findCompany', formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getCompany(key, id): Promise<any> {
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getCompanyDetail&key=' + key + '&companyid=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  follow(key, id): Promise<any> { // 关注公司
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=addFollow&key=' + key + '&datatype=0' + '&companyid=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getFollows(key): Promise<any> { // 获取关注的公司
    return this.http.get(CONFIG.prefix.wApi + '/interface/call.ht?action=getFollowList&key=' + key + '&datatype=0')
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
