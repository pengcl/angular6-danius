import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {CONFIG} from '../../../../../../../config/app.config';
import {InfiniteLoaderComponent} from 'ngx-weui';
import {StorageService} from '../../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../../modules/tabbar';
import {AuthService} from '../../../../../services/auth.service';
import {UserService} from '../../../../../services/user.service';
import {CompanyService} from '../../../../../services/company.service';

@Component({
  selector: 'app-employer-company-product-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployerCompanyProductListComponent implements OnInit {
  config = CONFIG;

  user;
  staffs;

  prods: any[] = [];
  comForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private comSvc: CompanyService) {
    navSvc.set({title: '公司高管'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.comForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      page: new FormControl('', [Validators.required])
    });

    this.comForm.get('key').setValue(this.user.key);
    this.comForm.get('page').setValue(1);

    this.userSvc.get(this.user.key).then(res => {
      this.prods = res.result.productList;
      console.log(this.prods);
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
      this.comSvc.getStaffs(this.user.key).then(res => {
        if (res.code === '0000') {
          if (this.comForm.get('page').value >= res.result.totalPage) {
            comp.setFinished();
            return;
          } else {
            this.staffs = this.staffs.concat(res.result.list);
          }
        }
      });
      comp.resolveLoading();
    });
  }

}


