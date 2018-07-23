import {Component, OnInit} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {DialogService, ToastService} from 'ngx-weui';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {OverlayService} from '../../../../../modules/overlay';

@Component({
  selector: 'app-profile-troops',
  templateUrl: './troops.component.html',
  styleUrls: ['./troops.component.scss']
})
export class ProfileTroopsComponent implements OnInit {

  user;
  formControl = '';

  skills;
  profileForm: FormGroup;

  constructor(private location: LocationStrategy,
              private dialogSvc: DialogService,
              private toastSvc: ToastService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private overlaySvc: OverlayService) {
    navSvc.set({title: '部队资料'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.profileForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      armyserveplace: new FormControl('', [Validators.required]),
      isspecialarms: new FormControl('', [Validators.required]),
      skillids: new FormControl('', [Validators.required]),
      skillnames: new FormControl('', [Validators.required])
    });

    this.profileForm.get('key').setValue(this.user.key);

    // this.profileForm.get('isSpecial').setValue(true);
    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.userSvc.get(this.user.key).then(res => {
      console.log(res.result);
      if (res.result.personal) {
        this.profileForm.get('armyserveplace').setValue(res.result.personal.armyserveplace);
        this.profileForm.get('isspecialarms').setValue(res.result.personal.isspecialarms);
        this.profileForm.get('skillids').setValue(res.result.personal.skillids);
        this.profileForm.get('skillnames').setValue(res.result.personal.skillnames);
      }
    });

    this.userSvc.getSkills(this.user.key).then(res => {
      this.skills = res.result;
      console.log(this.skills);
    });
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  setSkills(skill) {
    const ids = this.profileForm.get('skillids');
    const names = this.profileForm.get('skillnames');
    if (!names.value) {
      ids.setValue(skill.id);
      names.setValue(skill.skillname);
    } else {
      const idValues = ids.value.split(',');
      const nameValues = names.value.split(',');
      const index = idValues.indexOf(skill.id);
      if (index !== -1) {
        idValues.splice(index, 1);
        nameValues.splice(index, 1);
      } else {
        if (idValues.length < 3) {
          idValues.push(skill.id);
          nameValues.push(skill.skillname);
        } else {
          this.dialogSvc.show({content: '最多只能选择3个!', cancel: '继续', confirm: '我选好了'}).subscribe();
        }
      }

      let idValue = '';
      let nameValue = '';
      idValues.forEach(item => {
        if (idValue) {
          idValue = idValue + ',' + item;
        } else {
          idValue = item;
        }
      });

      ids.setValue(idValue);

      nameValues.forEach(item => {
        if (nameValue) {
          nameValue = nameValue + ',' + item;
        } else {
          nameValue = item;
        }
      });

      names.setValue(nameValue);
    }
  }

  inputChange(target) {
    this.formControl = target;
    if (this.profileForm.get(target).value === 2) {
      this.profileForm.get(target).setValue(1);
    } else {
      this.profileForm.get(target).setValue(2);
    }

    this.singleSubmit();
  }

  moreSkill() {
  }

  singleSubmit() {
    const body = {};
    body['key'] = this.profileForm.get('key').value;
    if (this.formControl === 'skills') {
      body['skillids'] = this.profileForm.get('skillids').value;
      body['skillnames'] = this.profileForm.get('skillnames').value;
    } else {
      body[this.formControl] = this.profileForm.get(this.formControl).value;
    }
    this.toastSvc.loading('', 99999);
    this.userSvc.set(body).then(res => {
      this.toastSvc.hide();
    });
  }

  overlaySubmit() {
    if (this.formControl === 'skills') {
      if (this.profileForm.get('skillids').invalid) {
        return false;
      }
      if (this.profileForm.get('skillnames').invalid) {
        return false;
      }
    } else {
      if (this.profileForm.get(this.formControl).invalid) {
        return false;
      }
    }
    this.location.back();
    this.overlaySvc.hide();
    this.singleSubmit();
  }

  onSubmit() {
    this.location.back();
  }

}
