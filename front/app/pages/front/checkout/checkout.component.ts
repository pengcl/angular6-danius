import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {interval as observableInterval, interval as obsInterval} from 'rxjs';

import {PickerService, DialogService} from 'ngx-weui';
import {StorageService} from '../../../../../service/storage.service';
import {OverlayService} from '../../../../../modules/overlay';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {ProductService} from '../../../services/product.service';

import {DATA} from '../../../../../config/cn';

@Component({
  selector: 'app-front-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class FrontCheckoutComponent implements OnInit {

  itemForm = {
    productId: '',
    totalQuantity: 1,
    receiverName: '',
    receiverMobile: '',
    code: '',
    receiverCity: '',
    receiverRoom: '',
    feedback: '',
    condition: '',
    payType: 1,
    buyerMemo: '',
    isHasInvoice: 0,
    invoiceType: 0,
    invoiceTitle: '',
    invoicecontent: '',
    activeTag: '',
    gh: ''
  };

  prod;
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private dialogSvc: DialogService,
              private picker: PickerService,
              private authSvc: AuthService,
              private prodSvc: ProductService) {
    navSvc.set({title: '金山优选-分类列表'});
    tabSvc.set({show: false}, 1);
  }

  ngOnInit() {
    this.navSvc.set({title: '金山优选-收货信息'});
    this.tabSvc.set({show: false}, 1);
    this.prod = JSON.parse(this.storageSvc.get('itemForm'));
    console.log(this.prod);

    this.invoiceForm = new FormGroup({
      need: new FormControl(false, [Validators.required, Validators.requiredTrue]),
      name: new FormControl('', [Validators.required]),
      type: new FormControl(false, [Validators.required]),
      no: new FormControl('', [Validators.required]),
    });

    this.addressForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
      code: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      room: new FormControl('', [Validators.required]),
      feedback: new FormControl('', [])
    });

    if (!this.prod) {
      this.router.navigate(['/']);
    } else {
      this.itemForm.productId = this.prod.productId;
      this.itemForm.totalQuantity = this.prod.totalQuantity;

      if (this.prod.attrs) {
        this.attrs = this.prod.attrs;
        this.attrs.forEach(item => {
          if (this.itemForm.condition) {
            this.itemForm.condition = this.itemForm.condition + ';' + item.id + ':' + item.selected.id;
          } else {
            this.itemForm.condition = item.id + ':' + item.selected.id;
          }
        });
      }
    }
  }

  getCode(mobile) {
    if (!this.activeClass) {
      return false;
    }
    if (!mobile) {
      return false;
    }
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
    this.picker.showCity(DATA).subscribe(res => {
      this.addressForm.get('city').setValue(res.items[0].label + res.items[1].label + res.items[2].label);
    });
  }

  showInvoice() {
    this.overlaySvc.show();
    this.needInvoice = true;
    this.invoiceForm.get('need').setValue(this.needInvoice);
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

    this.itemForm.isHasInvoice = this.invoiceForm.get('need').value ? 1 : 0;
    this.itemForm.invoiceType = this.invoiceForm.get('type').value ? 1 : 0;
    this.itemForm.invoiceTitle = this.invoiceForm.get('name').value;
    this.itemForm.invoicecontent = this.invoiceForm.get('no').value;
    this.overlaySvc.hide();
  }

  submit() {
    this.isSubmit = true;

    console.log(this.addressForm.controls);

    if (this.addressForm.invalid || this.loading) {
      return false;
    }

    this.itemForm.receiverName = this.addressForm.get('name').value;
    this.itemForm.receiverMobile = this.addressForm.get('mobile').value;
    this.itemForm.code = this.addressForm.get('code').value;
    this.itemForm.receiverCity = this.addressForm.get('city').value;
    this.itemForm.receiverRoom = this.addressForm.get('room').value;
    this.itemForm.feedback = this.addressForm.get('feedback').value;

    this.loading = true;
    this.prodSvc.submit(this.itemForm).then(res => {
      if (res.code === '200') {
        this.router.navigate(['/success'], {queryParams: {orderNo: res.orderNo}});
      } else {
        this.addressForm.get('code').setValue('');
      }
    });
  }
}
