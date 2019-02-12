import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'ngx-weui';

import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';

import {AuthService} from '../../../../services/auth.service';
import {OrderService} from '../../../../services/order.service';

@Component({
  selector: 'app-admin-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminOrderListComponent implements OnInit {
  user;
  orders: any[] = [];

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private orderSvc: OrderService) {
    navSvc.set({title: '金山优选-订单查询'});
    tabSvc.set({show: false}, 2);
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.orderSvc.getOrders(this.user.key).then(res => {
      if (res.code === '200') {
        this.orders = res.result;
      } else if (res.code === '201') {
        this.authSvc.logout();
      }
    });
  }
}
