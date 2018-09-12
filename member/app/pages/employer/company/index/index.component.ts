import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {CONFIG} from '../../../../../../config/app.config';
import {SCOPE_DATA, FINANCE_DATA} from '../../../../../../config/data';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {OverlayService} from '../../../../../../modules/overlay';
import {ToastService, DialogService, PickerService} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {CompanyService} from '../../../../services/company.service';
import {getIndex} from '../../../../../../commons/js/utils';

@Component({
  selector: 'app-employer-company-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class EmployerCompanyIndexComponent implements OnInit {
  config = CONFIG;

  user;

  strengths;
  DATA = {
    staffsize: SCOPE_DATA,
    financingprogress: FINANCE_DATA
  };
  images: any[] = [];
  prods: any[] = [];
  mans: any[] = [];

  comForm: FormGroup;
  formControl;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private companySvc: CompanyService) {
    navSvc.set({title: '我的公司'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.comForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      companyid: new FormControl('', [Validators.required]),
      companyname: new FormControl('', [Validators.required]),
      shortname: new FormControl('', [Validators.required]),
      headerimage: new FormControl('', [Validators.required]),
      tradename: new FormControl('', [Validators.required]),
      staffsize: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
      financingprogress: new FormControl('', [Validators.required]),
      introduction: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      post: new FormControl('', [Validators.required]),
      excellencenames: new FormControl('', [Validators.required]),
      excellenceids: new FormControl('', [Validators.required])
    });

    this.comForm.get('key').setValue(this.user.key);

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        this.images = res.result.imageList;
        this.prods = res.result.productList;
        this.mans = res.result.managerList;
        this.comForm.get('email').setValue(res.result.user.email);
        if (res.result.company) {
          this.comForm.get('companyid').setValue(res.result.company.id);
          this.comForm.get('headerimage').setValue(res.result.company.headerimage);

          this.comForm.get('companyname').setValue(res.result.company.companyname);
          this.comForm.get('shortname').setValue(res.result.company.shortname);
          this.comForm.get('tradename').setValue(res.result.company.tradename);

          this.comForm.get('staffsize').setValue(res.result.company.staffsize);
          this.comForm.get('website').setValue(res.result.company.website);
          this.comForm.get('financingprogress').setValue(res.result.company.financingprogress);
          this.comForm.get('introduction').setValue(res.result.company.introduction);

          this.comForm.get('excellenceids').setValue(res.result.company.excellenceid); // 服务器没有s
          this.comForm.get('excellencenames').setValue(res.result.company.excellencename);
        }
      }
    }).then(() => {
      this.companySvc.getStrengths(this.comForm.get('companyid').value).then(res => {
        this.strengths = res.result;
      });
    });
  }

  getIndex(arr, k, v) {
    return getIndex(arr, k, v) || 0;
  }

  showPicker(target) {
    this.formControl = target;
    const defaultSelect = getIndex(this.DATA[target], 'value', this.comForm.get(target).value) || 0;
    this.pickerSvc.show([this.DATA[target]], '', [defaultSelect], {cancel: '取消', confirm: '确认'}).subscribe(res => {
      this.comForm.get(target).setValue(res.items[0].value);
      this.singleSubmit();
    });
  }

  getValue(target) {
    const index = getIndex(this.DATA[target], 'value', this.comForm.get(target).value);
    return this.DATA[target][index].label;
  }

  setStrengths(strength) {
    const ids = this.comForm.get('excellenceids');
    const names = this.comForm.get('excellencenames');
    if (!names.value) {
      ids.setValue(strength.id);
      names.setValue(strength.excellencename);
    } else {
      const idValues = ids.value.split(',');
      const nameValues = names.value.split(',');
      const index = idValues.indexOf(strength.id);
      if (index !== -1) {
        idValues.splice(index, 1);
        nameValues.splice(index, 1);
      } else {
        if (idValues.length < 3) {
          idValues.push(strength.id);
          nameValues.push(strength.excellencename);
        } else {
          this.dialogSvc.show({content: '最多只能选择3个!', cancel: '继续', confirm: '我选好了'}).subscribe();
        }
      }

      let idValue = '';
      let nameValue = '';
      idValues.forEach(item => {
        if (idValue) {
          idValue = idValue + ',' + item;
        } else {
          idValue = item;
        }
      });

      ids.setValue(idValue);

      nameValues.forEach(item => {
        if (nameValue) {
          nameValue = nameValue + ',' + item;
        } else {
          nameValue = item;
        }
      });

      names.setValue(nameValue);
    }
  }

  moreStrength() {
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  singleSubmit() {
    const body = {};
    body['key'] = this.comForm.get('key').value;
    this.toastSvc.loading('', 99999);

    if (this.formControl === 'strengths') {
      body['excellenceids'] = this.comForm.get('excellenceids').value;
      body['excellencenames'] = this.comForm.get('excellencenames').value;
    } else {
      body[this.formControl] = this.comForm.get(this.formControl).value;
    }
    this.userSvc.set(body).then(res => {
      this.toastSvc.hide();
    });
  }

  submit() {
    if (this.formControl === 'strengths') {
      if (this.comForm.get('excellenceids').invalid) {
        return false;
      }
      if (this.comForm.get('excellencenames').invalid) {
        return false;
      }
    } else {
      if (this.comForm.get(this.formControl).invalid) {
        return false;
      }
    }
    this.location.back();
    this.overlaySvc.hide();
    this.singleSubmit();
  }
}


