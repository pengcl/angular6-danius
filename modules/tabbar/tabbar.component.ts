import {Component, Input, OnInit, OnDestroy} from '@angular/core';

import {TabbarService} from './tabbar.service';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss']
})
export class TabbarComponent implements OnInit, OnDestroy {
  @Input() config;

  constructor(private tabBarSvc: TabbarService) {
  }

  ngOnInit() {
    this.tabBarSvc.get().subscribe(res => {
      this.config = res;
    });

    this.tabBarSvc.set(this.config);
  }

  ngOnDestroy() {
  }
}
