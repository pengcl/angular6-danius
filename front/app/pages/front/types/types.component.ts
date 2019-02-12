import {Component, OnInit} from '@angular/core';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';

import {ProductService} from '../../../services/product.service';
import {CONFIG} from '../../../app.config';
import {WxService} from '../../../../../modules/wx';
import {PageService} from '../../../services/page.service';

@Component({
  selector: 'app-front-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})

export class FrontTypesComponent implements OnInit {
  types: any[] = [];
  selectedType = null;
  pageType;

  constructor(private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private prodSvc: ProductService,
              private wxSvc: WxService,
              private pageSvc: PageService) {
    navSvc.set({title: '分类列表'});
    tabSvc.set({show: true}, 1);
    this.pageType = pageSvc.config;
  }

  ngOnInit() {
    this.prodSvc.getCatalogs().then(res => {
      this.types = res.childList;
      this.selectedType = this.types.length > 0 ? this.types[0] : null;
    });

    this.wxSvc.config({
      title: '翼分期 - 优质皮具',
      desc: '大牌制造商直供，剔除品牌溢价；货到付款，全场包邮，购物无忧！',
      link: CONFIG.webHost + '/front/types',
      imgUrl: CONFIG.webHost + '/assets/images/share-' + this.pageType.type + '.png',
    }).then(() => {
      // 其它操作，可以确保注册成功以后才有效
      console.log('注册成功');
    }).catch((err: string) => {
      console.log(`注册失败，原因：${err}`);
    });
  }

  setType(type) {
    this.selectedType = type;
  }
}
