import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'ngx-weui';

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
              private authSvc: AuthService,
              private orderSvc: OrderService) {
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
