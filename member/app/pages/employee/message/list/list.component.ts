import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {CONFIG} from '../../../../../../config/app.config';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {ChatService} from '../../../../services/chat.service';

@Component({
  selector: 'app-employee-message-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployeeMessageListComponent implements OnInit {
  config = CONFIG;

  user;
  messages;

  constructor(private route: ActivatedRoute,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private chatSvc: ChatService) {
    navSvc.set({title: '我的消息'});
    tabSvc.set({show: true}, 2);
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.chatSvc.getMessages(this.user.key).then(res => {
      if (res.code === '0000') {
        this.messages = res.result.list;
      }
    });
  }

}


