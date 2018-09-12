import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ToastService, DialogService, PickerService} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {OverlayService} from '../../../../../modules/overlay';
import {JobService} from '../../../services/job.service';

import {SERVICES_DATA} from '../../../../../config/data';
import {getIndex} from '../../../../../commons/js/utils';

function resetData(arr) {
  const mainArr = [];
  arr.forEach((item) => {
    const mainItem = {};
    let names = item.name;
    const subs = [];
    if (item.sub[0].sub) {
      item.sub.forEach(subItem => {
        names = names + '/' + subItem.name;
        subItem.sub.forEach(v => {
          const sub = {
            name: v.name,
            code: v.code
          };
          subs.push(sub);
        });
      });
    } else {
      item.sub.forEach(subItem => {
        const sub = {
          name: subItem.name,
          code: subItem.code
        };
        subs.push(sub);
      });
    }
    mainItem['name'] = names;
    mainItem['sub'] = subs;
    mainArr.push(mainItem);
  });
  return mainArr;
}

@Component({
  selector: 'app-usher-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.scss']
})
export class UsherEmployerComponent implements OnInit {

  user;
  formControl = '';

  industries;

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
              private overlaySvc: OverlayService,
              private jobSvc: JobService) {
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

      // 企业信息
      companyname: new FormControl('', [Validators.required]),
      tradeid: new FormControl('', [Validators.required]),
      tradename: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      post: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.max(19999999999), Validators.min(10000000000)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.jobSvc.getIndustry().then(res => {
      if (res.code === '0000') {
        this.industries = resetData(res.result);
      }
    });

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        this.profileForm.get('username').setValue(res.result.user.username);
        this.profileForm.get('sex').setValue(res.result.user.sex);
        this.profileForm.get('birthday').setValue(res.result.user.birthday);
        this.profileForm.get('mobile').setValue(res.result.user.mobile);
        this.profileForm.get('email').setValue(res.result.user.email);
        if (res.result.company) {
          this.profileForm.get('companyname').setValue(res.result.company.companyname);
          this.profileForm.get('tradeid').setValue(res.result.company.tradeid);
          this.profileForm.get('tradename').setValue(res.result.company.tradename);
          this.profileForm.get('address').setValue(res.result.company.address);
        }
        if (res.result.userCompany) {
          this.profileForm.get('post').setValue(res.result.userCompany.post);
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

  showDate(type, target) {
    this.formControl = target;
    const defaultDate = this.profileForm.get(target).value || '1998-01';
    this.pickerSvc.showDateTime(type, '', new Date(defaultDate)).subscribe(res => {
      this.profileForm.get(target).setValue(res.formatValue);
      this.singleSubmit();
    });
  }

  showServices() {
    this.pickerSvc.showCity(SERVICES_DATA).subscribe(res => {
      this.profileForm.get('services').setValue(res.items[0].label + res.items[1].label);
    });
  }

  setIndustry(industry) {
    this.profileForm.get('tradeid').setValue(industry.code);
    this.profileForm.get('tradename').setValue(industry.name);
  }

  save() {
    this.overlaySvc.hide();
    this.location.back();

    const body = {};
    body['key'] = this.profileForm.get('key').value;
    body['tradeid'] = this.profileForm.get('tradeid').value;
    body['tradename'] = this.profileForm.get('tradename').value;
    this.toastSvc.loading('', 99999);
    this.userSvc.set(body).then(res => {
      this.toastSvc.hide();
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
    if (this.profileForm.invalid) {
      return false;
    }
    this.router.navigate(['/employer/qualify']);
  }

}
