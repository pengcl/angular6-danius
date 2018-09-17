import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {CONFIG} from '../../../../../../../config/app.config';

import {
  EDUCATIONS_DATA,
  EXPERIENCES_DATA,
  LENGTH_OF_MILITARY_DATA,
  SCOPE_DATA,
  FINANCE_DATA
} from '../../../../../../../config/data';

import {NavbarService} from '../../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../../modules/tabbar';
import {FollowService} from '../../../../../services/follow.service';
import {AuthService} from '../../../../../services/auth.service';
import {UserService} from '../../../../../services/user.service';
import {CompanyService} from '../../../../../services/company.service';
import {JobService} from '../../../../../services/job.service';
import {unshiftObj} from '../../../../../../../commons/js/utils';

@Component({
  selector: 'app-employee-find-job-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class EmployeeFindJobItemComponent implements OnInit {

  config = CONFIG;
  user;
  id;
  job;
  jobs;
  company;

  educations = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});
  experiences = unshiftObj(EXPERIENCES_DATA, {label: '不限', value: ''});
  lengthOfMilitary = unshiftObj(LENGTH_OF_MILITARY_DATA, {label: '不限', value: ''});
  staffs = unshiftObj(SCOPE_DATA, {label: '不限', value: ''});
  finances = unshiftObj(FINANCE_DATA, {label: '不限', value: ''});

  followForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private followSvc: FollowService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private companySvc: CompanyService,
              private jobSvc: JobService) {
    navSvc.set({title: '职位详情'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.id = this.route.snapshot.params['id'];

    this.followForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      datatype: new FormControl('', [Validators.required]),
      postid: new FormControl('', [Validators.required])
    });

    this.followForm.get('key').setValue(this.user.key);
    this.followForm.get('datatype').setValue(1);
    this.followForm.get('postid').setValue(this.id);

    this.jobSvc.getJob(this.user.key, this.id).then(res => this.job = res.result).then(job => {
      console.log(job);
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

  follow() {
    this.followSvc.follow(this.followForm.value).then(res => {});
  }
}


