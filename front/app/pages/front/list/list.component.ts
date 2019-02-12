import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {timer as observableTimer} from 'rxjs';
import {InfiniteLoaderComponent} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {LogService} from '../../../services/log.service';
import {ProductService} from '../../../services/product.service';
import {PageService} from '../../../services/page.service';
import {CONFIG} from '../../../app.config';
import {WxService} from '../../../../../modules/wx';

@Component({
  selector: 'app-front-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class FrontListComponent implements OnInit {
  id = this.route.snapshot.params['id'];
  sid = this.route.snapshot.queryParams['sid'];

  config = {
    grabCursor: true,
    slidesPerView: 'auto',
    pagination: false,
    autoplay: false
  };

  page = 1;
  totalPages = 1;

  types: any[] = [];
  prods: any[] = [];

  pageType;

  @ViewChild('comp') private comp: InfiniteLoaderComponent;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private logSvc: LogService,
              private prodSvc: ProductService,
              private pageSvc: PageService,
              private wxSvc: WxService) {
    navSvc.set({title: '商品列表'});
    tabSvc.set({show: true}, 1);
    this.pageType = pageSvc.config;
  }

  ngOnInit() {
    this.prodSvc.getCatalogs(this.id).then(res => {
      this.types = res.childList;
    });
    this.prodSvc.getList(this.sid ? this.sid : this.id).then(res => {
      this.prods = res.list;
      this.totalPages = res.totalPage;
      this.wxSvc.config({
        title: '翼分期 - ' + (res.list[0].productCategoryName).split('/')[2],
        desc: '大牌制造商直供，剔除品牌溢价；货到付款，全场包邮，购物无忧！',
        link: window.location.href,
        imgUrl: CONFIG.webHost + '/assets/images/share-' + this.pageType.type + '.png',
      }).then(() => {
        // 其它操作，可以确保注册成功以后才有效
        console.log('注册成功');
      }).catch((err: string) => {
        console.log(`注册失败，原因：${err}`);
      });
    });

    this.logSvc.log('listLoad').then();
  }

  setSid(sid) {
    this.sid = sid;
    this.page = 1;
    this.prodSvc.getList(sid, this.page).then(res => {
      this.prods = res.list;
      this.totalPages = res.totalPage;
      this.comp.restart();
    });
  }

  onLoadMore(comp) {
    observableTimer(1000).subscribe(() => {

      this.page = this.page + 1;

      // 获取当前页数据
      this.prodSvc.getList(this.sid ? this.sid : this.id, this.page).then(res => {
        if (res.code === '0000') {
          this.prods = this.prods.concat(res.list);
        }
      });

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });
  }
}
