import {Component, OnInit} from '@angular/core';

import {WORK_STATUSES_DATA} from '../../../../../config/data';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-employee-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class EmployeeHomeComponent implements OnInit {

  user;
  userInfo;
  count;

  workStatuses = WORK_STATUSES_DATA;

  constructor(private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService) {
    navSvc.set({title: '会员中心'});
    tabSvc.set({show: true}, 3);
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
        console.log(this.userInfo);
      }
    });

    this.userSvc.getCount(this.user.key).then(res => {
      if (res.code === '0000') {
        this.count = res.result;
      }
    });
  }

  logout() {
    this.authSvc.logout();
  }
}
