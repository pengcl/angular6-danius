import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ToastService, DialogService, PickerService} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {OverlayService} from '../../../../../modules/overlay';

import {SERVICES_DATA} from '../../../../../config/services';
import {getIndex} from '../../../../../commons/js/utils';

@Component({
  selector: 'app-usher-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.scss']
})
export class UsherEmployerComponent implements OnInit {

  user;
  userInfo;
  formControl = '';

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
      }),
    drivingAge: Array(20)
      .fill(0)
      .map((v: string, idx: number) => {
        return {label: `${idx}`, value: `${idx}`};
      }),
    drivingMileage: Array(20)
      .fill(0)
      .map((v: string, idx: number) => {
        return {label: `${idx * 10000}`, value: `${idx * 10000}`};
      }),
    drivingLicense: [
      {
        label: 'A1',
        value: 'A1'
      },
      {
        label: 'A2',
        value: 'A2'
      },
      {
        label: 'A3',
        value: 'A3'
      },
      {
        label: 'B1',
        value: 'B1'
      },
      {
        label: 'B2',
        value: 'B2'
      },
      {
        label: 'C1',
        value: 'C1'
      },
      {
        label: 'C2',
        value: 'C2'
      },
      {
        label: '无',
        value: '0'
      }
    ],
    commendations: [
      {
        label: '无',
        value: '无'
      },
      {
        label: '嘉奖',
        value: '嘉奖'
      },
      {
        label: '三等功',
        value: '三等功'
      },
      {
        label: '二等功',
        value: '二等功'
      },
      {
        label: '一等功',
        value: '一等功'
      },
      {
        label: '荣誉称号',
        value: '荣誉称号'
      }
    ]
  };

  profileForm: FormGroup;

  constructor(private router: Router,
              private location: LocationStrategy,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private overlaySvc: OverlayService) {
    navSvc.set({title: '登记基本信息'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.profileForm = new FormGroup({

      // 基本资料
      uid: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),

      // 服役信息
      enlist: new FormControl('', [Validators.required]),
      demobilized: new FormControl('', [Validators.required]),
      services: new FormControl('', [Validators.required]),
      commendations: new FormControl('', [Validators.required]),

      // 驾驶技能
      drivingLicense: new FormControl('', [Validators.required]),
      drivingAge: new FormControl('', [Validators.required]),
      drivingMileage: new FormControl('', [Validators.required]),
    });

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.profileForm.get('uid').setValue(this.user);

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
        console.log(res);
      }
    });
  }

  setSex(sex) {
    this.profileForm.get('sex').setValue(sex);
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  showData(target) {
    const defaultSelect = getIndex(this.pickerData[target], 'value', this.profileForm.get(target).value) || 0;
    this.pickerSvc.show([this.pickerData[target]], '', [defaultSelect], {
      cancel: '取消',
      confirm: '确认'
    }).subscribe(res => {
      this.profileForm.get(target).setValue(res.value);
    });
  }

  showDate(type, target) {
    const defaultDate = this.profileForm.get(target).value || '1998-01';
    this.pickerSvc.showDateTime(type, '', new Date(defaultDate)).subscribe(res => {
      this.profileForm.get(target).setValue(res.formatValue);
    });
  }

  showServices() {
    this.pickerSvc.showCity(SERVICES_DATA).subscribe(res => {
      this.profileForm.get('services').setValue(res.items[0].label + res.items[1].label);
      console.log(res);
    });
  }

  overlaySubmit() {
    if (this.profileForm.get(this.formControl).invalid) {
      return false;
    }
    this.toastSvc.show();
    this.toastSvc.hide();
    this.overlaySvc.hide();
    this.location.back();
  }

  onSubmit() {
    console.log(this.profileForm.value);
    this.dialogSvc.show({content: '登记成功', cancel: '找工作', confirm: '完善资料'}).subscribe(data => {
      if (data.value) {
        this.router.navigate(['/resume/edit']);
      }
    });
  }

}
