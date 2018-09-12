import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {ToastService, Uploader, UploaderOptions} from 'ngx-weui';

import {StorageService} from '../../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../../modules/tabbar';
import {AuthService} from '../../../../../services/auth.service';
import {UserService} from '../../../../../services/user.service';
import {CompanyService} from '../../../../../services/company.service';
import {CONFIG} from '../../../../../../../config/app.config';

@Component({
  selector: 'app-employer-company-staff-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class EmployerCompanyStaffAddComponent implements OnInit {
  config = CONFIG;

  user;

  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/call.ht?action=uploadImageUtil',
    headers: [],
    params: {
      key: ''
    },
    auto: true,
    onUploadSuccess: (file, res) => {
      const _res = JSON.parse(res);
      if (_res.code === '0000') {
        this.staffForm.get('headimage').setValue(_res.result);
      }
    }
  });

  staffForm: FormGroup;

  constructor(private storageSvc: StorageService,
              private location: LocationStrategy,
              private toastSvc: ToastService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private comSvc: CompanyService) {
    navSvc.set({title: '添加新高管'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.uploader.options.params.key = this.user.key;

    this.staffForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      companyid: new FormControl('', [Validators.required]),
      managername: new FormControl('', [Validators.required]),
      headimage: new FormControl('', [Validators.required]),
      postname: new FormControl('', [Validators.required]),
      introduction: new FormControl('', [Validators.required])
    });

    this.staffForm.get('key').setValue(this.user.key);
    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        this.staffForm.get('companyid').setValue(res.result.company.id);
      }
    });
  }

  submit() {
    if (this.staffForm.invalid) {
      return false;
    }

    this.comSvc.addStaff(this.staffForm.value).then(res => {
      if (res.code === '0000') {
        this.location.back();
      }
    });
  }

}


