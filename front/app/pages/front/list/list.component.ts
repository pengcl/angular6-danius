import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {timer as observableTimer} from 'rxjs';
import {InfiniteLoaderComponent} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {LogService} from '../../../services/log.service';
import {ProductService} from '../../../services/product.service';

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

  @ViewChild('comp') private comp: InfiniteLoaderComponent;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private logSvc: LogService,
              private prodSvc: ProductService) {
    navSvc.set({title: '翼分期优选-商品列表'});
    tabSvc.set({show: true}, 1);
  }

  ngOnInit() {
    this.prodSvc.getCatalogs(this.id).then(res => {
      this.types = res.childList;
    });
    this.prodSvc.getList(this.sid ? this.sid : this.id).then(res => {
      this.prods = res.list;
      this.totalPages = res.totalPage;
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
