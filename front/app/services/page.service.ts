import {Injectable} from '@angular/core';
import {StorageService} from '../../../service/storage.service';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class PageService {
  config = new Subject<any>();

  constructor(private storageSvc: StorageService) {
    const config = storageSvc.get('pageType') ? JSON.parse(storageSvc.get('pageType')) : {
      type: 'dn',
      name: '大牛优品'
    };

    this.set(config);
  }

  set(type) {
    this.storageSvc.set('pageType', JSON.stringify(type));
    this.config.next(Object.assign(this.config, type));
  }

  get() {
    return this.config.asObservable();
  }
}
