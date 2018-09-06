import {Component, OnInit} from '@angular/core';

import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {Uploader, UploaderOptions} from 'ngx-weui';
import {CONFIG} from '../../../../../../config/app.config';

@Component({
  selector: 'app-employer-company-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class EmployerCompanyAlbumsComponent implements OnInit {
  config = CONFIG;

  user;
  images: any[] = [];

  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/call.ht?action=uploadCompanyLogo',
    headers: [],
    params: {
      key: ''
    },
    auto: true,
    onUploadSuccess: (file, res) => {
      const _res = JSON.parse(res);
    },
    onError: function () {
      console.log('onError', arguments);
    }
  });

  constructor(private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService) {
    navSvc.set({title: '公司相册'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.uploader.options.params.key = this.user.key;

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        this.images = res.result.imageList;
        console.log(res);
      }
    });

    /*this.uploader.options.params.housekeeperId = this.user.housekeeperId;*/
  }
}


