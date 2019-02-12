import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, fromEvent as observableFromEvent, timer} from 'rxjs';

import {PickerService, ToastService, DialogService} from 'ngx-weui';

import {DATA} from '../../../../../config/cn';
import {StorageService} from '../../../../../service/storage.service';
import {LogService} from '../../../services/log.service';
import {BananaService} from '../../../services/banana.service';
import {TabbarService} from '../../../../../modules/tabbar';
import {NavbarService} from '../../../../../modules/navbar';

const fake = {
  list: [
    '长沙王**购买了该商品，3秒前',
    '天津李**购买了该商品，4秒前',
    '北京郭**购买了该商品，5秒前',
    '西宁马**购买了该商品，7秒前',
    '广州颜**购买了该商品，12秒前',
    '成都冼**购买了该商品，23秒前',
    '无锡王**购买了该商品，34秒前',
    '温州马**购买了该商品，45秒前',
    '拉萨阿**购买了该商品，56秒前',
    '深圳唐**购买了该商品，59秒前'
  ]
};

@Component({
  selector: 'app-banana-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class BananaIndexComponent implements OnInit, OnDestroy {

  @ViewChild('content') private content: ElementRef;
  @ViewChild('container') private container: ElementRef;

  price = 99;
  totalPrice = 1 * this.price;
  submitForm: FormGroup;
  isSubmit = false;
  showButton = true;

  fakes = [];
  classes = [];

  fakeTimer = null;

  totalLoop = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private logSvc: LogService,
              private bananaSvc: BananaService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService) {
    navSvc.set({title: 'Banana.Sir香蕉先生'});
    tabSvc.set({show: false}, 0);
  }

  ngOnInit() {

    observableFromEvent(window, 'scroll').subscribe((event) => {
      if (window.scrollY >= this.content.nativeElement.clientHeight - window.innerHeight) {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
    });

    this.submitForm = new FormGroup({
      productId: new FormControl('', [Validators.required]),
      totalQuantity: new FormControl('', [Validators.required]),
      receiverName: new FormControl('', [Validators.required]),
      receiverMobile: new FormControl('', [Validators.required]),
      receiverCity: new FormControl('', [Validators.required]),
      receiverRoom: new FormControl('', [Validators.required]),
      payType: new FormControl('', [Validators.required]),
      buyerMemo: new FormControl('', []),
      gh: new FormControl('', [Validators.required]),
      activeTag: new FormControl('', [Validators.required])
    });

    this.submitForm.get('productId').setValue('10000097190421');
    this.submitForm.get('totalQuantity').setValue(1);
    this.submitForm.get('payType').setValue(1);
    this.submitForm.get('gh').setValue(this.route.snapshot.queryParams['gh'] ? this.route.snapshot.queryParams['gh'] : 'wap');
    this.submitForm.get('activeTag').setValue('cywap');
    this.totalPrice = this.submitForm.get('totalQuantity').value * this.price;

    if (this.storageSvc.get('submitForm')) {
      const values = JSON.parse(this.storageSvc.get('submitForm'));
      console.log(values);
      for (const key in values) {
        if (values[key]) {
          this.submitForm.get(key).setValue(values[key]);
        }
      }
    }

    this.logSvc.log('load', '10000097190421').then();

    this.updateUi();
  }

  updateUi() {
    const fakes = [];
    fake.list.forEach((item, i) => {
      const o = {
        top: 36 * i - this.totalLoop * 36,
        opacity: this.totalLoop === i ? 0.9 : (this.totalLoop + 1 === i ? 0.3 : 0),
        content: item,
        avatar: '/assets/images/banana/head' + (i + 1) + '.png'
      };
      fakes.push(o);
    });

    this.fakes = fakes;
    this.updateClass();
    this.fakeTimer = observableInterval(1000).subscribe(() => {
      this.updateClass();
    });
  }

  updateClass() {
    const fakes = [];
    fake.list.forEach((item, i) => {
      const o = {
        top: 36 * i - this.totalLoop * 36 + 36,
        opacity: this.totalLoop === i ? 0.9 : (this.totalLoop + 1 === i ? 0.3 : 0),
        content: item,
        avatar: '/assets/images/banana/head' + (i + 1) + '.png'
      };
      fakes.push(o);
    });

    this.classes = fakes;
    if (this.totalLoop < 10) {
      this.totalLoop++;
    } else {
      this.totalLoop = 0;
      this.fakeTimer.unsubscribe();
      this.updateUi();
    }
  }

  setLess() {
    this.logSvc.log('setLess', '10000097190421').then();
    if (this.submitForm.get('totalQuantity').value <= 1) {
      return false;
    }
    this.submitForm.get('totalQuantity').setValue(this.submitForm.get('totalQuantity').value - 1);
  }

  setMore() {
    this.logSvc.log('setMore', '10000097190421').then();
    if (this.submitForm.get('totalQuantity').value >= 10) {
      return false;
    }
    this.submitForm.get('totalQuantity').setValue(this.submitForm.get('totalQuantity').value + 1);
  }

  setName() {
    this.logSvc.log('setName', '10000097190421').then();
  }

  setMobile() {
    this.logSvc.log('setMobile', '10000097190421').then();
  }

  setRoom() {
    this.logSvc.log('setRoom', '10000097190421').then();
  }

  showPicker() {
    this.pickerSvc.showCity(DATA, '').subscribe(res => {
      this.submitForm.get('receiverCity').setValue(res.items[0].name + res.items[1].name + (res.items[2] ? res.items[2].name : ''));
      this.logSvc.log('setAddress', '10000097190421').then();
    });
  }

  submit() {
    this.isSubmit = true;
    if (this.submitForm.invalid) {
      return false;
    }
    this.toastSvc.loading('正在提交订单', 0);
    this.bananaSvc.submit(this.submitForm.value).then(res => {
      this.toastSvc.hide();
      // this.dialogSvc.show({content: '您的订单已提交成功', cancel: '', confirm: '我知道了'}).subscribe();
      this.storageSvc.set('submitForm', JSON.stringify(this.submitForm.value));
      // this.router.navigate(['/success'], {queryParams: {orderNo: res.orderNo}});
      window.location.href = '/success' + res;
    });
    this.logSvc.log('submit', '10000097190421').then();
  }

  goButton() {
    this.content.nativeElement.scrollTo(0, 100000);
  }

  ngOnDestroy() {
    if (this.fakeTimer) {
      this.fakeTimer.unsubscribe();
    }
  }

}


