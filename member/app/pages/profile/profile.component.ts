import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {PickerService} from 'ngx-weui';
import {NavbarService} from '../../../../modules/navbar';
import {AuthService} from '../../services/auth.service';
import {OverlayService} from '../../../../modules/overlay';

import {DATA} from '../../../../config/cn';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user;
  formControl = '';

  sex: String = '男';
  marital: String = '未婚';
  location: String;
  pickerData = {
    weight: Array(70)
      .fill('')
      .map((v: string, idx: number) => `${idx + 40}`),
    height: Array(70)
      .fill(0)
      .map((v: string, idx: number) => `${idx + 150}`),
    education: [
      {
        text: '初中',
        value: 0
      },
      {
        text: '高中',
        value: 1
      },
      {
        text: '中专',
        value: 2
      },
      {
        text: '大专',
        value: 3
      },
      {
        text: '本科',
        value: 4
      },
      {
        text: '硕士',
        value: 5
      },
      {
        text: '博士',
        value: 6
      },
      {
        text: 'MBA',
        value: 7
      },
      {
        text: 'EMBA',
        value: 8
      },
      {
        text: '其它',
        value: 9
      }
    ]
  };

  profileForm: FormGroup;

  constructor(private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private authSvc: AuthService,
              private overlaySvc: OverlayService) {
    navSvc.set({title: '个人信息'});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.profileForm = new FormGroup({
      avatar: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      marital: new FormControl('', [Validators.required]),
      nation: new FormControl('', [Validators.required]),
      location: new FormGroup({
        province: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.required])
      }),
      origo: new FormControl('', [Validators.required]),
      education: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required])
    });
  }

  showOverlay(target) {
    this.formControl = target;
    this.overlaySvc.show();
  }

  showData(target) {
    const defaultSelect = this.pickerData[target].indexOf(this.profileForm.get(target).value);
    this.pickerSvc.show(this.pickerData[target], '', [defaultSelect >= 0 ? defaultSelect : 0], {
      cancel: '取消',
      confirm: '确认'
    }).subscribe(res => {
      this.profileForm.get(target).setValue(res.value);
    });
  }

  showDate(type, target) {
    this.pickerSvc.showDateTime(type).subscribe(res => {
      console.log(res.formatValue);
    });
  }

  showCity(target) {
    this.pickerSvc.showCity(DATA, this.profileForm.get('location.district').value).subscribe(res => {
      this.profileForm.get('location.province').setValue(res.items[0].value);
      this.profileForm.get('location.city').setValue(res.items[1].value);
      this.profileForm.get('location.district').setValue(res.items[2].value);
      this.location = res.items[0].label + res.items[1].label + res.items[2].label;
    });
  }

  onSubmit() {
    console.log(this.profileForm.value);
    this.overlaySvc.hide();
  }

}
