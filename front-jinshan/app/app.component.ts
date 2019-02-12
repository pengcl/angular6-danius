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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private storageSvc: StorageService,
              private menuSvc: MenuService,
              private tabSvc: TabbarService,
              private ghSvc: GhService) {
    menuSvc.get().subscribe(res => {
      this.menuShow = res.show;
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
    });
  }

  ngOnInit() {
  }

  menu() {
    this.menuSvc.set({show: false});
  }

}
