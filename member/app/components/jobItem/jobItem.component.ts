import {Component, OnInit, Input} from '@angular/core';

import {EDUCATIONS_DATA, EXPERIENCES_DATA, LENGTH_OF_MILITARY_DATA, SALARIES_DATA, SERVICES_DATA} from '../../../../config/data';
import {unshiftObj} from '../../../../commons/js/utils';

@Component({
  selector: 'app-job-item',
  templateUrl: './jobItem.component.html',
  styleUrls: ['./jobItem.component.scss']
})
export class JobItemComponent implements OnInit {

  @Input() job;

  educations = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});
  experiences = unshiftObj(EXPERIENCES_DATA, {label: '不限', value: ''});
  lengthOfMilitary = unshiftObj(LENGTH_OF_MILITARY_DATA, {label: '不限', value: ''});

  constructor() {
  }

  ngOnInit() {
  }

}
