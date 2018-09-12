import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  user;

  constructor(private authSvc: AuthService) {
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
  }

}
