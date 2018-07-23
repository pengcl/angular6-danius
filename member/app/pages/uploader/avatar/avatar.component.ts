import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {Uploader, UploaderOptions} from 'ngx-weui';
import {CONFIG} from '../../../../../config/app.config';

@Component({
  selector: 'app-uploader-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class UploaderAvatarComponent implements OnInit {

  config = CONFIG;
  user: any;

  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/housekeeper/uploadHeadImage.ht',
    headers: [],
    params: {
      id: ''
    },
    auto: true,
    onFinished: function () {
      console.log('onFinished', arguments);
      this.location.back();
    },
    onError: function () {
      console.log('onError', arguments);
    }
  });

  constructor(private location: Location) {
  }

  ngOnInit() {
  }

  onGallery(item: any) {
    /*this.img = [{file: item._file, item: item}];
    this.imgShow = true;*/
  }

  onDel(item: any) {
    this.uploader.removeFromQueue(item.item);
  }

}
