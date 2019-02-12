import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {interval as observableInterval, interval as obsInterval} from 'rxjs';

import {PickerService, DialogService, ToastService} from 'ngx-weui';
import {StorageService} from '../../../../../service/storage.service';
import {OverlayService} from '../../../../../modules/overlay';

import {LogService} from '../../../services/log.service';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {GhService} from '../../../../../modules/gh/gh';
import {AuthService} from '../../../services/auth.service';
import {ProductService} from '../../../services/product.service';
import {PageService} from '../../../services/page.service';
import {CartService} from '../../../services/cart.service';

import {DATA} from '../../../../../config/cn';

@Component({
  selector: 'app-front-checkcarts',
  templateUrl: './checkcarts.component.html',
  styleUrls: ['./checkcarts.component.scss']
})

export class FrontCheckCartsComponent implements OnInit {

  cartsForm = {
    cartIds: [],
    receiverName: '',
    receiverMobile: '',
    code: '',
    receiverCity: '',
    receiverRoom: '',
    feedback: '',
    payType: 1,
    buyerMemo: '',
    isHasInvoice: 0,
    invoiceType: 0,
    invoiceTitle: '',
    invoicecontent: '',
    activeTag: 'js_wap',
    gh: this.ghSvc.get()
  };

  carts;
  attrs;

  needInvoice = false;

  addressForm: FormGroup;
  invoiceForm: FormGroup;

  loading = false;
  isSubmit = false;

  activeText = '获取验证码';
  activeClass = true;
  second = 59;
  timePromise;

  pageType;

  totalPrice = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private logSvc: LogService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private picker: PickerService,
              private authSvc: AuthService,
              private prodSvc: ProductService,
              private ghSvc: GhService,
              private pageSvc: PageService,
              private cartSvc: CartService) {
    this.pageType = pageSvc.config;
    navSvc.set({title: '分类列表'});
    tabSvc.set({show: false}, 1);
  }

  ngOnInit() {
    this.tabSvc.set({show: false}, 1);
    const carts = [];
    const cartIds = [];
    let totalPrice = 0;
    JSON.parse(this.storageSvc.get('cartsForm')).forEach(cart => {
      if (cart.selected) {
        carts.push(cart);
        cartIds.push(cart.cartId);
        totalPrice = totalPrice + cart.productPrice * cart.quantity;
      }
    });
    this.cartsForm.cartIds = cartIds;
    this.totalPrice = totalPrice;
    this.carts = carts;

    this.invoiceForm = new FormGroup({
      need: new FormControl(false, [Validators.required, Validators.requiredTrue]),
      name: new FormControl('', [Validators.required]),
      type: new FormControl(false, [Validators.required]),
      no: new FormControl('', [Validators.required]),
    });

    this.addressForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
      code: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      city: new FormControl('', [Validators.required]),
      room: new FormControl('', [Validators.required]),
      feedback: new FormControl('', [])
    });

    if (this.storageSvc.get('address')) {
      const address = JSON.parse(this.storageSvc.get('address'));
      for (const key in address) {
        if (address[key]) {
          this.addressForm.get(key).setValue(address[key]);
        }
      }
    }

    this.addressForm.valueChanges.subscribe(address => {
      this.storageSvc.set('address', JSON.stringify(address));
    });

    if (!this.carts) {
      this.router.navigate(['/']);
    } else {
      // this.itemForm.productId = this.prod.productId;

      this.logSvc.log('checkcartLoad').then();
    }
  }

  getCode(mobile) {
    if (!this.activeClass) {
      return false;
    }
    if (!mobile) {
      return false;
    }
    this.logSvc.log('getCode').then();
    this.authSvc.getCode(mobile).then(res => {
      if (res.code === '200') {
        this.activeClass = false;
        this.timePromise = observableInterval(1000).subscribe(() => {
          if (this.second <= 0) {
            this.timePromise.unsubscribe();

            this.second = 59;
            this.activeText = '重发验证码';
            this.activeClass = true;
          } else {
            this.activeText = '' + this.second + 's';
            this.activeClass = false;
            this.second = this.second - 1;
          }
        });
      } else {
        this.dialogSvc.show({
          content: res.msg,
          cancel: '',
          confirm: '我知道了'
        }).subscribe();
      }
    });
  }

  pickerShow() {
    this.logSvc.log('showSelector').then();
    this.picker.showCity(DATA).subscribe(res => {
      this.addressForm.get('city').setValue(res.items[0].label + res.items[1].label + res.items[2].label);
    });
  }

  showInvoice() {
    this.overlaySvc.show();
    this.needInvoice = true;
    this.invoiceForm.get('need').setValue(this.needInvoice);
    this.logSvc.log('showInvoice').then();
  }

  cancel() {
    this.needInvoice = false;
    this.invoiceForm.get('need').setValue(this.needInvoice);
    this.overlaySvc.hide();
  }

  save() {
    if (this.invoiceForm.get('type').value) {
      this.invoiceForm.get('no').enable();
    } else {
      this.invoiceForm.get('no').disable();
    }

    if (this.invoiceForm.invalid) {
      return false;
    }

    this.needInvoice = true;
    this.invoiceForm.get('need').setValue(this.needInvoice);

    this.cartsForm.isHasInvoice = this.invoiceForm.get('need').value ? 1 : 0;
    this.cartsForm.invoiceType = this.invoiceForm.get('type').value ? 1 : 0;
    this.cartsForm.invoiceTitle = this.invoiceForm.get('name').value;
    this.cartsForm.invoicecontent = this.invoiceForm.get('no').value;
    this.overlaySvc.hide();
    this.logSvc.log('save').then();
  }

  log(target) {
    if (this.addressForm.get(target).invalid) {
      return false;
    }

    this.logSvc.log('input-' + target).then();
  }

  submit() {
    this.isSubmit = true;

    if (this.addressForm.invalid || this.loading) {
      return false;
    }

    this.cartsForm.receiverName = this.addressForm.get('name').value;
    this.cartsForm.receiverMobile = this.addressForm.get('mobile').value;
    this.cartsForm.code = this.addressForm.get('code').value;
    this.cartsForm.receiverCity = this.addressForm.get('city').value;
    this.cartsForm.receiverRoom = this.addressForm.get('room').value;
    this.cartsForm.feedback = this.addressForm.get('feedback').value;

    this.loading = true;
    this.toastSvc.loading('提交中', 0);
    this.cartSvc.submit(this.cartsForm).then(res => {
      this.toastSvc.hide();
      if (res.code === '200') {
        this.router.navigate(['/success'], {queryParams: {orderNo: res.orderNo}});
      } else {
        this.addressForm.get('code').setValue('');
      }
    });

    this.logSvc.log('submit').then();
  }
}
