import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {AuthService} from '../../../services/auth.service';
import {PayService} from '../../../services/pay.service';

declare var WeixinJSBridge: any;

@Component({
  selector: 'app-pay-preview',
  templateUrl: './preview.component.html'
})
export class PayPreviewComponent implements OnInit {

  user;
  orderNo;

  wxPayForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private authSvc: AuthService,
              private paySvc: PayService) {
  }

  ngOnInit() {

    this.user = this.authSvc.currentUser;
    console.log(this.user);

    this.wxPayForm = new FormGroup({
      body: new FormControl('', [Validators.required]),
      out_trade_no: new FormControl('', [Validators.required]), // 订单号
      total_fee: new FormControl('', [Validators.required]), // 总价
      product_id: new FormControl('', [Validators.required]),
      openid: new FormControl('', [Validators.required])
    });

    this.orderNo = this.route.snapshot.params['id'];
    this.wxPayForm.get('body').setValue('度特展览工程(上海)有限公司-展台');
    this.wxPayForm.get('out_trade_no').setValue(this.orderNo);
    this.wxPayForm.get('total_fee').setValue(1);
    this.wxPayForm.get('product_id').setValue('pid_123');
    this.wxPayForm.get('openid').setValue(this.user);
  }

  pay() {
    this.paySvc.pay(this.wxPayForm.value).then(res => {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', res,
        function (data) {
          alert(data.err_msg);
          if (data.err_msg === 'get_brand_wcpay_request:ok') {
            alert(data.err_msg);
          }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        }
      );
    });
  }

}


