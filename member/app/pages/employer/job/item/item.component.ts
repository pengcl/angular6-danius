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
import {CompanyService} from '../../../../services/company.service';
import {JobService} from '../../../../services/job.service';

import {getIndex, getNameFormCode, unshiftObj} from '../../../../../../commons/js/utils';
import {
  SERVICES_DATA,
  EDUCATIONS_DATA,
  EXPERIENCES_DATA,
  LENGTH_OF_MILITARY_DATA,
  SALARIES_DATA,
  FINANCE_DATA,
  SCOPE_DATA, WORK_STATUSES_DATA
} from '../../../../../../config/data';

@Component({
  selector: 'app-employer-job-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class EmployerJobItemComponent implements OnInit {

  educations = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});
  experiences = unshiftObj(EXPERIENCES_DATA, {label: '不限', value: ''});
  lengthOfMilitary = unshiftObj(LENGTH_OF_MILITARY_DATA, {label: '不限', value: ''});
  staffs = unshiftObj(SCOPE_DATA, {label: '不限', value: ''});
  finances = unshiftObj(FINANCE_DATA, {label: '不限', value: ''});
  salaries = unshiftObj(SALARIES_DATA, {name: '面议', code: '0'});
  services = unshiftObj(SERVICES_DATA, {name: '不限', code: '100000', sub: [{name: '不限', code: '100100'}]});

  user;
  id;
  company;
  job;
  jobs;

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
              private companySvc: CompanyService,
              private jobSvc: JobService) {
    navSvc.set({show: false, title: '职位详情'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.id = this.route.snapshot.params['id'];

    this.jobSvc.getJob(this.user.key, this.id).then(res => this.job = res.result).then(job => {
      this.companySvc.getCompany(this.user.key, job.companyid).then(res => {
        if (res.code === '0000') {
          this.company = res.result.busCompany;
        }
      });
    });

    this.jobSvc.findJobs({key: this.user.key, isrecommend: 1}).then(res => {
      this.jobs = res.result.list.slice(0, 2);
    });
  }

  getIndex(arr, key, value) {
    return getIndex(arr, key, value);
  }

  follow() {
  }
}
