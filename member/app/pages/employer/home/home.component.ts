import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-employer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class EmployerHomeComponent implements OnInit {

  user;
  company;

  comForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService) {
    navSvc.set({title: '会员中心'});
    tabSvc.set({show: true}, 2);
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.comForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
    });

    this.userSvc.get(this.user.key).then(res => {
      this.company = res.result.company;
      console.log(res);
    });
  }

  logout() {
    this.authSvc.logout();
  }

}


