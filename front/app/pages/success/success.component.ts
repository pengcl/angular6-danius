import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  order;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private orderSvc: OrderService) {
  }

  ngOnInit() {
    this.orderSvc.getOrder(this.route.snapshot.queryParams['orderNo']).then(res => {
      this.order = res.salesOrder;
      console.log(res);
    });
  }

  back() {
    this.location.back();
  }
}
