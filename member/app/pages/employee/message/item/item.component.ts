import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {CONFIG} from '../../../../../../config/app.config';
import {EDUCATIONS_DATA, EXPERIENCES_DATA, LENGTH_OF_MILITARY_DATA} from '../../../../../../config/data';

import {DialogService, PTRComponent} from 'ngx-weui';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {JobService} from '../../../../services/job.service';
import {ChatService} from '../../../../services/chat.service';

@Component({
  selector: 'app-employee-message-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class EmployeeMessageItemComponent implements OnInit {
  config = CONFIG;
  user;

  educations = EDUCATIONS_DATA;
  experiences = EXPERIENCES_DATA;
  lengthOfMilitary = LENGTH_OF_MILITARY_DATA;

  id;
  job;
  chart;
  chartForm: FormGroup;
  messageForm: FormGroup;

  scrollHeight: number;

  @ViewChild('container') private container: ElementRef;
  timer;

  disabled = false;
  records: any[] = [];
  page = 1;
  totalPages = 1;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private jobSvc: JobService,
              private chatSvc: ChatService) {
    navSvc.set({title: '职位管理'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;
    this.id = this.route.snapshot.params['id'];

    this.chartForm = new FormGroup({
      key: new FormControl(this.user.key, [Validators.required]),
      candidateid: new FormControl('', [Validators.required]),
      positionid: new FormControl(this.id, [Validators.required]),
      managementid: new FormControl('', [Validators.required])
    });

    this.messageForm = new FormGroup({
      key: new FormControl(this.user.key, [Validators.required]),
      immainid: new FormControl('', [Validators.required]),
      senderid: new FormControl('', [Validators.required]),
      positionid: new FormControl(this.id, [Validators.required]),
      contenttype: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      managementid: new FormControl('', [Validators.required]),
      datastate: new FormControl('', [])
    });

    this.userSvc.get(this.user.key).then(res => {
      this.chartForm.get('candidateid').setValue(res.result.user.id);
      this.messageForm.get('senderid').setValue(res.result.user.id);
    });

    this.jobSvc.getJob(this.user.key, this.id).then(res => {
      if (res.code === '0000') {
        this.job = res.result;
        this.chartForm.get('managementid').setValue(this.job.userid);
        this.messageForm.get('managementid').setValue(this.job.userid);
      }
    });

    this.chartForm.valueChanges.subscribe(() => {
      if (this.chartForm.valid) {
        this.chatSvc.open(this.chartForm.value).then(res => this.chart = res.result).then(chart => {
          this.messageForm.get('immainid').setValue(chart.id);
          this.chatSvc.get(this.user.key, chart.id).then(res => {
            if (res.code === '0000') {
              this.records = res.result.list.reverse();
              this.totalPages = res.result.totalPages;
              console.log(this.records);
              this.toScroll();
            }
          });
        });
      }
    });
  }

  // 平滑滚动动画
  toScroll() {
    observableTimer(300).subscribe(() => {
      let count = 1;
      const top = this.container.nativeElement.scrollTop;
      const height = this.container.nativeElement.scrollHeight;

      this.timer = observableInterval(16.6).subscribe(() => {
        if (count === 50) {
          this.timer.unsubscribe();
        } else {
          const now = top + (height - top) * count / 50;
          this.scrollHeight = this.container.nativeElement.scrollHeight;
          this.container.nativeElement.scrollTop = now;
          count = count + 1;
        }
      });
    });
  }

  submit(type, datastate?) {

    // 响应交互
    if (!datastate) {
      this.messageForm.get('datastate').disable();
    } else {
      this.messageForm.get('datastate').enable();
      this.messageForm.get('datastate').setValue(datastate);
    }

    // 主动交互
    if (type === 0) {
      this.messageForm.get('content').enable();
    } else {
      this.messageForm.get('content').disable();
    }

    this.messageForm.get('contenttype').setValue(type);

    if (this.messageForm.invalid) {
      return false;
    }

    this.chatSvc.send(this.messageForm.value).then(res => {
      console.log(res);
      this.records.push(res.result);
      this.messageForm.get('content').setValue('');
      this.messageForm.get('content').enable();
      this.toScroll();
    });
  }

  onRefresh(ptr: PTRComponent) {
    observableTimer(800).subscribe(() => {
      this.page = this.page + 1;
      if (this.page >= this.totalPages) {
        ptr.setFinished();
      } else {
        this.chatSvc.get(this.user.key, this.messageForm.get('immainid').value, this.page).then(res => {
          if (res.code === '0000') {
            this.records = res.result.list.reverse().concat(this.records);
            this.totalPages = res.result.totalPages;
            ptr.setFinished();
          }
          console.log(res);
        });
      }
    });
  }

  back() {
    this.location.back();
  }

}


