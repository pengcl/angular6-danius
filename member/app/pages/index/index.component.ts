import {Component, OnInit} from '@angular/core';

import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  user;

  constructor(private tabSvc: TabbarService,
              private authSvc: AuthService) {
    tabSvc.set({show: true});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    console.log(this.user);
  }

}
