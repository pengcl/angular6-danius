import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

/*import {}*/
import {InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {JobService} from '../../../../services/job.service';

@Component({
  selector: 'app-employer-job-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployerJobListComponent implements OnInit {

  user;
  jobs;

  comForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private jobSvc: JobService) {
    navSvc.set({title: '职位管理'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.comForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      companyid: new FormControl('', [Validators.required]),
      page: new FormControl('', [Validators.required])
    });

    this.comForm.get('key').setValue(this.user.key);
    this.comForm.get('page').setValue(1);
    this.userSvc.get(this.user.key).then(res => {
      if (res.code !== '0000') {// 如果获取接口失败
        return false;
      }

      this.comForm.get('companyid').setValue(res.result.company.companyid);
    }).then(() => {
      this.jobSvc.findJobs(this.comForm.value).then(res => {
        if (res.code === '0000') {
          this.jobs = res.result.list;
        }
      });
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
          this.jobs = this.jobs.concat(res.result.list);
          comp.resolveLoading();
          if (this.comForm.get('page').value >= res.result.totalPage) {
            comp.setFinished();
          }
        }
      });
    });
  }

}


