import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {EVALUATE_DATA} from '../../../../../../config/data';
import {StorageService} from '../../../../../../service/storage.service';
import {DialogService} from 'ngx-weui';
import {OverlayService} from '../../../../../../modules/overlay';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {EmployeeService} from '../../../../services/employee.service';

@Component({
  selector: 'app-employee-seeker-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EmployeeSeekerEvaluateComponent implements OnInit {

  user;
  interview;
  state;
  labels: any[] = [];
  tags: any[] = [];

  evaluateForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private dialogSvc: DialogService,
              private overlaySvc: OverlayService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private employeeSvc: EmployeeService) {
    navSvc.set({title: '面试'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.evaluateForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required]),
    });

    this.employeeSvc.getInterview(this.user.key, this.route.snapshot.params['id']).then(res => {
      if (res.code === '0000') {
        this.interview = res.result;
        if (this.interview.interviewstate === '2') {
          this.overlaySvc.show();
        }
        console.log(this.interview);
      }
    });
  }

  setState(state) {
    this.state = state;
    this.labels = EVALUATE_DATA[state];
  }

  setLabels(item) {
    const tags = this.evaluateForm.get('tags');
    if (!tags.value) {
      tags.setValue(item.label);
    } else {
      const tagsValue = tags.value.split(',');
      const index = tagsValue.indexOf(item.label);
      if (index !== -1) {
        tagsValue.splice(index, 1);
      } else {
        if (tagsValue.length < 3) {
          tagsValue.push(item.label);
        } else {
          this.dialogSvc.show({content: '最多只能选择3个!', cancel: '继续', confirm: '我选好了'}).subscribe();
        }
      }

      let tagValue = '';

      tagsValue.forEach(value => {
        if (tagValue) {
          tagValue = tagValue + ',' + value;
        } else {
          tagValue = value;
        }
      });
      tags.setValue(tagValue);
    }
  }

  evaluate() {
    this.overlaySvc.hide();
  }

}


