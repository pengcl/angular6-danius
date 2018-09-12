import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {timer as observableTimer} from 'rxjs';

import {
  EDUCATIONS_DATA,
  WORK_STATUSES_DATA,
  EXPERIENCES_DATA,
  LENGTH_OF_MILITARY_DATA
} from '../../../../../../config/data';
import {PickerService, InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {EmployeeService} from '../../../../services/employee.service';
import {JobService} from '../../../../services/job.service';
import {unshiftObj} from '../../../../../../commons/js/utils';

declare interface Params {
  key: string;
  page: number;
  postid: string;
  edutype: string;
  military: string;
  salarybegin: string;
  salaryend: string;
  workstatus: string;
  isnew: string | number;
  isrecommend: string | number;
}

@Component({
  selector: 'app-employer-find-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployerFindListComponent implements OnInit {

  user;

  type;
  typeShow: Boolean = null;
  jobs;

  employees;

  posts;

  industries;

  educations = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});
  experiences = unshiftObj(EXPERIENCES_DATA, {label: '不限', value: ''});
  lengthOfMilitary = unshiftObj(LENGTH_OF_MILITARY_DATA, {label: '不限', value: ''});
  workStatuses = unshiftObj(WORK_STATUSES_DATA, {label: '不限', value: ''});

  params: Params = {
    key: '',
    page: 1,
    postid: '',
    edutype: '',
    military: '',
    salarybegin: '',
    salaryend: '',
    workstatus: '',
    isnew: '',
    isrecommend: ''
  };

  @ViewChild('comp') private comp: InfiniteLoaderComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private employeeSvc: EmployeeService,
              private jobSvc: JobService) {
    navSvc.set({title: '找牛人'});
    tabSvc.set({show: true}, 0);
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.location.onPopState(state => {
      this.typeShow = false;
    });

    this.params.key = this.user.key;
    this.params.isrecommend = 1;

    this.jobSvc.getPosts(this.user.key).then(res => {
      if (res.code === '0000') {
        this.posts = res.result.slice(0, 3);
        if (this.posts.length > 0) {
          return this.posts[this.posts.length - 1];
        }
        return null;
      }
    }).then(post => {
      if (post) {
        this.params.postid = post.id;
      }
      this.getData();
    });
  }

  getData() {
    this.params.page = 1;
    this.comp.restart();
    this.employeeSvc.findEmployees(this.params).then(res => {
      this.employees = res.result.list;
    });
  }

  setListType(type) {
    if (type === 'new') {
      this.params.isnew = 1;
      this.params.isrecommend = '';
    } else {
      this.params.isnew = '';
      this.params.isrecommend = 1;
    }
  }

  setPost(post) {
    this.params.postid = post.id;
    this.getData();
  }

  showFilter(type) {
    this.typeShow = true;
    this.type = type;
    this.location.pushState('', 'showFilter', this.location.path(), '');
  }

  setRequirements(type, requirement) {
    if (type === 'education') {
      this.params.edutype = requirement.value;
    }

    if (type === 'military') {
      this.params.military = requirement.value;
    }

    if (type === 'workStatus') {
      this.params.workstatus = requirement.value;
    }

    if (type === 'salary') {
      this.params.salarybegin = requirement.value ? requirement.value.split('-')[0] : '';
      this.params.salaryend = requirement.value ? requirement.value.split('-')[1] : '';
    }
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1500).subscribe(() => {
      this.params.page = this.params.page + 1;
      this.jobSvc.findJobs(this.params).then(res => {
        if (res.code === '0000') {
          if (this.params.page >= res.result.totalPage) {
            comp.setFinished();
            return;
          } else {
            this.jobs = this.jobs.concat(res.result.list);
            comp.resolveLoading();
          }
        }
      });
    });
  }

  reset() {
    this.typeShow = false;
    this.type = null;
  }

  sure() {
    this.typeShow = false;
    this.getData();
  }
}
