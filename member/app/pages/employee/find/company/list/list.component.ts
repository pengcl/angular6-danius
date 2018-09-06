import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {CONFIG} from '../../../../../../../config/app.config';
import {FINANCE_DATA, SCOPE_DATA} from '../../../../../../../config/data';

import {InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../../modules/tabbar';
import {AuthService} from '../../../../../services/auth.service';
import {UserService} from '../../../../../services/user.service';
import {JobService} from '../../../../../services/job.service';
import {CompanyService} from '../../../../../services/company.service';

function resetData(arr) {
  const mainArr = [];
  arr.forEach((item) => {
    const mainItem = {};
    let names = item.name;
    const subs = [];
    if (item.sub[0].sub) {
      item.sub.forEach(subItem => {
        names = names + '/' + subItem.name;
        subItem.sub.forEach(v => {
          const sub = {
            name: v.name,
            code: v.code
          };
          subs.push(sub);
        });
      });
    } else {
      item.sub.forEach(subItem => {
        const sub = {
          name: subItem.name,
          code: subItem.code
        };
        subs.push(sub);
      });
    }
    mainItem['name'] = names;
    mainItem['sub'] = subs;
    mainArr.push(mainItem);
  });
  return mainArr;
}

declare interface Params {
  key: string;
  page: number;
  tradeids: string;
  staffsize: string | number;
  financingprogress: string | number;
}

@Component({
  selector: 'app-employee-find-company-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployeeFindCompanyListComponent implements OnInit {
  config = CONFIG;
  user;

  type;
  typeShow: Boolean = null;
  companies;

  industries;

  scopes = SCOPE_DATA;
  finances = FINANCE_DATA;

  params: Params = {
    key: '',
    page: 1,
    tradeids: '',
    staffsize: '',
    financingprogress: ''
  };

  @ViewChild('comp') private comp: InfiniteLoaderComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private comSvc: CompanyService,
              private jobSvc: JobService) {
    navSvc.set({title: '查找公司'});
    tabSvc.set({show: true}, 1);
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.location.onPopState(state => {
      this.typeShow = false;
    });

    this.params.key = this.user.key;

    this.getData();

    this.jobSvc.getIndustry().then(res => {
      if (res.code === '0000') {
        this.industries = resetData(res.result);
      }
    });
  }

  getData() {
    this.params.page = 1;
    this.comp.restart();
    this.comSvc.findCompanies(this.params).then(res => {
      this.companies = res.result.list;
      console.log(res.result);
    });
  }

  showFilter(type) {
    this.typeShow = true;
    this.type = type;
    this.location.pushState('', 'showFilter', this.location.path(), '');
  }

  setFinance(finance) {
    this.params.financingprogress = finance.value;
  }

  setScope(scope) {
    this.params.staffsize = scope.value;
  }

  setIndustry(industry) {
    this.params.tradeids = industry ? industry.code : '';
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1500).subscribe(() => {
      this.params.page = this.params.page + 1;
      this.comSvc.findCompanies(this.params).then(res => {
        if (res.code === '0000') {
          if (this.params.page >= res.result.totalPage) {
            comp.setFinished();
            return;
          } else {
            this.companies = this.companies.concat(res.result.list);
          }
        }
      });
      comp.resolveLoading();
    });
  }

  reset() {
    this.typeShow = false;
    this.type = null;
  }

  sure() {
    console.log(this.params);
    this.typeShow = false;
    this.getData();
  }
}


