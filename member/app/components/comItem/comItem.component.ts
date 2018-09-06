import {Component, OnInit, Input} from '@angular/core';

import {CONFIG} from '../../../../config/app.config';

@Component({
  selector: 'app-com-item',
  templateUrl: './comItem.component.html',
  styleUrls: ['./comItem.component.scss']
})
export class ComItemComponent implements OnInit {

  @Input() company;
  config = CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
