import {Component, OnInit} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ToastService, PickerService, UploaderOptions, Uploader} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {OverlayService} from '../../../../../modules/overlay';
import {UserService} from '../../../services/user.service';

import {CONFIG} from '../../../../../config/app.config';

@Component({
  selector: 'app-resume-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ResumeEditComponent implements OnInit {
  config = CONFIG;

  user;
  userInfo;
  formControl = '';

  profileForm: FormGroup;

  images;
  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/call.ht?action=uploadUserImage',
    headers: [],
    params: {
      key: ''
    },
    auto: true,
    onUploadSuccess: (file, res) => {
      const _res = JSON.parse(res);
      if (_res.code === '0000') {
      }
    }
  });

  educations;
  works;
  intents;

  constructor(private location: LocationStrategy,
              private toastSvc: ToastService,
              private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private overlaySvc: OverlayService,
              private userSvc: UserService) {
    navSvc.set({title: '个人信息'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.uploader.options.params.key = this.user.key;

    this.profileForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      introduce: new FormControl('', [Validators.required, Validators.maxLength(200)])
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.userSvc.get(this.user.key).then(res => {
      this.userInfo = res.result;
      if (res.result.personal) {
        this.profileForm.get('introduce').setValue(res.result.personal.introduce);
        const images = [];
        res.result.imageList.forEach(item => {
          images.push(item);
        });
        this.images = images;
      }
    });

    this.userSvc.getEducations(this.user.key).then(res => {
      if (res.code === '0000') {
        this.educations = res.result;
      }
    });

    this.userSvc.getWorks(this.user.key).then(res => {
      if (res.code === '0000') {
        this.works = res.result;
      }
    });

    this.userSvc.getIntents(this.user.key).then(res => {
      if (res.code === '0000') {
        this.intents = res.result;
        console.log(this.intents);
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

  preview() {
  }
}
