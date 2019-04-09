import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {MaskComponent, DialogService} from 'ngx-weui';

import {StorageService} from '../../../../../service/storage.service';
import {OverlayService, OverlayComponent} from '../../../../../modules/overlay';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';

import {LogService} from '../../../services/log.service';
import {ProductService} from '../../../services/product.service';
import {getIndex} from '../../../../../commons/js/utils';
import {PageService} from '../../../services/page.service';
import {CartService} from '../../../services/cart.service';
import {AuthService} from '../../../services/auth.service';
import {CONFIG} from '../../../app.config';
import {WxService} from '../../../../../modules/wx';
import {LoaderService} from '../../../../../service/loader.service';

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

  price = 0;

  config = {
    grabCursor: true,
    slidesPerView: 'auto',
    pagination: true,
    autoplay: {
      delay: 5000,
    }
  };
  mainIndex = 1;

  tempAdr = '';

  @ViewChild('ruler') private ruler: MaskComponent;
  @ViewChild('tips') private tips: OverlayComponent;
  @ViewChild('overlay') private overlay: OverlayComponent;
  @ViewChild('service') private service: OverlayComponent;

  pageType;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: LocationStrategy,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private logSvc: LogService,
              private prodSvc: ProductService,
              private pageSvc: PageService,
              private cartSvc: CartService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private wxSvc: WxService,
              private loaderSvc: LoaderService) {
    this.pageType = pageSvc.config;
    navSvc.set({title: '商品详情'});
    tabSvc.set({show: false}, 1);
  }

  ngOnInit() {
    this.prodSvc.getItem(this.route.snapshot.params['id']).then(res => {
      const imgList = [];
      res.imgList.forEach(img => {
        const _img = img.replace('_mid', '_big');
        imgList.push(_img);
      });
      res.imgList = imgList;
      this.prod = res;
      this.price = res.salesPrice;
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
      // this.getSku(cds);
      this.itemForm.attrs = attrs;
      this.attrs = this.itemForm.attrs;
      this.attrLength = this.attrs.length;

      this.itemForm['name'] = this.prod.productName;
      this.itemForm['price'] = this.prod.salesPrice;
      this.mainImg = res.imgList[0];
      this.itemForm['img'] = this.mainImg;

      // this.overlaySvc.show();

      this.wxSvc.config({
        title: this.prod.productName + ' - ' + this.pageType.name,
        desc: '全场包邮，货到付款。简约小方包 翻盖设计 双色可选 小巧方便 时尚百搭！',
        link: CONFIG.webHost + '/index',
        imgUrl: this.mainImg,
      }).then(() => {
        // 其它操作，可以确保注册成功以后才有效
        console.log('注册成功');
      }).catch((err: string) => {
        console.log(`注册失败，原因：${err}`);
      });

      this.location.onPopState(state => {
        this.overlaySvc.hide();
        this.overlay.hide();
        this.service.hide();
      });

      this.logSvc.log('itemLoad', this.route.snapshot.params['id']).then();
    });


    const id = this.route.snapshot.params['id'];
    this.tempAdr = '';
    /*广州大牛信息科技有限公司<br>广州市天河区马场路28号富力公园 B1栋 3502<br>客服电话：020-85599918*/
    /*if (id === '10000100430356') {
      this.tempAdr = '菏泽市福美佳服饰有限公司<br>山东省菏泽市牡丹区长城路与人民路交汇处和谐广场一楼116号';
    }
    if (id === '10000099850572') {
      this.tempAdr = '日照市汇恒商贸有限公司<br>山东省日照市经济开发区后两河村沿街';
    }
    if (id === '10000099850704') {
      this.tempAdr = '菏泽东达商贸有限公司<br>菏泽市牡丹区古邑商城三号楼';
    }*/
  }

  showOverlay() {
    this.overlay.show();
    this.location.pushState('', 'selected', this.location.path(), '');
  }

  showService() {
    this.service.show();
    this.location.pushState('', 'service', this.location.path(), '');
  }

  close() {
    this.overlay.hide();
  }

  getQuantity(index, cds) {
    let result = false;

    let items = this.skuList;
    for (let i = 0; i < index; i++) {
      const _cds = this.attrs[i] + ':' + this.attrs[i].selected.id;
      // this.attrs[i].id;
      items = items.filter((item) => {
        return item.specificationproperties.indexOf(cds) !== -1 && item.quantity !== -1;
      });
    }

    items.forEach(item => {
      if (item.specificationproperties.indexOf(cds) !== -1 && item.quantity !== -1) {
        result = true;
      }
    });

    return result;
  }

  getPrice() {
    const index = this.attrs.length - 1;
    const cds = this.attrs[index].id + ':' + this.attrs[index].selected.id;
    let price = this.price;

    let items = this.skuList;
    for (let i = 0; i <= index; i++) {
      const _cds = this.attrs[i].id + ':' + this.attrs[i].selected.id;
      // this.attrs[i].id;
      items = items.filter((item) => {
        return item.specificationproperties.indexOf(_cds) !== -1 && item.quantity !== -1;
      });
    }

    items.forEach(item => {
      if (item.specificationproperties.indexOf(cds) !== -1 && item.quantity !== -1) {
        price = item.salepricediff ? item.salepricediff : this.price;
      }
    });

    return price;
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
      // this.getSku(attr.id + ':' + item.id);
    }

    this.price = this.getPrice();
    this.itemForm['price'] = this.price;

    this.logSvc.log('setAttr' + attr.id, this.route.snapshot.params['id']).then();
  }

  stepperChange(e) {
    this.logSvc.log(e >= this.itemForm.totalQuantity ? 'add' : 'reduce', this.route.snapshot.params['id']).then();
  }

  onIndexChange(e) {
    this.mainIndex = e + 1;
  }

  addCart(isCan) {
    if (!isCan) {
      return false;
    }

    const isLogged = this.authSvc.isLogged;
    const user = this.authSvc.currentUser;
    const sessionId = this.cartSvc.getId();

    const prod = JSON.parse(JSON.stringify(this.itemForm));
    const body = {
      productId: prod.productId,
      quantity: prod.totalQuantity,
      sessionId: isLogged ? '' : sessionId,
      phoneNumber: isLogged ? user : '',
      specifications: ''
    };
    if (prod.attrs) {
      prod.attrs.forEach(item => {
        if (body.specifications) {
          body.specifications = body.specifications + ';' + item.id + ':' + item.selected.id;
        } else {
          body.specifications = item.id + ':' + item.selected.id;
        }
      });
    }
    this.cartSvc.add(body).then(res => {
      if (res.code === '200') {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  go(isCan) {
    if (!isCan) {
      return false;
    }
    this.storageSvc.set('itemForm', JSON.stringify(this.itemForm));
    this.router.navigate(['/front/checkout']);
  }
}
