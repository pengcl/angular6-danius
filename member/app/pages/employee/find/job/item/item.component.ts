import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {DATA} from '../../../../../../../config/cn';
import {EDUCATIONS_DATA, EXPERIENCES_DATA, LENGTH_OF_MILITARY_DATA, SCOPE_DATA} from '../../../../../../../config/data';

import {NavbarService} from '../../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../../modules/tabbar';
import {FollowService} from '../../../../../services/follow.service';
import {AuthService} from '../../../../../services/auth.service';
import {UserService} from '../../../../../services/user.service';
import {JobService} from '../../../../../services/job.service';

@Component({
  selector: 'app-employee-find-job-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class EmployeeFindJobItemComponent implements OnInit {

  user;
  id;
  job;
  jobs;

  educations = EDUCATIONS_DATA;
  experiences = EXPERIENCES_DATA;
  lengthOfMilitary = LENGTH_OF_MILITARY_DATA;
  staffs = SCOPE_DATA;

  followForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private followSvc: FollowService,
              private authSvc: AuthService,
              private userSvc: UserService,
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
      positionid: new FormControl('', [Validators.required])
    });

    this.followForm.get('key').setValue(this.user.key);
    this.followForm.get('datatype').setValue(1);
    this.followForm.get('positionid').setValue(this.id);

    this.jobSvc.getJob(this.user.key, this.id).then(res => {
      if (res.code === '0000') {
        this.job = res.result;
        console.log(this.job);
      }
    });

    this.jobSvc.findJobs({key: this.user.key, isrecommend: 1}).then(res => {
      this.jobs = res.result.list.slice(0, 2);
    });
  }

  follow() {
    this.followSvc.follow(this.followForm.value).then(res => {
      console.log(res);
    });
  }
}


