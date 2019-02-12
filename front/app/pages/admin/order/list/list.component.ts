import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'ngx-weui';

import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';

import {AuthService} from '../../../../services/auth.service';
import {OrderService} from '../../../../services/order.service';
import {getIndex} from '../../../../../../commons/js/utils';
import {PageService} from '../../../../services/page.service';

@Component({
  selector: 'app-admin-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminOrderListComponent implements OnInit {
  user;
  orders;
  pageType;
  orderType = '';

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private orderSvc: OrderService,
              private pageSvc: PageService) {

    this.pageType = pageSvc.config;
    navSvc.set({title: this.pageType.name + '-订单查询'});
    tabSvc.set({show: true}, 3);
  }

  ngOnInit() {
    this.user = this.authSvc.getKey();

    this.getOrders('');
  }

  getOrders(orderType) {
    this.orderType = orderType;
    this.orderSvc.getOrders(this.user, orderType).then(res => {
      if (res.code === '200') {
        this.orders = res.result;
      } else if (res.code === '201') {
        this.authSvc.logout();
      }
    });
  }

  cancel(no) {
    this.dialogSvc.show({content: '您确认需要取消订单吗？', cancel: '不了', confirm: '是的'}).subscribe(res => {
      if (res.value) {
        this.orderSvc.orderOpt(no, 'cancel').then(_res => {
          if (_res.code === '200') {
            const index = getIndex(this.orders, 'orderNo', _res.order.orderno);
            this.orders[index].orderStatus = _res.order.orderstatus;
            this.dialogSvc.show({content: '您已成功取消订单！', cancel: '', confirm: '我知道了'}).subscribe();
          }
        });
      }
    });
  }

  return(no) {
    this.dialogSvc.show({content: '您确认需要申请退货吗？', cancel: '不了', confirm: '是的'}).subscribe(res => {
      if (res.value) {
        this.orderSvc.orderOpt(no, 'return').then(_res => {
          if (_res.code === '200') {
            const index = getIndex(this.orders, 'orderNo', _res.order.orderno);
            this.orders[index].orderStatus = _res.order.orderstatus;
            this.dialogSvc.show({content: '您已成功退货！', cancel: '', confirm: '我知道了'}).subscribe();
          }
        });
      }
    });
  }

  onConfirm(e) {
    if (e === 'confirm') {
      this.router.navigate(['/index']);
    }
  }
}
