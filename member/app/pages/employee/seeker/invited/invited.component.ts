import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {InfiniteLoaderComponent} from 'ngx-weui';

import {CONFIG} from '../../../../../../config/app.config';
import {StorageService} from '../../../../../../service/storage.service';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {ChatService} from '../../../../services/chat.service';

@Component({
  selector: 'app-employee-seeker-invited',
  templateUrl: './invited.component.html',
  styleUrls: ['./invited.component.scss']
})
export class EmployeeSeekerInvitedComponent implements OnInit {

  config = CONFIG;
  user;
  messages;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private chatSvc: ChatService) {
    navSvc.set({title: '职位管理'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.chatSvc.getMessages(this.user.key).then(res => {
      if (res.code === '0000') {
        this.messages = res.result.list;
      }
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    /*observableTimer(1500).subscribe(() => {
      this.comForm.get('page').setValue(this.comForm.get('page').value + 1);
      this.jobSvc.findJobs(this.comForm.value).then(res => {
        if (res.code === '0000') {
          if (this.comForm.get('page').value >= res.result.totalPage) {
            comp.setFinished();
            return;
          } else {
            this.jobs = this.jobs.concat(res.result.list);
          }
        }
      });
      comp.resolveLoading();
    });*/
  }

}


