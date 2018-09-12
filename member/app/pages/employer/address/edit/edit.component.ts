import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {OverlayService} from '../../../../../../modules/overlay';
import {PickerService, ToastService} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {JobService} from '../../../../services/job.service';

import {DATA} from '../../../../../../config/cn';

@Component({
  selector: 'app-employer-address-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EmployerAddressEditComponent implements OnInit {

  user;

  id;

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
              private toastSvc: ToastService,
              private authSvc: AuthService,
              private jobSvc: JobService) {
    navSvc.set({title: '添加工作地点'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.id = this.route.snapshot.params['id'];

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.addressForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
      addressprovince: new FormControl('', [Validators.required]),
      addressprovincecode: new FormControl('', [Validators.required]),
      addresscity: new FormControl('', [Validators.required]),
      addresscitycode: new FormControl('', [Validators.required]),
      addressarea: new FormControl('', [Validators.required]),
      addressareacode: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      doornumber: new FormControl('', [])
    });

    this.addressForm.get('key').setValue(this.user.key);

    this.jobSvc.getJob(this.user.key, this.id).then(res => {
      if (res.code !== '0000') {
        return false;
      }
      for (const key in this.addressForm.value) {
        if (res.result[key]) {
          this.addressForm.get(key).setValue(res.result[key]);
        }
      }
    });
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
    this.isSubmit = true;
    if (this.addressForm.invalid) {
      return false;
    }

    this.toastSvc.loading('保存中', 9999);
    this.jobSvc.post(this.addressForm.value).then(res => {
      this.toastSvc.hide();
      if (res.code === '0000') {
        this.overlaySvc.hide();
        this.location.back();
      }
    });
  }
}


