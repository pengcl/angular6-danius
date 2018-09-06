import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-employer-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class EmployerMapComponent implements OnInit {

  user;

  comForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService) {
    navSvc.set({title: '教育经历'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.comForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
    });
  }

}


