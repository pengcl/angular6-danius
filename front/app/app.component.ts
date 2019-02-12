import {Component, OnInit} from '@angular/core';
import {filter, switchMap} from 'rxjs/internal/operators';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {NavigationStart} from '@angular/router';
import {StorageService} from '../../service/storage.service';
import {NAV_CONFIG} from '../../front/app/config/navbar.config';
import {TAB_CONFIG} from './pages/pages.config';
import {MENU_CONFIG} from '../../front/app/config/menu.config';
import {MenuService} from '../../modules/menu/menu.service';
import {TabbarService} from '../../modules/tabbar';
import {GhService} from '../../modules/gh/gh';
import {PageService} from './services/page.service';
import {WxService} from '../../modules/wx';

import {CONFIG} from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navConfig = NAV_CONFIG;
  tabConfig = TAB_CONFIG;
  menuConfig = MENU_CONFIG;
  menuShow = false;

  gh = '';
  pageType;

  sysConfig = {
    title: '大牛优品 - 优质制造商直供商城',
    desc: '大牌制造商直供，剔除品牌溢价；货到付款，全场包邮，购物无忧！',
    link: CONFIG.webHost + '/index',
    imgUrl: CONFIG.webHost + '/assets/images/share-dn.png',
    success: () => {
    }
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private storageSvc: StorageService,
              private menuSvc: MenuService,
              private tabSvc: TabbarService,
              private ghSvc: GhService,
              private pageSvc: PageService,
              private wxSvc: WxService) {
    menuSvc.get().subscribe(res => {
      this.menuShow = res.show;
    });

    this.pageType = pageSvc.config;
    pageSvc.get().subscribe(config => {
      this.pageType = config;
    });

    tabSvc.set(TAB_CONFIG);
    tabSvc.get().subscribe(res => {
      this.tabConfig = res;
    });

    router.events.pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.menuSvc.set({show: false});
      });
    this.route.queryParamMap.subscribe((queryParams: ParamMap) => {
      if (queryParams['params'].gh) {
        this.gh = queryParams['params'].gh;
      } else if (this.storageSvc.get('gh')) {
        this.gh = this.storageSvc.get('gh');
      }
      this.ghSvc.set(this.gh);

      this.pageType = {
        type: 'dn',
        name: '大牛优品'
      };

      if (queryParams['params'].pageType) {
        if (queryParams['params'].pageType === 'js') {
          this.pageType = {
            type: 'js',
            name: '金山优选'
          };
        }
        if (queryParams['params'].pageType === 'yfq') {
          this.pageType = {
            type: 'yfq',
            name: '翼分期优选'
          };
        }
        if (queryParams['params'].pageType === 'dn') {
          this.pageType = {
            type: 'dn',
            name: '大牛优品'
          };
        }
        this.pageSvc.set(this.pageType);
      }
    });
    this.sysConfig = {
      title: this.pageType.name + ' - 优质制造商直供商城',
      desc: '大牌制造商直供，剔除品牌溢价；货到付款，全场包邮，购物无忧！',
      link: CONFIG.webHost + '/index',
      imgUrl: CONFIG.webHost + '/assets/images/share-' + this.pageType.type + '.png',
      success: () => {
      }
    };
    wxSvc.defaultConfig(this.sysConfig);
    wxSvc.config({}).then(() => {
      // 其它操作，可以确保注册成功以后才有效
      // this.status = '注册成功';
    }).catch((err: string) => {
      console.log(`注册失败，原因：${err}`);
      // this.status = `注册失败，原因：${err}`;
    });

  }

  ngOnInit() {
  }

  menu() {
    this.menuSvc.set({show: false});
  }

}
