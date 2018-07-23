import {Component, OnInit} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ToastService, PickerService} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {OverlayService} from '../../../../../modules/overlay';
import {JobService} from '../../../services/job.service';
import {getIndex} from '../../../../../commons/js/utils';

import {DATA} from '../../../../../config/cn';

@Component({
  selector: 'app-profile-intention',
  templateUrl: './intention.component.html',
  styleUrls: ['./intention.component.scss']
})
export class ProfileIntentionComponent implements OnInit {

  user;
  pickerData = {
    workstatus: [
      {
        label: '离职-随时到岗',
        value: '0'
      },
      {
        label: '在职-考虑机会',
        value: '1'
      },
      {
        label: '在职-月内到岗',
        value: '2'
      },
      {
        label: '在职-暂不考虑',
        value: '3'
      }
    ]
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
        console.log(this.intents);
      }
    });
  }

  showData(target) {
    const defaultSelect = getIndex(this.pickerData[target], 'value', this.profileForm.get(target).value.toString());
    this.pickerSvc.show([this.pickerData[target]], '', [defaultSelect], {
      cancel: '取消',
      confirm: '确认'
    }).subscribe(res => {
      this.profileForm.get(target).setValue(res.value);
      this.userSvc.set(this.profileForm.value).then();
    });
  }

}
