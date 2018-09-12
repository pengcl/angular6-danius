import {Component, OnInit, Input} from '@angular/core';

import {CONFIG} from '../../../../config/app.config';
import {EDUCATIONS_DATA, EXPERIENCES_DATA, LENGTH_OF_MILITARY_DATA, SALARIES_DATA, SERVICES_DATA} from '../../../../config/data';
import {unshiftObj} from '../../../../commons/js/utils';

@Component({
  selector: 'app-person-item',
  templateUrl: './personItem.component.html',
  styleUrls: ['./personItem.component.scss']
})
export class PersonItemComponent implements OnInit {

  @Input() employee;

  config = CONFIG;

  educations = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});
  experiences = unshiftObj(EXPERIENCES_DATA, {label: '不限', value: ''});
  lengthOfMilitary = unshiftObj(LENGTH_OF_MILITARY_DATA, {label: '不限', value: ''});

  constructor() {
  }

  ngOnInit() {
  }

}
