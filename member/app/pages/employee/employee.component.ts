import {Component} from '@angular/core';
import {TabbarService} from '../../../../modules/tabbar';

import {TAB_CONFIG} from './employee.config';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})

export class EmployeeComponent {
  tabConfig;

  constructor(private tabSvc: TabbarService) {
    tabSvc.set(TAB_CONFIG);
    tabSvc.get().subscribe(res => {
      this.tabConfig = res;
    });
  }
}
