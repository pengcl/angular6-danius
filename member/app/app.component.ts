import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {filter} from 'rxjs/internal/operators';

import {NAV_CONFIG} from './config/navbar.config';
import {MENU_CONFIG} from './config/menu.config';

import {MenuService} from '../../modules/menu/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navConfig = NAV_CONFIG;
  menuConfig = MENU_CONFIG;
  menuShow = false;

  constructor(private router: Router,
              private menuSvc: MenuService) {
    menuSvc.get().subscribe(res => {
      this.menuShow = res.show;
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
