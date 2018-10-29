import {Component, OnInit} from '@angular/core';
import {filter} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {NavigationStart} from '@angular/router';
import {NAV_CONFIG} from '../../front/app/config/navbar.config';
import {TAB_CONFIG} from './pages/pages.config';
import {MENU_CONFIG} from '../../front/app/config/menu.config';
import {MenuService} from '../../modules/menu/menu.service';
import {TabbarService} from '../../modules/tabbar';

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

  constructor(private router: Router,
              private menuSvc: MenuService,
              private tabSvc: TabbarService) {
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
  }

  ngOnInit() {
  }

  menu() {
    this.menuSvc.set({show: false});
  }

}
