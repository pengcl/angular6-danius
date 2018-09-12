import {Component, OnInit} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {DialogService, PickerService} from 'ngx-weui';
import {OverlayService} from '../../../../../../modules/overlay';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';

import {EDUCATIONS_DATA} from '../../../../../../config/data';
import {unshiftObj} from '../../../../../../commons/js/utils';

@Component({
  selector: 'app-employee-edu-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class EmployeeEduAddComponent implements OnInit {

  user;
  formControl = '';

  profileForm: FormGroup;

  educations = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});

  constructor(private location: LocationStrategy,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private overlaySvc: OverlayService) {
    navSvc.set({title: '教育经历'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.profileForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      schoolname: new FormControl('', [Validators.required]),
      education: new FormControl('', [Validators.required]),
      major: new FormControl('', [Validators.required]),
      begindate: new FormControl('', [Validators.required]),
      enddate: new FormControl('', [Validators.required]),
      experience: new FormControl('', [Validators.required])
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });
  }

  showEducations() {
    const defaultSelected = this.profileForm.get('education').value ? parseInt(this.profileForm.get('education').value, 10) - 1 : 0;
    this.pickerSvc.show([this.educations], '', [defaultSelected], {cancel: '返回', confirm: '确定'}).subscribe(res => {
      this.profileForm.get('education').setValue(res.value);
    });
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  showDate(target) {
    const defaultDate = this.profileForm.get(target).value ? this.profileForm.get(target).value : '1998-01';
    this.pickerSvc.showDateTime('date-ym', '', new Date(defaultDate))
      .subscribe(res => {
        this.profileForm.get(target).setValue(res.formatValue);
      });
  }

  overlaySubmit() {
    this.location.back();
    this.overlaySvc.hide();
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return false;
    }

    this.userSvc.addEducation(this.profileForm.value).then(res => {
      if (res.code === '0000') {
        this.location.back();
      }
    });
  }

}
