import {Component, OnInit} from '@angular/core';
import {LocationStrategy} from '@angular/common';

import {ToastService, PickerService} from 'ngx-weui';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {OverlayService} from '../../../../../../modules/overlay';
import {UserService} from '../../../../services/user.service';

import {CONFIG} from '../../../../../../config/app.config';
import {EDUCATIONS_DATA} from '../../../../../../config/data';
import {unshiftObj} from '../../../../../../commons/js/utils';

@Component({
  selector: 'app-employee-resume-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class EmployeeResumePreviewComponent implements OnInit {
  config = CONFIG;

  user;
  userInfo;

  images;

  educations;
  works;
  intents;

  educationsData = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});

  constructor(private location: LocationStrategy,
              private toastSvc: ToastService,
              private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private overlaySvc: OverlayService,
              private userSvc: UserService) {
    navSvc.set({title: '预览简历'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.userSvc.get(this.user.key).then(res => {
      this.userInfo = res.result;
      if (res.result.personal) {
        const images = [];
        res.result.imageList.forEach(item => {
          images.push(item);
        });
        this.images = images;
      }
    });

    this.userSvc.getEducations(this.user.key).then(res => {
      if (res.code === '0000') {
        this.educations = res.result;
      }
    });

    this.userSvc.getWorks(this.user.key).then(res => {
      if (res.code === '0000') {
        this.works = res.result;
      }
    });

    this.userSvc.getIntents(this.user.key).then(res => {
      if (res.code === '0000') {
        this.intents = res.result;
      }
    });
  }

  back() {
    this.location.back();
  }
}
