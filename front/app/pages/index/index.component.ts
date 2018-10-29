import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NavbarService} from '../../../../modules/navbar';
import {TabbarService} from '../../../../modules/tabbar';
import {ActivatedRoute} from '@angular/router';
import {timer as observableTimer, interval as observableInterval} from 'rxjs';
import {InfiniteLoaderComponent} from 'ngx-weui';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  config = {
    grabCursor: true,
    slidesPerView: 'auto',
    pagination: false,
    autoplay: false
  };

  page = 1;
  totalPages = 1;

  types: any[] = [];
  type = null;
  prods: any[] = [];
  recommends: any[] = [];

  @ViewChild('comp') private comp: InfiniteLoaderComponent;
  @ViewChild('container') private container: ElementRef;

  interval = null;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private prodSvc: ProductService) {
    navSvc.set({title: '金山优选-商品例表'});
    tabSvc.set({show: true}, 0);
  }

  ngOnInit() {
    this.prodSvc.getCatalogs().then(res => {
      const catalogs = [null, null, null];
      let count = 0;
      res.childList.forEach(item => {
        const catalog = {};
        this.prodSvc.getList(item.id).then(product => {
          catalog['id'] = item.id;
          catalog['name'] = item.name;
          catalog['sub'] = item.childList;
          catalog['prods'] = product.list.slice(0, 7);
          if (item.id === 10000098490415) {
            catalogs[0] = catalog;
          }
          if (item.id === 10000097480440) {
            catalogs[1] = catalog;
          }
          if (item.id === 10000097480426) {
            catalogs[2] = catalog;
          }
          count = count + 1;
          if (count === res.childList.length) {
            this.types = catalogs;
          }
        });
      });
    });

    this.prodSvc.getRecommends().then(res => {
      this.recommends = res.list;
    });
  }

  setType(type) {
    this.type = type;
    const containerTop = this.container.nativeElement.scrollTop;
    const targetTop = this.container.nativeElement.querySelector('#panel_' + type).offsetTop;
    const dis = targetTop - containerTop;
    let _offsetTop = 0;
    this.interval = observableInterval(16.6).subscribe(() => {
      _offsetTop = _offsetTop + 1;
      this.container.nativeElement.scrollTop = containerTop + (dis / 20) * _offsetTop - 50;
    });

    observableTimer(16.6 * 20).subscribe(() => {
      this.interval.unsubscribe();
    });
  }

  onLoadMore(comp) {
    observableTimer(1000).subscribe(() => {

      this.page = this.page + 1;

      // 获取当前页数据
      this.prodSvc.getList().then(res => {
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
