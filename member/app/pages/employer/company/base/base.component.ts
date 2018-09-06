import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {CONFIG} from '../../../../../../config/app.config';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {OverlayService} from '../../../../../../modules/overlay';
import {ToastService, PickerService, Uploader, UploaderOptions} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-employer-company-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class EmployerCompanyBaseComponent implements OnInit {
  config = CONFIG;
  user;

  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/call.ht?action=uploadCompanyLogo',
    headers: [],
    params: {
      key: ''
    },
    auto: true,
    onUploadSuccess: (file, res) => {
      const _res = JSON.parse(res);
      console.log(_res);
      if (_res.code === '0000') {
        this.profileForm.get('headerimage').setValue(_res.result.headerimage);
      }
    }
  });

  profileForm: FormGroup;
  formControl;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private toastSvc: ToastService,
              private pickerSvc: PickerService,
              private authSvc: AuthService,
              private userSvc: UserService) {
    navSvc.set({title: '公司基本信息'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.uploader.options.params.key = this.user.key;

    this.profileForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      headerimage: new FormControl('', [Validators.required]),
      companyname: new FormControl('', [Validators.required]),
      shortname: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        console.log(res.result);
        if (res.result.company) {
          this.profileForm.get('headerimage').setValue(res.result.company.headerimage);
          this.profileForm.get('companyname').setValue(res.result.company.companyname);
          this.profileForm.get('shortname').setValue(res.result.company.shortname);
          this.profileForm.get('address').setValue(res.result.company.address);
        }
      }
    });
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  singleSubmit() {
    const body = {};
    body['key'] = this.profileForm.get('key').value;
    body[this.formControl] = this.profileForm.get(this.formControl).value;
    this.toastSvc.loading('', 99999);
    this.userSvc.set(body).then(res => {
      this.toastSvc.hide();
    });
  }

  submit() {
    if (this.profileForm.get(this.formControl).invalid) {
      return false;
    }
    this.location.back();
    this.overlaySvc.hide();
    this.singleSubmit();
  }
}


