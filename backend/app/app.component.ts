import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {filter} from 'rxjs/internal/operators';

import {MenuService} from './modules/menu/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  menuShow;

  constructor(private router: Router,
              private menuSvc: MenuService) {
    menuSvc.get().subscribe(res => {
      this.menuShow = res;
    });

    router.events.pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.menuShow = false;
      });
  }

  ngOnInit() {
  }

  menu() {
    this.menuSvc.hide();
  }
}
