import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {MaskComponent} from 'ngx-weui';

import {StorageService} from '../../../../../service/storage.service';
import {OverlayService, OverlayComponent} from '../../../../../modules/overlay';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';

import {LogService} from '../../../services/log.service';
import {ProductService} from '../../../services/product.service';
import {getIndex} from '../../../../../commons/js/utils';

@Component({
  selector: 'app-front-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})

export class FrontItemComponent implements OnInit {
  prod;
  skuList: any[] = [];
  sku;
  attrs;
  attrLength = 1;

  mainImg;

  itemForm = {
    productId: this.route.snapshot.params['id'],
    totalQuantity: 1,
    attrs: []
  };

  config = {
    grabCursor: true,
    slidesPerView: 'auto',
    pagination: false,
    autoplay: {
      delay: 5000,
    }
  };
  mainIndex = 1;

  @ViewChild('ruler') private ruler: MaskComponent;
  @ViewChild('tips') private tips: OverlayComponent;
  @ViewChild('overlay') private overlay: OverlayComponent;
  @ViewChild('service') private service: OverlayComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: LocationStrategy,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private logSvc: LogService,
              private prodSvc: ProductService) {
    navSvc.set({title: '翼分期优选-商品详情'});
    tabSvc.set({show: false}, 1);
  }

  ngOnInit() {
    this.prodSvc.getItem(this.route.snapshot.params['id']).then(res => {
      this.prod = res;
      this.skuList = res.skuList;

      const attrs = [];

      res.attributeList.forEach(item => {
        attrs.push({
          id: item.id,
          name: item.name,
          selected: {
            id: item.list[0].id,
            value: item.list[0].value
          }
        });
      });

      const cds = attrs[0].id + ':' + attrs[0].selected.id;
      this.getSku(cds);
      this.itemForm.attrs = attrs;
      this.attrs = this.itemForm.attrs;
      this.attrLength = this.attrs.length;

      this.itemForm['name'] = this.prod.productName;
      this.itemForm['price'] = this.prod.salesPrice;
      this.mainImg = res.imgList[0];
      this.itemForm['img'] = this.mainImg;

      // this.overlaySvc.show();
      this.logSvc.log('itemLoad', this.route.snapshot.params['id']).then();
    });

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });
  }

  showOverlay() {
    this.overlay.show();
  }

  showService() {
    this.service.show();
    this.location.pushState('', 'service', this.location.path(), '');
  }

  close() {
    this.overlay.hide();
  }

  getSku(cds) {
    const sku = [];
    this.skuList.forEach(item => {
      if (item.specificationproperties.indexOf(cds) !== -1 && item.quantity !== -1) {
        sku.push(item.specificationproperties.split(';')[1].split(':')[1]);
      }
    });
    this.sku = sku;
  }

  setMainImg(img) {
    this.mainImg = img;
    this.itemForm['img'] = this.mainImg;
  }

  showTips() {
    this.tips.show();
    this.location.pushState('', 'tips', this.location.path(), '');
  }

  back() {
    this.location.back();
  }

  showRuler() {
    this.ruler.show();
  }

  setAttr(attr, item, offSales) {
    if (offSales) {
      return false;
    }
    const attrIndex = getIndex(this.attrs, 'id', attr.id);
    this.attrs[attrIndex].selected = {
      id: item.id,
      value: item.value
    };

    this.itemForm.attrs = this.attrs;

    if (attr.name === '颜色') {
      this.mainImg = item.imgUrl;
      this.itemForm['img'] = this.mainImg;
      this.getSku(attr.id + ':' + item.id);
    }

    this.logSvc.log('setAttr' + attr.id, this.route.snapshot.params['id']).then();
  }

  stepperChange(e) {
    this.logSvc.log(e >= this.itemForm.totalQuantity ? 'add' : 'reduce', this.route.snapshot.params['id']).then();
  }

  onIndexChange(e) {
    this.mainIndex = e + 1;
  }

  go(isCan) {
    if (!isCan) {
      return false;
    }
    this.storageSvc.set('itemForm', JSON.stringify(this.itemForm));
    this.router.navigate(['/front/checkout']);
  }
}
