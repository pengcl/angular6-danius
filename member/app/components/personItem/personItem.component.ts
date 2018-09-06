import {Component, OnInit, Input} from '@angular/core';

import {CONFIG} from '../../../../config/app.config';
import {EDUCATIONS_DATA, EXPERIENCES_DATA, LENGTH_OF_MILITARY_DATA} from '../../../../config/data';

@Component({
  selector: 'app-person-item',
  templateUrl: './personItem.component.html',
  styleUrls: ['./personItem.component.scss']
})
export class PersonItemComponent implements OnInit {

  @Input() employee;

  config = CONFIG;
  educations = EDUCATIONS_DATA;
  experiences = EXPERIENCES_DATA;
  lengthOfMilitary = LENGTH_OF_MILITARY_DATA;

  constructor() {
  }

  ngOnInit() {
  }

}
