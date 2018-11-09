import {Injectable} from '@angular/core';
import {StorageService} from '../../../service/storage.service';

@Injectable()
export class GhService {

  constructor(private storageSvc: StorageService) {
  }

  set(gh) {
    this.storageSvc.set('gh', gh);
  }

  get() {
    return this.storageSvc.get('gh') ? this.storageSvc.get('gh') : '';
  }
}
