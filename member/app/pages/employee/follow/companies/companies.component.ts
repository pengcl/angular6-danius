import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {CONFIG} from '../../../../../../config/app.config';
import {InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {FollowService} from '../../../../services/follow.service';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-employee-follow-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class EmployeeFollowCompaniesComponent implements OnInit {
  config = CONFIG;
  user;
  companies;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private followSvc: FollowService,
              private authSvc: AuthService) {
    navSvc.set({title: '关注的公司'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.followSvc.getFollows(this.user.key, 0).then(res => {
      this.companies = res.result.list;
    });
  }

  onSelect() {
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1500).subscribe(() => {
      /*this.comForm.get('page').setValue(this.comForm.get('page').value + 1);
      this.jobSvc.findJobs(this.comForm.value).then(res => {
        if (res.code === '0000') {
          if (this.comForm.get('page').value >= res.result.totalPage) {
            comp.setFinished();
            return;
          } else {
            this.jobs = this.jobs.concat(res.result.list);
          }
        }
      });*/
      comp.resolveLoading();
    });
  }

}


