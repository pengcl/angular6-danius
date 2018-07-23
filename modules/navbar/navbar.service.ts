import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class NavbarService {

  private config = new Subject<any>();

  constructor() {
  }

  set(config) {
    this.config.next(Object.assign(this.config, config));
  }

  get(): Observable<any> {
    return this.config.asObservable();
  }
}
