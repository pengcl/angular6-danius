import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {CONFIG} from '../../../../../config/app.config';

import {UploaderOptions, Uploader} from 'ngx-weui';

@Component({
  selector: 'app-uploader-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class UploaderGalleryComponent implements OnInit {

  user: any;

  img: any;
  imgShow: Boolean = false;

  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: CONFIG.prefix.wApi + '/interface/housekeeper/uploadImage.ht',
    headers: [],
    params: {
      housekeeperId: ''
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
    /*this.uploader.options.params.housekeeperId = this.user.housekeeperId;*/
  }

  onGallery(item: any) {
    this.img = [{file: item._file, item: item}];
    this.imgShow = true;
  }

  onDel(item: any) {
    this.uploader.removeFromQueue(item.item);
  }

}
