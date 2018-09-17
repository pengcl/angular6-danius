import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {timer as observableTimer} from 'rxjs';

import {DATA} from '../../../../../../../config/cn';
import {
  EDUCATIONS_DATA,
  EXPERIENCES_DATA,
  LENGTH_OF_MILITARY_DATA
} from '../../../../../../../config/data';
import {PickerService, InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../../modules/tabbar';
import {AuthService} from '../../../../../services/auth.service';
import {UserService} from '../../../../../services/user.service';
import {JobService} from '../../../../../services/job.service';

import {unshiftObj, getNFC} from '../../../../../../../commons/js/utils';

const SALARIES_DATA = [
  {label: '不限', value: ''},
  {label: '3k以下', value: '0-3'},
  {label: '3k-5k', value: '3-5'},
  {label: '5k-10k', value: '5-10'},
  {label: '10k-20k', value: '10-20'},
  {label: '20k-50k', value: '20-50'},
  {label: '50k以上', value: '50-260'},
];

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
  console.log(mainArr);
  return mainArr;
}

declare interface Params {
  key: string;
  page: number;
  tradeids: string;
  positionid: string;
  citycode: string;
  areacode: string;
  edutype: string;
  exptype: string;
  salarybegin: string;
  salaryend: string;
  isnew: string | number;
  isrecommend: string | number;
}

@Component({
  selector: 'app-employee-find-job-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployeeFindJobListComponent implements OnInit {

  user;

  type;
  typeShow: Boolean = null;
  jobs;

  intents;
  intent;

  industries;

  cities = DATA;

  educations = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});
  experiences = unshiftObj(EXPERIENCES_DATA, {label: '不限', value: ''});
  lengthOfMilitary = unshiftObj(LENGTH_OF_MILITARY_DATA, {label: '不限', value: ''});
  salaries = SALARIES_DATA;

  params: Params = {
    key: '',
    page: 1,
    tradeids: '',
    positionid: '',
    citycode: '',
    areacode: '',
    edutype: '',
    exptype: '',
    salarybegin: '',
    salaryend: '',
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
              private jobSvc: JobService) {
    navSvc.set({title: '找工作'});
    tabSvc.set({show: true}, 0);
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.location.onPopState(state => {
      this.typeShow = false;
    });

    this.params.key = this.user.key;
    this.params.isrecommend = 1;

    this.userSvc.getIntents(this.user.key).then(res => {
      if (res.code === '0000') {
        this.intents = res.result;
        if (this.intents.length > 0) {
          return this.intents[this.intents.length - 1];
        }
        return null;
      }
    }).then(intent => {
      if (intent) {
        this.params.positionid = intent.id;
      }
      this.getData();
    });

    this.jobSvc.getIndustry().then(res => {
      if (res.code === '0000') {
        this.industries = resetData(res.result);
      }
    });
  }

  getData() {
    this.params.page = 1;
    this.comp.restart();
    this.jobSvc.findJobs(this.params).then(res => {
      this.jobs = res.result.list;
    });
  }

  getNFC(arr, code) {
    const name = getNFC(arr, code);
    return name;
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

  setIntent(intent) {
    this.intent = intent;
  }

  showFilter(type) {
    if (type !== 2) {
      if (this.typeShow) {
        this.typeShow = false;
        this.location.back();
        if (this.type !== type) {
          observableTimer(300).subscribe(() => {
            this.type = type;
            this.typeShow = true;
            this.location.pushState('', 'showFilter', this.location.path(), '');
          });
        }
      } else {
        this.typeShow = true;
        this.type = type;
        this.location.pushState('', 'showFilter', this.location.path(), '');
      }
    } else {
      this.type = type;
      if (this.typeShow) {
        this.typeShow = false;
      }
      this.pickerSvc.showCity(DATA, this.params.areacode).subscribe(res => {
        this.params.citycode = res.items[1].code;
        this.params.areacode = res.items[2].code;
        this.getData();
      });
    }
  }

  /*showPicker(type) {
    this.type = type;
    this.pickerSvc.showCity(DATA, this.params.areacode).subscribe(res => {
      this.params.citycode = res.items[1].code;
      this.params.areacode = res.items[2].code;
      this.getData();
    });
  }*/

  setIndustry(industry) {
    this.params.tradeids = industry ? industry.code : '';
  }

  setRequirements(type, requirement) {
    if (type === 'education') {
      this.params.edutype = requirement.value;
    }

    if (type === 'exptype') {
      this.params.exptype = requirement.value;
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
    this.params.page = 1;
    this.params.tradeids = '';
    this.params.citycode = '';
    this.params.areacode = '';
    this.params.edutype = '';
    this.params.exptype = '';
    this.params.salarybegin = '';
    this.params.salaryend = '';
    this.params.isnew = '';
    this.params.isrecommend = 1;
    this.getData();
  }

  sure() {
    this.typeShow = false;
    this.getData();
  }
}


