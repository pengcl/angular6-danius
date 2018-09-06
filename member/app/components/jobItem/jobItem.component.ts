import {Component, OnInit, Input} from '@angular/core';

import {EDUCATIONS_DATA, EXPERIENCES_DATA, LENGTH_OF_MILITARY_DATA} from '../../../../config/data';

@Component({
  selector: 'app-job-item',
  templateUrl: './jobItem.component.html',
  styleUrls: ['./jobItem.component.scss']
})
export class JobItemComponent implements OnInit {

  @Input() job;

  educations = EDUCATIONS_DATA;
  experiences = EXPERIENCES_DATA;
  lengthOfMilitary = LENGTH_OF_MILITARY_DATA;

  constructor() {
  }

  ngOnInit() {
  }

}
