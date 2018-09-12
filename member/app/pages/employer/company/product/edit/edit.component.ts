import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
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
  selector: 'app-employer-company-product-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EmployerCompanyProductEditComponent implements OnInit {
  config = CONFIG;

  user;

  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/call.ht?action=uploadImageUtil',
    headers: [],
    params: {
      key: ''
    },
    auto: true,
    onUploadSuccess: (file, res: any) => {
      res = JSON.parse(res);
      if (res.code === '0000') {
        this.prodForm.get('imagepath').setValue(res.result);
      }
    }
  });

  prodForm: FormGroup;

  constructor(private storageSvc: StorageService,
              private route: ActivatedRoute,
              private location: LocationStrategy,
              private toastSvc: ToastService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private comSvc: CompanyService) {
    navSvc.set({title: '添加新产品'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.uploader.options.params.key = this.user.key;

    this.prodForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
      companyid: new FormControl('', [Validators.required]),
      productname: new FormControl('', [Validators.required]),
      imagepath: new FormControl('', [Validators.required]),
      introduction: new FormControl('', [Validators.required])
    });

    this.prodForm.get('key').setValue(this.user.key);
    this.prodForm.get('id').setValue(this.route.snapshot.params['id']);

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        this.prodForm.get('companyid').setValue(res.result.company.id);
      }
    });

    this.comSvc.getProduct(this.user.key, this.route.snapshot.params['id']).then(res => {
      if (res.code === '0000') {
        for (const key in this.prodForm.value) {
          if (res.result[key]) {
            this.prodForm.get(key).setValue(res.result[key]);
          }
        }
      }
    });
  }

  submit() {
    if (this.prodForm.invalid) {
      return false;
    }

    this.comSvc.addProduct(this.prodForm.value).then(res => {
      if (res.code === '0000') {
        this.location.back();
      }
    });
  }

}


