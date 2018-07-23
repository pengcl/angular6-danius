import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() config;
  menu;

  constructor(private menuSvc: MenuService) {
  }

  ngOnInit() {
    this.menuSvc.get().subscribe(res => {
      this.menu = res;
    });
    this.menuSvc.set(this.config);
  }
}
