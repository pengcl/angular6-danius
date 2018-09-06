import {Component, OnInit} from '@angular/core';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-employee-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class EmployeeHomeComponent implements OnInit {

  user;

  constructor(private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService) {
    navSvc.set({title: '会员中心'});
    tabSvc.set({show: true}, 3);
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
  }

  logout() {
    this.authSvc.logout();
  }
}
