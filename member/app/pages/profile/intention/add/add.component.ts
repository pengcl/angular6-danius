import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {ToastService, DialogService, PickerService} from 'ngx-weui';
import {NavbarService} from '../../../../../../modules/navbar';
import {TabbarService} from '../../../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {OverlayService} from '../../../../../../modules/overlay';
import {JobService} from '../../../../services/job.service';

import {DATA} from '../../../../../../config/cn';

function resetData(arr) {
  const mainArr = [];
  arr.forEach((item) => {
    const mainItem = {};
    let names = item.name;
    const subs = [];
    if (item.sub[0].sub) {
      item.sub.forEach(subItem => {
        names = names + '/' + subItem.name;
        subItem.sub.forEach(v => {
          const sub = {
            name: v.name,
            code: v.code
          };
          subs.push(sub);
        });
      });
    } else {
      item.sub.forEach(subItem => {
        const sub = {
          name: subItem.name,
          code: subItem.code
        };
        subs.push(sub);
      });
    }
    mainItem['name'] = names;
    mainItem['sub'] = subs;
    mainArr.push(mainItem);
  });
  return mainArr;
}

@Component({
  selector: 'app-profile-intention-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class ProfileIntentionAddComponent implements OnInit {

  user;

  intents;
  positions;
  industries;

  selectedIndustries = [];

  intentionsForm: FormGroup;
  isSubmit: Boolean = false;

  cities = (function () {
    const cities = [];
    DATA.forEach(provinceItem => {
      const province = {};
      province['name'] = provinceItem.name;
      province['code'] = provinceItem.code;
      province['sub'] = [];
      const sub = [];
      provinceItem.sub.forEach(cityItem => {
        const city = {};
        city['name'] = cityItem.name;
        city['code'] = cityItem.code;
        province['sub'].push(city);
      });
      cities.push(province);
    });
    return cities;
  })();

  salaries = (function () {
    const arr = [];
    arr.push({
      name: '面议',
      code: '0',
      sub: [
        {
          name: '面议',
          code: '0',
        }
      ]
    });
    for (let i = 1; i <= 50; i++) {
      const obj = {};
      obj['name'] = i.toString();
      obj['code'] = i.toString();
      const sub = [];
      for (let j = i + 1; j <= i * 2; j++) {
        const subObj = {};
        subObj['name'] = j.toString();
        subObj['code'] = j.toString();
        sub.push(subObj);
      }
      obj['sub'] = sub;
      arr.push(obj);
    }

    for (let i = 60; i <= 250; i = i + 10) {
      const obj = {};
      obj['name'] = i.toString();
      obj['code'] = i.toString();
      const sub = [];
      for (let j = i + 10; j <= i * 2 && j <= 260; j = j + 10) {
        const subObj = {};
        subObj['name'] = j.toString();
        subObj['code'] = j.toString();
        sub.push(subObj);
      }
      obj['sub'] = sub;
      arr.push(obj);
    }
    return arr;
  })();

  @ViewChild('container') private container: ElementRef;
  @ViewChild('hd') private hd: ElementRef;
  @ViewChild('bd') private bd: ElementRef;

  constructor(private location: LocationStrategy,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private overlaySvc: OverlayService,
              private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private authSvc: AuthService,
              private userSvc: UserService,
              private jobSvc: JobService) {
    navSvc.set({title: '添加求职意向'});
    tabSvc.set({show: false});
  }

  ngOnInit() {
    this.user = this.authSvc.currentUser;

    this.intentionsForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      id: new FormControl('', []),
      positionid: new FormControl('', [Validators.required]),
      positionname: new FormControl('', [Validators.required]),
      tradeid: new FormControl('', [Validators.required]),
      tradename: new FormControl('', [Validators.required]),
      intentprovince: new FormControl('', [Validators.required]),
      intentprovincecode: new FormControl('', [Validators.required]),
      intentcity: new FormControl('', [Validators.required]),
      intentcitycode: new FormControl('', [Validators.required]),
      salarybegin: new FormControl('', [Validators.required]),
      salaryend: new FormControl('', [Validators.required])
    });

    this.intentionsForm.get('key').setValue(this.user.key);

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.userSvc.get(this.user.key).then(res => {
      if (res.code === '0000') {
        if (res.result.personal) {
          // this.profileForm.get('workstatus').setValue(res.result.personal.workstatus);
        }
      }
    });

    this.userSvc.getIntents(this.user.key).then(res => {
      if (res.code === '0000') {
        this.intents = res.result;
      }
    });

    this.jobSvc.getPositions().then(res => {
      if (res.code === '0000') {
        this.positions = res.result;
      }
    });

    this.jobSvc.getIndustry().then(res => {
      if (res.code === '0000') {
        this.industries = resetData(res.result);
        console.log(this.industries);
      }
    });
  }

  showPositions() {
    this.pickerSvc.showCity(this.positions, this.intentionsForm.get('positionid').value).subscribe(res => {
      this.intentionsForm.get('positionid').setValue(res.items[res.items.length - 1].code);
      this.intentionsForm.get('positionname').setValue(res.items[res.items.length - 1].name);
    });
  }

  showCities() {
    this.pickerSvc.showCity(this.cities, this.intentionsForm.get('intentcitycode').value).subscribe(res => {
      this.intentionsForm.get('intentprovince').setValue(res.items[0].name);
      this.intentionsForm.get('intentprovincecode').setValue(res.items[0].code);
      this.intentionsForm.get('intentcity').setValue(res.items[1].name);
      this.intentionsForm.get('intentcitycode').setValue(res.items[1].code);
    });
  }

  showOverlay(target) {
    this.location.pushState('', target, this.location.path(), '');
    this.overlaySvc.show();
    setTimeout(() => {
      const _height = this.container.nativeElement.offsetHeight - this.hd.nativeElement.offsetHeight;
      this.bd.nativeElement.style.height = _height - 10 + 'px';
    }, 0);
  }

  showSalaries() {
    this.pickerSvc.showCity(this.salaries, '').subscribe(res => {
      this.intentionsForm.get('salarybegin').setValue(res.items[0].code);
      this.intentionsForm.get('salaryend').setValue(res.items[1].code);
    });
  }

  isHave(industry) {
    let result = false;
    this.selectedIndustries.forEach((item, index) => {
      if (item.code === industry.code) {
        result = true;
      }
    });
    return result;
  }

  setIndustry(industry) {
    if (this.selectedIndustries.length === 0) {
      this.selectedIndustries.push(industry);
    } else {
      let _index = -1;
      this.selectedIndustries.forEach((item, index) => {
        if (item.code === industry.code) {
          _index = index;
        }
      });
      if (_index !== -1) {
        this.selectedIndustries.splice(_index, 1);
      } else {
        if (this.selectedIndustries.length < 3) {
          this.selectedIndustries.push(industry);
        }
      }
    }
  }

  save() {
    const ids = [];
    const names = [];
    this.selectedIndustries.forEach(industry => {
      ids.push(industry.code);
      names.push(industry.name);
    });
    this.intentionsForm.get('tradeid').setValue(ids);
    this.intentionsForm.get('tradename').setValue(names);
    this.overlaySvc.hide();
    this.location.back();
  }

  submit() {
    this.isSubmit = true;
    if (this.intentionsForm.invalid) {
      return false;
    }
    this.toastSvc.loading('', 9999);
    this.userSvc.addIntent(this.intentionsForm.value).then(res => {
      console.log(res);
      this.toastSvc.hide();
      if (res.code === '0000') {
        this.location.back();
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

}
