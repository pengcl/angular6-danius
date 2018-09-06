import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {CONFIG} from '../../../../../../../config/app.config';
import {NavbarService} from '../../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../../modules/tabbar';
import {AuthService} from '../../../../../services/auth.service';
import {UserService} from '../../../../../services/user.service';
import {FollowService} from '../../../../../services/follow.service';
import {CompanyService} from '../../../../../services/company.service';
import {JobService} from '../../../../../services/job.service';

@Component({
  selector: 'app-employee-find-company-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class EmployeeFindCompanyItemComponent implements OnInit {
  config = CONFIG;
  albumConfig = {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    pagination: true
  };

  prodConfig = {
    grabCursor: true,
    centeredSlides: false,
    slidesPerView: 'auto',
    pagination: true
  };

  manConfig = {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    pagination: true
  };

  user;
  id;

  company;
  jobs;

  followForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private followSvc: FollowService,
              private comSvc: CompanyService,
              private jobSvc: JobService) {
    navSvc.set({title: '公司详情'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.id = this.route.snapshot.params['id'];

    this.followForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      datatype: new FormControl('', [Validators.required]),
      companyid: new FormControl('', [Validators.required])
    });

    this.followForm.get('key').setValue(this.user.key);
    this.followForm.get('datatype').setValue(0);
    this.followForm.get('companyid').setValue(this.id);

    this.comSvc.getCompany(this.user.key, this.id).then(res => {
      if (res.code === '0000') {
        this.company = res.result;
      }
      console.log(res);
    });

    this.jobSvc.findJobs({key: this.user.key}).then(res => {
      this.jobs = res.result.list;
      console.log(res);
    });
  }

  follow() {
    this.followSvc.follow(this.followForm.value).then(res => {
      console.log(res);
    });
  }
}


