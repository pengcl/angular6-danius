import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {StorageService} from '../../../../../../service/storage.service';
import {OverlayService} from '../../../../../../modules/overlay';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {PickerService, DialogService, ToastService} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {JobService} from '../../../../services/job.service';

import {getIndex, getNameFormCode, unshiftObj} from '../../../../../../commons/js/utils';
import {
  SERVICES_DATA,
  EDUCATIONS_DATA,
  EXPERIENCES_DATA,
  LENGTH_OF_MILITARY_DATA,
  SALARIES_DATA
} from '../../../../../../config/data';

@Component({
  selector: 'app-employer-job-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class EmployerJobAddComponent implements OnInit {

  user;
  positions;
  skills;

  educations = unshiftObj(EDUCATIONS_DATA, {label: '不限', value: ''});
  experiences = unshiftObj(EXPERIENCES_DATA, {label: '不限', value: ''});
  lengthOfMilitary = unshiftObj(LENGTH_OF_MILITARY_DATA, {label: '不限', value: ''});
  salaries = unshiftObj(SALARIES_DATA, {name: '面议', code: '0'});
  services = unshiftObj(SERVICES_DATA, {name: '不限', code: '100000', sub: [{name: '不限', code: '100100'}]});

  comForm: FormGroup;
  formControl;

  isOverlaySubmit: Boolean = false;
  isSubmit: Boolean = false;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private storageSvc: StorageService,
              private overlaySvc: OverlayService,
              private pickerSvc: PickerService,
              private dialogSvc: DialogService,
              private toastSvc: ToastService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private jobSvc: JobService) {
    navSvc.set({show: false, title: '发布职位'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.comForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
      type: new FormControl('', []), // save | release
      companyid: new FormControl('', [Validators.required]),
      positionid: new FormControl('', [Validators.required]),
      positionname: new FormControl('', [Validators.required]),
      postname: new FormControl('', [Validators.required]),
      addressprovince: new FormControl('', [Validators.required]),
      addressprovincecode: new FormControl('', [Validators.required]),
      addresscity: new FormControl('', [Validators.required]),
      addresscitycode: new FormControl('', [Validators.required]),
      addressarea: new FormControl('', [Validators.required]),
      addressareacode: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      doornumber: new FormControl('', [Validators.required]),
      skillids: new FormControl('', [Validators.required]),
      skillnames: new FormControl('', [Validators.required]),
      salarybegin: new FormControl('', [Validators.required]),
      salaryend: new FormControl('', [Validators.required]),
      armytype: new FormControl('', [Validators.required]),
      services: new FormControl('', [Validators.required]),
      serviceage: new FormControl('', []),
      experiencetype: new FormControl('', []),
      limiteducationtype: new FormControl('', []),
      positiondesc: new FormControl('', [Validators.required]),
      longitude: new FormControl('', []),
      latitude: new FormControl('', [])
    });

    this.comForm.get('key').setValue(this.user.key);
    this.comForm.get('armytype').setValue(this.services[0].code);
    this.comForm.get('services').setValue(this.services[0].sub[0].code);

    this.userSvc.get(this.user.key).then(res => {

      if (res.code !== '0000') {// 如果获取接口失败
        return false;
      }

      this.comForm.get('companyid').setValue(res.result.company.id);
      this.comForm.valueChanges.forEach(values => {
        this.storageSvc.set('comForm', JSON.stringify(values));
      });

      if (!this.storageSvc.get('comForm')) {// 如果没有缓存
        return false;
      }

      const storageForm = JSON.parse(this.storageSvc.get('comForm'));

      if (storageForm['companyid'] !== res.result.company.id) {// 如果公司不一至
        return false;
      }

      for (const key in storageForm) {
        if (this.comForm.get(key)) {// 如果表单中存在[key]字段
          this.comForm.get(key).setValue(storageForm[key]);
        }
      }
    });

    this.jobSvc.getPositions().then(res => {
      if (res.code === '0000') {
        this.positions = res.result;
      }
    });

    this.userSvc.getSkills(this.user.key).then(res => {
      this.skills = res.result;
    });
  }

  getIndex(arr, key, value) {
    return getIndex(arr, key, value);
  }

  getNameFormCode(arr, code) {
    return getNameFormCode(arr, code);
  }

  showPositions() {
    this.pickerSvc.showCity(this.positions, this.comForm.get('positionid').value).subscribe(res => {
      this.comForm.get('positionid').setValue(res.items[res.items.length - 1].code);
      this.comForm.get('positionname').setValue(res.items[res.items.length - 1].name);
    });
  }

  showSalaries() {
    this.pickerSvc.showCity(this.salaries, this.comForm.get('salaryend').value).subscribe(res => {
      this.comForm.get('salarybegin').setValue(res.items[0].code);
      this.comForm.get('salaryend').setValue(res.items[1].code);
    });
  }

  showServices() {
    this.pickerSvc.showCity(this.services, this.comForm.get('services').value).subscribe(res => {
      this.comForm.get('armytype').setValue(res.items[0].code);
      this.comForm.get('services').setValue(res.items[1].code);
    });
  }

  showEducations() {
    const defaultSelected = this.comForm.get('limiteducationtype').value ? parseInt(this.comForm.get('limiteducationtype').value, 10) : 0;

    this.pickerSvc.show([this.educations], '', [defaultSelected], {cancel: '返回', confirm: '确定'}).subscribe(res => {
      this.comForm.get('limiteducationtype').setValue(res.items[0].value);
    });
  }

  showExperiences() {
    const defaultSelected = this.comForm.get('experiencetype').value ? parseInt(this.comForm.get('experiencetype').value, 10) : 0;

    this.pickerSvc.show([this.experiences], '', [defaultSelected], {cancel: '返回', confirm: '确定'}).subscribe(res => {
      this.comForm.get('experiencetype').setValue(res.items[0].value);
    });
  }

  showLengths() {
    const defaultSelected = getIndex(this.lengthOfMilitary, 'value', this.comForm.get('serviceage').value);

    this.pickerSvc.show([this.lengthOfMilitary], '', [defaultSelected], {cancel: '返回', confirm: '确定'}).subscribe(res => {
      this.comForm.get('serviceage').setValue(res.items[0].value);
    });
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.formControl = target;
    this.overlaySvc.show();
  }

  setSkills(skill) {
    const ids = this.comForm.get('skillids');
    const names = this.comForm.get('skillnames');
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

  moreSkill() {
  }

  singleSubmit() {
    const body = {};
    body['key'] = this.comForm.get('key').value;
    body['id'] = this.comForm.get('id').value;
    body['companyid'] = this.comForm.get('companyid').value;
    if (this.formControl === 'skills') {
      body['skillids'] = this.comForm.get('skillids').value;
      body['skillnames'] = this.comForm.get('skillnames').value;
    } else {
      body[this.formControl] = this.comForm.get(this.formControl).value;
    }
  }

  overlaySubmit() {
    this.isOverlaySubmit = true;
    if (this.formControl === 'skills') {
      if (this.comForm.get('skillids').invalid) {
        return false;
      }
      if (this.comForm.get('skillnames').invalid) {
        return false;
      }
    } else {
      if (this.comForm.get(this.formControl).invalid) {
        return false;
      }
    }

    this.isOverlaySubmit = false;
    this.location.back();
    this.overlaySvc.hide();
    this.singleSubmit();
  }

  save() {
    this.isSubmit = true;
    this.comForm.get('type').setValue('save');
    if (this.comForm.get('postname').invalid) {
      this.dialogSvc.show({content: '必须填写职位名称才能保存哦！', cancel: '', confirm: '我知道了'}).subscribe();
      return false;
    }

    this.toastSvc.loading('保存中', 9999);
    this.jobSvc.post(this.comForm.value).then(res => {
      this.toastSvc.hide();
      if (res.code === '0000') {
        this.overlaySvc.hide();
        this.comForm.get('id').setValue(res.result.id);
        this.dialogSvc.show({content: '您发布的职位保存成功', cancel: '', confirm: '我知道了'}).subscribe(data => {
          this.location.back();
        });
      }
    });
  }

  release() {
    this.isSubmit = true;
    this.comForm.get('type').setValue('release');
  }
}
