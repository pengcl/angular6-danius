import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'ngx-weui';

import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';

import {AuthService} from '../../../../services/auth.service';
import {OrderService} from '../../../../services/order.service';
import {PageService} from '../../../../services/page.service';

import {Cart} from '../../../../interfaces/cart.interface';
import {Observable} from 'rxjs';
import {CartService} from '../../../../services/cart.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {StorageService} from '../../../../../../service/storage.service';

@Component({
  selector: 'app-admin-cart-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminCartListComponent implements OnInit {
  user;
  sessionId = '';
  isLogged: Boolean = false;
  carts: Cart[];
  pageType;

  cartForm: FormGroup;
  totalPrice = 0;
  isSelectedAll = false;

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private orderSvc: OrderService,
              private pageSvc: PageService,
              private cartSvc: CartService,
              private storageSvc: StorageService) {

    this.pageType = pageSvc.config;
    navSvc.set({title: this.pageType.name + '-购物车'});
    tabSvc.set({show: true}, 2);
  }

  ngOnInit() {
    this.isLogged = this.authSvc.isLogged;
    this.user = this.authSvc.getKey();
    this.sessionId = this.cartSvc.getId();

    this.cartForm = new FormGroup({
      cartId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required])
    });

    this.cartSvc.get(this.isLogged ? this.user : '', this.isLogged ? '' : this.sessionId).then(res => {
      const carts = [];
      res.list.forEach(item => {
        item.selected = false;
        carts.push(item);
      });
      this.carts = carts;
      this.updateCount();
    });
  }

  onChange(id, e) {
    this.cartForm.get('cartId').setValue(id);
    this.cartForm.get('quantity').setValue(e);
    this.cartSvc.updateCarts(this.cartForm.value).then((res) => {
      this.updateCount();
    });
  }

  selectedAll() {
    this.isSelectedAll = !this.isSelectedAll;
    const carts = [];
    this.carts.forEach(item => {
      item.selected = this.isSelectedAll;
      carts.push(item);
    });
    this.carts = carts;
    this.updateCount();
  }

  updateCount() {
    let totalPrice = 0;
    let isSelectedAll = true;
    this.carts.forEach(item => {
      if (item.selected) {
        totalPrice = totalPrice + item.productPrice * item.quantity;
      } else {
        isSelectedAll = false;
      }
    });
    this.isSelectedAll = isSelectedAll;
    this.totalPrice = totalPrice;
  }

  onConfirm(e) {
    if (e === 'confirm') {
      this.router.navigate(['/index']);
    }
  }

  go(isCan) {
    if (!isCan) {
      return false;
    }
    this.storageSvc.set('cartsForm', JSON.stringify(this.carts));
    this.router.navigate(['/front/checkcart']);
  }
}
