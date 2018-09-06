import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {OverlayService} from '../../../../../../modules/overlay';
import {PickerService} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';

import {DATA} from '../../../../../../config/cn';

@Component({
  selector: 'app-employer-address-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class EmployerAddressAddComponent implements OnInit {

  user;

  addressForm: FormGroup;
  formControl;

  isSubmit: Boolean = false;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private pickerSvc: PickerService,
              private authSvc: AuthService) {
    navSvc.set({title: '添加工作地点'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.addressForm = new FormGroup({
      addressprovince: new FormControl('', [Validators.required]),
      addressprovincecode: new FormControl('', [Validators.required]),
      addresscity: new FormControl('', [Validators.required]),
      addresscitycode: new FormControl('', [Validators.required]),
      addressarea: new FormControl('', [Validators.required]),
      addressareacode: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      doornumber: new FormControl('', [])
    });

    let storageForm = this.storageSvc.get('comForm');
    if (storageForm) {
      storageForm = JSON.parse(storageForm);
      for (const key in this.addressForm.value) {
        if (storageForm[key]) {
          this.addressForm.get(key).setValue(storageForm[key]);
        }
      }
    }
  }

  showPicker() {
    this.pickerSvc.showCity(DATA, this.addressForm.get('addressareacode').value).subscribe(res => {
      this.addressForm.get('addressprovince').setValue(res.items[0].name);
      this.addressForm.get('addressprovincecode').setValue(res.items[0].code);
      this.addressForm.get('addresscity').setValue(res.items[1].name);
      this.addressForm.get('addresscitycode').setValue(res.items[1].code);
      this.addressForm.get('addressarea').setValue(res.items[2].name);
      this.addressForm.get('addressareacode').setValue(res.items[2].code);
    });
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  overlaySubmit() {
    if (this.addressForm.get(this.formControl).invalid) {
      return false;
    }
    this.location.back();
    this.overlaySvc.hide();
  }

  submit() {
    if (this.addressForm.invalid) {
      return false;
    }

    let storageForm = this.storageSvc.get('comForm');
    if (storageForm) { // 如果storageForm存在
      storageForm = JSON.parse(storageForm);
      for (const key in this.addressForm.value) {
        if (key) {
          storageForm[key] = this.addressForm.get(key).value;
        }
      }
      this.storageSvc.set('comForm', JSON.stringify(storageForm));
    } else {// 如果storageForm不存在
      this.storageSvc.set('comForm', JSON.stringify(this.addressForm.value));
    }

    this.location.back();
  }
}


