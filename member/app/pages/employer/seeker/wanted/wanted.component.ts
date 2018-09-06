import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

/*import {}*/
import {InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {EmployeeService} from '../../../../services/employee.service';

@Component({
  selector: 'app-employer-seeker-wanted',
  templateUrl: './wanted.component.html',
  styleUrls: ['./wanted.component.scss']
})
export class EmployerSeekerWantedComponent implements OnInit {

  user;
  follows;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private employeeSvc: EmployeeService) {
    navSvc.set({title: '收藏的牛人'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.employeeSvc.getFollows(this.user.key).then(res => {
      if (res.code === '0000') {
        this.follows = res.result;
        console.log(this.follows);
      }
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    /*observableTimer(1500).subscribe(() => {
      this.comForm.get('page').setValue(this.comForm.get('page').value + 1);
      this.jobSvc.findJobs(this.comForm.value).then(res => {
        if (res.code === '0000') {
          if (this.comForm.get('page').value >= res.result.totalPage) {
            comp.setFinished();
            return;
          } else {
            this.jobs = this.jobs.concat(res.result.list);
          }
        }
      });
      comp.resolveLoading();
    });*/
  }

}


