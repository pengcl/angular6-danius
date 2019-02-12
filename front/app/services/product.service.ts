import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formData} from '../../../commons/js/utils';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getList(id?, page?): Promise<any> {

    return this.http.get('/api/productinf/getProductList.ht?productCategoryId=' + (id ? id : '') + '&page=' + (page ? page : 1))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getItem(id, condition?): Promise<any> {

    return this.http.get('/api/productinf/getProductDetail.ht?productId=' + id + (condition ? '&condition=' + condition : ''))
      .toPromise()
      .then(response => {
        const attrs = [];
        const items = [];
        response['attributeList'].forEach(item => {
          items.push('');
          if (item.name === '颜色') {
            attrs.unshift(item);
          } else {
            attrs.push(item);
          }
        });

        response['attributeList'] = attrs;

        response['skuList'].forEach((item, i) => {
          const str = item.specificationproperties.split(';');
          attrs.forEach((attr, index) => {
            str.forEach(cds => {
              if (attr.id === cds.split(':')[0]) {
                items[index] = cds;
              }
            });
          });
          items.forEach((it, index) => {
            if (index === 0) {
              response['skuList'][i].specificationproperties = it;
            } else {
              response['skuList'][i].specificationproperties = response['skuList'][i].specificationproperties + ';' + it;
            }
          });
        });

        return response;
      })
      .catch(this.handleError);
  }

  getRecommends(id?): Promise<any> {

    return this.http.get('/api/productinf/getProductList.ht?isseckill=0' + (id ? '&productCategoryId=' + id : ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getCatalogs(id?): Promise<any> {

    return this.http.get('/api/productinf/findproductCategory.ht?productCategoryId=' + (id ? id : ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  submit(body): Promise<any> {

    return this.http.post('/api/productinf/submitIntentOrder.ht', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
