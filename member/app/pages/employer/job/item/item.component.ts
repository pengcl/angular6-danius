import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {StorageService} from '../../../../../../service/storage.service';
import {OverlayService} from '../../../../../../modules/overlay';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {PickerService, DialogService, ToastService} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {JobService} from '../../../../services/job.service';

import {getIndex, getNameFormCode} from '../../../../../../commons/js/utils';
import {
  SERVICES_DATA,
  EDUCATIONS_DATA,
  EXPERIENCES_DATA,
  LENGTH_OF_MILITARY_DATA,
  SALARIES_DATA
} from '../../../../../../config/data';

@Component({
  selector: 'app-employer-job-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class EmployerJobItemComponent implements OnInit {

  educations = EDUCATIONS_DATA;
  experiences = EXPERIENCES_DATA;
  lengthOfMilitaryData = LENGTH_OF_MILITARY_DATA;
  services = SERVICES_DATA;

  user;
  id;
  job;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private pickerSvc: PickerService,
              private dialogSvc: DialogService,
              private toastSvc: ToastService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private jobSvc: JobService) {
    navSvc.set({show: false, title: '职位详情'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.id = this.route.snapshot.params['id'];

    this.jobSvc.getJob(this.user.key, this.id).then(res => {
      if (res.code !== '0000') {
        return false;
      }
      this.job = res.result;
      console.log(res);
    });
  }

  getIndex(arr, key, value) {
    return getIndex(arr, key, value);
  }

  follow() {
  }
}
