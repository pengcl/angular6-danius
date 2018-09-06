import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {interval as observableInterval, timer as observableTimer} from 'rxjs';

import {CONFIG} from '../../../../../../config/app.config';
import {EDUCATIONS_DATA, EXPERIENCES_DATA, LENGTH_OF_MILITARY_DATA} from '../../../../../../config/data';

import {ToastService, DialogService, PickerService, PTRComponent} from 'ngx-weui';
import {OverlayService} from '../../../../../../modules/overlay';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {ChatService} from '../../../../services/chat.service';
import {JobService} from '../../../../services/job.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-employer-message-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class EmployerMessageItemComponent implements OnInit {
  config = CONFIG;
  user;

  educations = EDUCATIONS_DATA;
  experiences = EXPERIENCES_DATA;
  lengthOfMilitary = LENGTH_OF_MILITARY_DATA;

  id;
  job;
  chat;
  chatForm: FormGroup;
  messageForm: FormGroup;
  inviteForm: FormGroup;
  candidateid;

  scrollHeight: number;

  @ViewChild('container') private container: ElementRef;
  timer;

  disabled = false;
  records: any[] = [];
  page = 1;
  totalPages = 1;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private overlaySvc: OverlayService,
              private pickerSvc: PickerService,
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

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.id = this.route.snapshot.params['id'];
    this.candidateid = this.route.snapshot.queryParams['candidateid'];

    this.chatForm = new FormGroup({
      key: new FormControl(this.user.key, [Validators.required]),
      candidateid: new FormControl(this.candidateid, [Validators.required]),
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
      managementid: new FormControl('', [Validators.required])
    });

    this.inviteForm = new FormGroup({
      key: new FormControl(this.user.key, [Validators.required]),
      candidateid: new FormControl(this.candidateid, [Validators.required]),
      positionid: new FormControl(this.id, [Validators.required]),
      contenttype: new FormControl(6, [Validators.required]),
      interviewtime: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      companyid: new FormControl('', [Validators.required]),
      remark: new FormControl('', [])
    });

    this.userSvc.get(this.user.key).then(res => {
      this.messageForm.get('senderid').setValue(res.result.user.id);
      if (res.result.company) {
        this.inviteForm.get('companyid').setValue(res.result.company.id);
      } else {
        console.error('公司不存在');
      }
    });

    this.jobSvc.getJob(this.user.key, this.id).then(res => {
      if (res.code === '0000') {
        this.job = res.result;
        this.inviteForm.get('address').setValue(this.job.addressprovince + this.job.addresscity + this.job.addressarea + this.job.street);

        this.chatForm.get('managementid').setValue(this.job.userid);
        this.messageForm.get('managementid').setValue(this.job.userid);
      }
    });

    this.chatForm.valueChanges.subscribe(() => {
      if (this.chatForm.valid) {
        this.chatSvc.open(this.chatForm.value).then(res => this.chat = res.result).then(chat => {
          this.messageForm.get('immainid').setValue(chat.id);
          this.chatSvc.get(this.user.key, chat.id).then(res => {
            if (res.code === '0000') {
              this.records = res.result.list.reverse();
              this.totalPages = res.result.totalPages;
              this.toScroll();
            }
          });
        });
      }
    });
  }

  showInvite() {
    this.location.pushState('', 'invite', this.location.path(), '');
    this.overlaySvc.show();
  }

  showPicker() {
    this.pickerSvc.showDateTime('datetime', '', null, new Date()).subscribe(res => {
      this.inviteForm.get('interviewtime').setValue(res.formatValue);
      console.log(res);
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

  submit(type) {
    this.messageForm.get('contenttype').setValue(type);
    if (type === 0) {
      this.messageForm.get('content').enable();
    } else {
      this.messageForm.get('content').disable();
    }

    if (this.messageForm.invalid) {
      return false;
    }

    this.chatSvc.send(this.messageForm.value).then(res => {
      this.records.push(res.result);
      this.messageForm.get('content').setValue('');
      this.messageForm.get('content').enable();
      this.toScroll();
    });
  }

  inviteSubmit() {
    this.chatSvc.send(this.inviteForm.value).then(res => {
      this.records.push(res.result);
      this.location.back();
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
        });
      }
    });
  }

  back() {
    this.location.back();
  }
}


