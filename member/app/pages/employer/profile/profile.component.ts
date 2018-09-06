import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {StorageService} from '../../../../../service/storage.service';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {OverlayService} from '../../../../../modules/overlay';
import {ToastService, PickerService, Uploader, UploaderOptions} from 'ngx-weui';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {CONFIG} from '../../../../../config/app.config';

@Component({
  selector: 'app-employer-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class EmployerProfileComponent implements OnInit {
  config = CONFIG;
  user;

  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/call.ht?action=uploadHeadImage',
    headers: [],
    params: {
      key: ''
    },
    auto: true,
    onUploadSuccess: (file, res) => {
      const _res = JSON.parse(res);
      if (_res.code === '0000') {
        this.profileForm.get('headimage').setValue(_res.result.headimage);
      }
    }
  });

  profileForm: FormGroup;
  formControl;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private toastSvc: ToastService,
              private overlaySvc: OverlayService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private pickerSvc: PickerService,
              private authSvc: AuthService,
              private userSvc: UserService) {
    navSvc.set({title: '编辑个人信息'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.uploader.options.params.key = this.user.key;

    this.profileForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      headimage: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      post: new FormControl('', [Validators.required])
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        console.log(res.result);
        this.profileForm.get('username').setValue(res.result.user.username);
        this.profileForm.get('headimage').setValue(res.result.user.headimage);
        this.profileForm.get('email').setValue(res.result.user.email);
        if (res.result.userCompany) {
          this.profileForm.get('post').setValue(res.result.userCompany.post);
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

  overlaySubmit() {
    if (this.profileForm.get(this.formControl).invalid) {
      return false;
    }
    this.location.back();
    this.overlaySvc.hide();
    this.singleSubmit();
  }
}


