import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {DialogService, Uploader, UploaderOptions} from 'ngx-weui';
import {CONFIG} from '../../../../../config/app.config';

@Component({
  selector: 'app-employer-qualify',
  templateUrl: './qualify.component.html',
  styleUrls: ['./qualify.component.scss']
})
export class EmployerQualifyComponent implements OnInit {
  config = CONFIG;

  user;
  userInfo;

  comUploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/call.ht?action=uploadLicenceImage',
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

  jobUploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/call.ht?action=uploadJobCertImage',
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

  qualityForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService) {
    navSvc.set({title: '教育经历'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.comUploader.options.params.key = this.user.key;
    this.jobUploader.options.params.key = this.user.key;

    this.qualityForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
    });

    this.userSvc.get(this.user.key).then(res => {
      this.userInfo = res.result;
    });
  }

  cancel() {
    this.router.navigate(['/employer/job/add']);
  }

  confirm() {
    this.dialogSvc.show({title: '提交认证成功！', content: '认证信息审核中，成功通过后，您的企业信息中将带有认证标识，请留意！', cancel: '', confirm: '我知道了'}).subscribe(data => {
      if (data.value) {
        this.router.navigate(['/employer/job/add']);
      }
    });
  }

}


