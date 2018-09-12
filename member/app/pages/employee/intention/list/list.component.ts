import {Component, OnInit} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {WORK_STATUSES_DATA} from '../../../../../../config/data';
import {ToastService, PickerService} from 'ngx-weui';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {OverlayService} from '../../../../../../modules/overlay';
import {JobService} from '../../../../services/job.service';
import {getIndex} from '../../../../../../commons/js/utils';

import {DATA} from '../../../../../../config/cn';

@Component({
  selector: 'app-employee-intention-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployeeIntentionListComponent implements OnInit {

  user;
  pickerData = {
    workstatus: WORK_STATUSES_DATA
  };

  intents = [];

  profileForm: FormGroup;

  constructor(private location: LocationStrategy,
              private toastSvc: ToastService,
              private pickerSvc: PickerService,
              private overlaySvc: OverlayService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private jobSvc: JobService) {
    navSvc.set({title: '求职意向'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.profileForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      workstatus: new FormControl('', [Validators.required])
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        if (res.result.personal) {
          this.profileForm.get('workstatus').setValue(res.result.personal.workstatus);
        }
      }
    });

    this.userSvc.getIntents(this.user.key).then(res => {
      if (res.code === '0000') {
        this.intents = res.result;
      }
    });
  }

  showData(target) {
    const defaultSelect = getIndex(this.pickerData[target], 'value', this.profileForm.get(target).value) || 0;
    this.pickerSvc.show([this.pickerData[target]], '', [defaultSelect], {
      cancel: '取消',
      confirm: '确认'
    }).subscribe(res => {
      this.profileForm.get(target).setValue(res.value);
      this.userSvc.set(this.profileForm.value).then();
    });
  }

}
