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

import {SERVICES_DATA} from '../../../../../config/data';
import {getIndex} from '../../../../../commons/js/utils';

@Component({
  selector: 'app-usher-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class UsherEmployeeComponent implements OnInit {

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
    driversage: Array(20)
      .fill(0)
      .map((v: string, idx: number) => {
        return {label: `${idx}`, value: `${idx}`};
      }),
    drivingmileage: Array(20)
      .fill(0)
      .map((v: string, idx: number) => {
        return {label: `${idx * 10000}`, value: `${idx * 10000}`};
      }),
    drivinglicence: [
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
    reward: [
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
      key: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),

      // 服役信息
      enlistmenttime: new FormControl('', [Validators.required]),
      retirementtime: new FormControl('', [Validators.required]),
      armytype: new FormControl('', [Validators.required]),
      services: new FormControl('', [Validators.required]),
      reward: new FormControl('', [Validators.required]),

      // 驾驶技能
      drivinglicence: new FormControl('', [Validators.required]),
      driversage: new FormControl('', [Validators.required]),
      drivingmileage: new FormControl('', [Validators.required]),
    });

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        this.profileForm.get('username').setValue(res.result.user.username);
        this.profileForm.get('sex').setValue(res.result.user.sex);
        this.profileForm.get('birthday').setValue(res.result.user.birthday);
        if (res.result.personal) {
          this.profileForm.get('weight').setValue(res.result.personal.weight);
          this.profileForm.get('height').setValue(res.result.personal.height);
          this.profileForm.get('enlistmenttime').setValue(res.result.personal.enlistmenttime);
          this.profileForm.get('retirementtime').setValue(res.result.personal.retirementtime);
          this.profileForm.get('armytype').setValue(res.result.personal.armytype);
          this.profileForm.get('services').setValue(res.result.personal.services);
          this.profileForm.get('reward').setValue(res.result.personal.reward);
          this.profileForm.get('drivinglicence').setValue(res.result.personal.drivinglicence);
          this.profileForm.get('driversage').setValue(res.result.personal.driversage);
          this.profileForm.get('drivingmileage').setValue(res.result.personal.drivingmileage);
        }
      }
    });
  }

  setSex(sex) {
    this.profileForm.get('sex').setValue(sex);
    this.formControl = 'sex';
    this.singleSubmit();
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  showData(target) {
    this.formControl = target;
    const defaultSelect = getIndex(this.pickerData[target], 'value', this.profileForm.get(target).value) || 0;
    this.pickerSvc.show([this.pickerData[target]], '', [defaultSelect], {
      cancel: '取消',
      confirm: '确认'
    }).subscribe(res => {
      this.profileForm.get(target).setValue(res.value);
      this.singleSubmit();
    });
  }

  showDate(type, target) {
    this.formControl = target;
    const defaultDate = this.profileForm.get(target).value || '1998-01';
    this.pickerSvc.showDateTime(type, '', new Date(defaultDate)).subscribe(res => {
      this.profileForm.get(target).setValue(res.formatValue);
      this.singleSubmit();
    });
  }

  showServices() {
    const body = {};
    body['key'] = this.profileForm.get('key').value;
    this.pickerSvc.showCity(SERVICES_DATA).subscribe(res => {
      this.profileForm.get('armytype').setValue(res.items[0].label);
      this.profileForm.get('services').setValue(res.items[1].label);
      body['armytype'] = this.profileForm.get('armytype').value;
      body['services'] = this.profileForm.get('services').value;
      this.toastSvc.loading('', 99999);
      this.userSvc.set(body).then(data => {
        this.toastSvc.hide();
      });
    });
  }

  overlaySubmit() {
    if (this.profileForm.get(this.formControl).invalid) {
      return false;
    }
    this.overlaySvc.hide();
    this.location.back();
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

  onSubmit() {
    this.dialogSvc.show({content: '登记成功', cancel: '找工作', confirm: '完善资料'}).subscribe(data => {
      if (data.value) {
        this.router.navigate(['/employee/resume/edit']);
      }
    });
  }

}
