import {Component} from '@angular/core';
import {TabbarService} from '../../../../modules/tabbar';
import {TAB_CONFIG} from './employer.config';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.scss']
})

export class EmployerComponent {
  tabConfig;

  constructor(private tabSvc: TabbarService) {
    tabSvc.set(TAB_CONFIG);
    tabSvc.get().subscribe(res => {
      this.tabConfig = res;
    });
  }
}
