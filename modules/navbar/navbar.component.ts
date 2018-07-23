import {Component, Input, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {MenuService} from '../../modules/menu/menu.service';
import {NavbarService} from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() config;

  constructor(private titleService: Title,
              private navSvc: NavbarService,
              private menuSvc: MenuService) {
  }

  ngOnInit() {
    this.navSvc.get().subscribe(res => {
      this.config = res;
      this.titleService.setTitle(res.title);
    });

    this.navSvc.set(this.config);
  }

  menu() {
    this.menuSvc.set({show: true});
  }

}
