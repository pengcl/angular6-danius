import {Component, OnInit} from '@angular/core';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class AdminIndexComponent implements OnInit {
  user;

  constructor(private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService) {
    navSvc.set({title: '会员中心'});
    tabSvc.set({show: true}, 2);
  }

  ngOnInit() {
    this.user = this.authSvc.getKey();
    console.log(this.user);
  }

}
