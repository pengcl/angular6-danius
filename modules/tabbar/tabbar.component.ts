import {Component, Input, OnInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss']
})
export class TabbarComponent implements OnInit, OnDestroy {
  @Input() config;

  constructor() {

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
