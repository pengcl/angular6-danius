import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {EmployeeService} from '../../../../services/employee.service';
import {JobService} from '../../../../services/job.service';

@Component({
  selector: 'app-employee-seeker-delivered',
  templateUrl: './delivered.component.html',
  styleUrls: ['./delivered.component.scss']
})
export class EmployeeSeekerDeliveredComponent implements OnInit {

  user;
  jobs;

  comForm: FormGroup;

  delivers: any[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private employeeSvc: EmployeeService,
              private jobSvc: JobService) {
    navSvc.set({title: '职位管理'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.employeeSvc.getDelivered(this.user.key).then(res => {
      if (res.code === '0000') {
        this.delivers = res.result.list;
      }
    });
  }

  onSelect() {
  }

  addNew() {
    this.storageSvc.remove('comForm');
    this.router.navigate(['/employer/job/add']);
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1500).subscribe(() => {
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
    });
  }

}


