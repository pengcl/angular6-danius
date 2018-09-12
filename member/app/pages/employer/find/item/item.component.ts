import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {CONFIG} from '../../../../../../config/app.config';
import {EDUCATIONS_DATA, EXPERIENCES_DATA, FINANCE_DATA, LENGTH_OF_MILITARY_DATA, SCOPE_DATA} from '../../../../../../config/data';
import {PickerService, ToastService} from 'ngx-weui';
import {OverlayService} from '../../../../../../modules/overlay';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {EmployeeService} from '../../../../services/employee.service';
import {unshiftObj} from '../../../../../../commons/js/utils';

@Component({
  selector: 'app-employer-find-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class EmployerFindItemComponent implements OnInit {
  config = CONFIG;

  id; // 用户id
  postId; // 职位id
  user;
  userInfo;

  educationsData = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private toastSvc: ToastService,
              private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private overlaySvc: OverlayService,
              private employeeSvc: EmployeeService) {
    navSvc.set({title: '预览简历'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.id = this.route.snapshot.params['id'];
    this.postId = this.route.snapshot.queryParams['postId'];

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.employeeSvc.getEmployee(this.user.key, this.id).then(res => {
      this.userInfo = res.result;
    });
  }

  follow() {
    this.employeeSvc.follow(this.user.key, this.id, this.postId).then(res => {});
  }

  back() {
    this.location.back();
  }
}
