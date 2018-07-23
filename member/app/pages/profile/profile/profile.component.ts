import {Component, OnInit} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ToastService, PickerService} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {OverlayService} from '../../../../../modules/overlay';

import {DATA} from '../../../../../config/cn';
import {getIndex} from '../../../../../commons/js/utils';

@Component({
  selector: 'app-profile-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileProfileComponent implements OnInit {

  user;
  formControl = '';

  sex: String = '男';
  pickerData = {
    weight: Array(70)
      .fill('')
      .map((v: string, idx: number) => {
        return {label: `${idx + 40}` + 'KG', value: `${idx + 40}`};
      }),
    height: Array(70)
      .fill(0)
      .map((v: string, idx: number) => {
        return {label: `${idx + 150}` + 'CM', value: `${idx + 150}`};
      })
  };

  profileForm: FormGroup;

  constructor(private location: LocationStrategy,
              private toastSvc: ToastService,
              private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private overlaySvc: OverlayService) {
    navSvc.set({title: '个人信息'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.profileForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      headimage: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      ismarried: new FormControl('', [Validators.required]),
      nation: new FormControl('', [Validators.required]),

      addressarea: new FormControl('', [Validators.required]),
      addressareacode: new FormControl('', [Validators.required]),
      addresscity: new FormControl('', [Validators.required]),
      addresscitycode: new FormControl('', [Validators.required]),
      addressprovince: new FormControl('', [Validators.required]),
      addressprovincecode: new FormControl('', [Validators.required]),

      originprovince: new FormControl('', [Validators.required]),
      originprovincecode: new FormControl('', [Validators.required]),
      origincity: new FormControl('', [Validators.required]),
      origincitycode: new FormControl('', [Validators.required]),

      mobile: new FormControl('', [Validators.required, Validators.pattern(/[0-9]*/), Validators.minLength(11), Validators.maxLength(11)])
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.userSvc.get(this.user.key).then(res => {
      console.log(res.result);
      this.profileForm.get('username').setValue(res.result.user.username);
      this.profileForm.get('headimage').setValue(res.result.user.headimage);
      this.profileForm.get('sex').setValue(res.result.user.sex);
      this.profileForm.get('birthday').setValue(res.result.user.birthday);
      if (res.result.personal) {
        this.profileForm.get('nation').setValue(res.result.personal.nation);
        this.profileForm.get('height').setValue(res.result.personal.height);
        this.profileForm.get('weight').setValue(res.result.personal.weight);
        this.profileForm.get('addressprovince').setValue(res.result.personal.addressprovince);
        this.profileForm.get('addressprovincecode').setValue(res.result.personal.addressprovincecode);
        this.profileForm.get('addresscity').setValue(res.result.personal.addresscity);
        this.profileForm.get('addresscitycode').setValue(res.result.personal.addresscitycode);
        this.profileForm.get('addressarea').setValue(res.result.personal.addressarea);
        this.profileForm.get('addressareacode').setValue(res.result.personal.addressareacode);

        this.profileForm.get('originprovince').setValue(res.result.personal.originprovince);
        this.profileForm.get('originprovincecode').setValue(res.result.personal.originprovincecode);
        this.profileForm.get('origincity').setValue(res.result.personal.origincity);
        this.profileForm.get('origincitycode').setValue(res.result.personal.origincitycode);

        this.profileForm.get('ismarried').setValue(res.result.personal.ismarried);
      }
    });
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  setSex(sex) {
    this.profileForm.get('sex').setValue(sex);
    this.formControl = 'sex';
    this.singleSubmit();
  }

  showData(target) {
    this.formControl = target;
    const defaultSelect = getIndex(this.pickerData[target], 'value', this.profileForm.get(target).value.toString()) || 0;
    this.pickerSvc.show([this.pickerData[target]], '', [defaultSelect], {
      cancel: '取消',
      confirm: '确认'
    }).subscribe(res => {
      this.profileForm.get(target).setValue(res.value);
      this.singleSubmit();
    });
  }

  showDate(type, target) {
    const defaultDate = this.profileForm.get(target).value ? this.profileForm.get(target).value : '1998-01';
    this.pickerSvc.showDateTime(type, '', new Date(defaultDate))
      .subscribe(res => {
        this.profileForm.get(target).setValue(res.formatValue);
      });
  }

  showCity() {
    this.pickerSvc.showCity(DATA, this.profileForm.get('addressareacode').value).subscribe(res => {
      this.profileForm.get('addressprovince').setValue(res.items[0].label);
      this.profileForm.get('addressprovincecode').setValue(res.items[0].value);
      this.profileForm.get('addresscity').setValue(res.items[1].label);
      this.profileForm.get('addresscitycode').setValue(res.items[1].value);
      this.profileForm.get('addressarea').setValue(res.items[2].label);
      this.profileForm.get('addressareacode').setValue(res.items[2].value);

      const body = {};
      body['key'] = this.user.key;
      body['addressprovince'] = this.profileForm.get('addressprovince').value;
      body['addressprovincecode'] = this.profileForm.get('addressprovincecode').value;
      body['addresscity'] = this.profileForm.get('addresscity').value;
      body['addresscitycode'] = this.profileForm.get('addresscitycode').value;
      body['addressarea'] = this.profileForm.get('addressarea').value;
      body['addressareacode'] = this.profileForm.get('addressareacode').value;

      this.userSvc.set(body).then();
    });
  }

  showOrigin() {
    this.pickerSvc.showCity(DATA, this.profileForm.get('origincitycode').value).subscribe(res => {
      this.profileForm.get('originprovince').setValue(res.items[0].label);
      this.profileForm.get('originprovincecode').setValue(res.items[0].value);
      this.profileForm.get('origincity').setValue(res.items[1].label);
      this.profileForm.get('origincitycode').setValue(res.items[1].value);

      const body = {};
      body['key'] = this.user.key;
      body['originprovince'] = this.profileForm.get('originprovince').value;
      body['originprovincecode'] = this.profileForm.get('originprovincecode').value;
      body['origincity'] = this.profileForm.get('origincity').value;
      body['origincitycode'] = this.profileForm.get('origincitycode').value;

      this.userSvc.set(body).then();
    });
  }

  setMarital(marital) {
    this.profileForm.get('ismarried').setValue(marital);
    this.formControl = 'ismarried';
    this.singleSubmit();
  }

  singleSubmit() {
    const body = {};
    body['key'] = this.profileForm.get('key').value;
    body[this.formControl] = this.profileForm.get(this.formControl).value;
    this.toastSvc.loading('', 99999);
    this.userSvc.set(body).then(res => {
      this.toastSvc.hide();
    });
  }

  overlaySubmit() {
    if (this.profileForm.get(this.formControl).invalid) {
      return false;
    }
    this.location.back();
    this.overlaySvc.hide();
    this.singleSubmit();
  }

  onSubmit() {
    this.location.back();
  }

}
