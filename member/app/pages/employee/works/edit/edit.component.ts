import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {DialogService, PickerService} from 'ngx-weui';
import {OverlayService} from '../../../../../../modules/overlay';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-employee-works-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EmployeeWorksEditComponent implements OnInit {

  user;
  formControl = '';

  profileForm: FormGroup;

  constructor(private location: LocationStrategy,
              private route: ActivatedRoute,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private overlaySvc: OverlayService) {
    navSvc.set({title: '工作经历'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.profileForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
      shortname: new FormControl('', [Validators.required]),
      rolename: new FormControl('', [Validators.required]),
      begindate: new FormControl('', [Validators.required]),
      enddate: new FormControl('', [Validators.required]),
      jobcontent: new FormControl('', [Validators.required])
    });

    this.profileForm.get('key').setValue(this.user.key);

    this.userSvc.getWork(this.user.key, this.route.snapshot.params['id']).then(res => {
      if (res.code === '0000') {
        console.log(res);
        this.profileForm.get('id').setValue(res.result.id);
        this.profileForm.get('shortname').setValue(res.result.shortname);
        this.profileForm.get('rolename').setValue(res.result.rolename);
        this.profileForm.get('begindate').setValue(res.result.begindate);
        this.profileForm.get('enddate').setValue(res.result.enddate);
        this.profileForm.get('jobcontent').setValue(res.result.jobcontent);
      }
    });

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  showDate(target) {
    const defaultDate = this.profileForm.get(target).value ? this.profileForm.get(target).value : '1998-01';
    this.pickerSvc.showDateTime('date-ym', '', new Date(defaultDate))
      .subscribe(res => {
        this.profileForm.get(target).setValue(res.formatValue);
      });
  }

  overlaySubmit() {
    this.location.back();
    this.overlaySvc.hide();
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return false;
    }

    this.userSvc.editWork(this.profileForm.value).then(res => {
      if (res.code === '0000') {
        this.location.back();
      }
    });
  }

}
