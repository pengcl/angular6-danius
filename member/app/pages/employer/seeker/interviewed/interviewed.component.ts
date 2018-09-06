import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {JobService} from '../../../../services/job.service';
import {EmployerService} from '../../../../services/employer.service';

@Component({
  selector: 'app-employer-seeker-interviewed',
  templateUrl: './interviewed.component.html',
  styleUrls: ['./interviewed.component.scss']
})
export class EmployerSeekerInterviewedComponent implements OnInit {

  user;
  interviews: any[] = [];
  interviewsPage = 1;
  interviewed: any[] = [];
  interviewedPage = 1;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private employerSvc: EmployerService) {
    navSvc.set({title: '面试的牛人'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.employerSvc.getInterviews(this.user.key, 0).then(res => {
      if (res.code === '0000') {
        this.interviews = res.result.list;
      }
    });

    this.employerSvc.getInterviews(this.user.key, 2).then(res => {
      if (res.code === '0000') {
        this.interviewed = res.result.list;
      }
    });
  }

  onSelect() {
  }

  onInterviewsLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1500).subscribe(() => {
      this.interviewsPage = this.interviewsPage + 1;
      this.employerSvc.getInterviews(this.user.key, 0).then(res => {
        if (res.code === '0000') {
          if (this.interviewsPage >= res.result.totalPages) {
            comp.setFinished();
          } else {
            this.interviews = this.interviews.concat(res.result.list);
          }
        }
      });
      comp.resolveLoading();
    });
  }

  onInterviewedLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1500).subscribe(() => {
      this.interviewedPage = this.interviewedPage + 1;
      this.employerSvc.getInterviews(this.user.key, 2).then(res => {
        if (res.code === '0000') {
          if (this.interviewedPage >= res.result.totalPages) {
            comp.setFinished();
          } else {
            this.interviewed = this.interviewed.concat(res.result.list);
          }
        }
      });
      comp.resolveLoading();
    });
  }

}


