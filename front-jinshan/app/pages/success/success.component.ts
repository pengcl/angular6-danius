import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {NavbarService} from '../../../../modules/navbar';
import {TabbarService} from '../../../../modules/tabbar';

import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  order;
  product;
  items;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private orderSvc: OrderService) {
    navSvc.set({title: '金山优选-下单成功'});
    tabSvc.set({show: false}, 1);
  }

  ngOnInit() {
    this.orderSvc.getOrder(this.route.snapshot.queryParams['orderNo']).then(res => {
      this.order = res.salesOrder;
      this.product = res.product;
      this.items = res.items;
      console.log(res);
    });
  }

  back() {
    this.location.back();
  }
}
