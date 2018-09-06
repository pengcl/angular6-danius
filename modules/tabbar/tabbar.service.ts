import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class TabbarService {

  private config = new Subject<any>();

  constructor() {
  }

  set(config, activeIndex?) {
    if (typeof activeIndex === 'number') {
      this.config['items'].forEach((item, i) => {
        this.config['items'][i]['selected'] = false;
      });
      this.config['items'][activeIndex]['selected'] = true;
    }
    this.config.next(Object.assign(this.config, config));
  }

  get(): Observable<any> {
    return this.config.asObservable();
  }
}
